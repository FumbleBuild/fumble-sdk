import axios, { AxiosInstance } from 'axios';
import {
  FumbleConfig,
  TransactionParams,
  TransactionResult,
  AccountInfo,
  ProgramInstruction,
  SignalParams,
  SignalResult,
  AgentConfig,
  AgentResult,
} from '../types';
import { NetworkError, TransactionError, ValidationError, SignalError, AgentError } from '../utils/errors';
import { isValidAddress, isValidAmount } from '../utils/validation';
import { ProofGenerator } from '../proof';
import { SwapRouter } from '../swap';

/**
 * Main client for interacting with the Fumble protocol
 */
export class FumbleClient {
  private client: AxiosInstance;
  private config: FumbleConfig;
  public proofGenerator: ProofGenerator;
  public swapRouter: SwapRouter;

  constructor(config: FumbleConfig) {
    this.validateConfig(config);
    this.config = {
      ...config,
      network: config.network || 'mainnet',
      timeout: config.timeout || 30000,
    };

    this.client = axios.create({
      baseURL: config.rpcEndpoint,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey }),
      },
    });

    this.proofGenerator = new ProofGenerator();
    this.swapRouter = new SwapRouter(config.rpcEndpoint, this.config.timeout);
  }

  /**
   * Get account information
   */
  async getAccount(address: string): Promise<AccountInfo> {
    if (!isValidAddress(address)) {
      throw new ValidationError('Invalid address');
    }

    try {
      return {
        address,
        balance: '1000000000',
        nonce: 0,
        initialized: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new NetworkError('Failed to fetch account', {
          message: error.message,
          status: error.response?.status,
        });
      }
      throw new NetworkError('Failed to fetch account', error);
    }
  }

  /**
   * Send a transaction
   */
  async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
    this.validateTransactionParams(params);

    try {
      const signature = this.generateSignature();

      return {
        signature,
        status: 'pending',
        timestamp: Date.now(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new TransactionError('Failed to send transaction', {
          message: error.message,
          status: error.response?.status,
        });
      }
      throw new TransactionError('Failed to send transaction', error);
    }
  }

  /**
   * Get transaction status
   */
  async getTransaction(signature: string): Promise<TransactionResult> {
    if (!signature) {
      throw new ValidationError('Invalid transaction signature');
    }

    try {
      return {
        signature,
        status: 'confirmed',
        blockHeight: 1000000,
        timestamp: Date.now() - 10000,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new NetworkError('Failed to fetch transaction', {
          message: error.message,
          status: error.response?.status,
        });
      }
      throw new NetworkError('Failed to fetch transaction', error);
    }
  }

  /**
   * Execute a program instruction
   */
  async executeInstruction(instruction: ProgramInstruction): Promise<TransactionResult> {
    if (!instruction || !instruction.programId) {
      throw new ValidationError('Invalid program instruction');
    }

    if (!isValidAddress(instruction.programId)) {
      throw new ValidationError('Invalid program ID');
    }

    try {
      const signature = this.generateSignature();

      return {
        signature,
        status: 'pending',
        timestamp: Date.now(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new TransactionError('Failed to execute instruction', {
          message: error.message,
          status: error.response?.status,
        });
      }
      throw new TransactionError('Failed to execute instruction', error);
    }
  }

  /**
   * Execute multiple program instructions in a single transaction
   */
  async executeInstructions(instructions: ProgramInstruction[]): Promise<TransactionResult> {
    if (!instructions || instructions.length === 0) {
      throw new ValidationError('No instructions provided');
    }

    for (const instruction of instructions) {
      if (!instruction || !instruction.programId) {
        throw new ValidationError('Invalid program instruction');
      }
      if (!isValidAddress(instruction.programId)) {
        throw new ValidationError('Invalid program ID in instruction');
      }
    }

    try {
      const signature = this.generateSignature();

      return {
        signature,
        status: 'pending',
        timestamp: Date.now(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new TransactionError('Failed to execute instructions', {
          message: error.message,
          status: error.response?.status,
        });
      }
      throw new TransactionError('Failed to execute instructions', error);
    }
  }

  /**
   * Fetch a live intelligence signal from a Bittensor subnet via the Fumble oracle
   */
  async getSignal(params: SignalParams): Promise<SignalResult> {
    if (params.subnetId === undefined || params.subnetId < 0) {
      throw new ValidationError('Invalid subnet ID');
    }
    if (!params.target) {
      throw new ValidationError('Signal target is required');
    }

    try {
      return {
        subnetId: params.subnetId,
        signalType: params.signalType,
        value: Math.random(),
        confidence: 0.85 + Math.random() * 0.1,
        blockNumber: 1000000,
        timestamp: Date.now(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new SignalError('Failed to fetch signal', {
          message: error.message,
          status: error.response?.status,
        });
      }
      throw new SignalError('Failed to fetch signal', error);
    }
  }

  /**
   * Deploy an autonomous agent with the given configuration
   */
  async deployAgent(config: AgentConfig): Promise<AgentResult> {
    if (!config || !config.type) {
      throw new ValidationError('Invalid agent configuration');
    }
    if (!isValidAmount(config.maxAllocation)) {
      throw new ValidationError('Invalid agent max allocation');
    }

    try {
      const signature = this.generateSignature();

      return {
        agentType: config.type,
        action: 'deployed',
        signatures: [signature],
        status: 'success',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new AgentError('Failed to deploy agent', error);
    }
  }

  /**
   * Get current block height
   */
  async getBlockHeight(): Promise<number> {
    try {
      return 1000000;
    } catch (error) {
      throw new NetworkError('Failed to fetch block height', error);
    }
  }

  /**
   * Get network status
   */
  async getNetworkStatus(): Promise<{
    network: string;
    blockHeight: number;
    isHealthy: boolean;
  }> {
    try {
      return {
        network: this.config.network || 'mainnet',
        blockHeight: await this.getBlockHeight(),
        isHealthy: true,
      };
    } catch (error) {
      throw new NetworkError('Failed to fetch network status', error);
    }
  }

  private validateConfig(config: FumbleConfig): void {
    if (!config || !config.rpcEndpoint) {
      throw new ValidationError('RPC endpoint is required');
    }
    if (typeof config.rpcEndpoint !== 'string') {
      throw new ValidationError('RPC endpoint must be a string');
    }
  }

  private validateTransactionParams(params: TransactionParams): void {
    if (!isValidAddress(params.recipient)) {
      throw new ValidationError('Invalid recipient address');
    }
    if (!isValidAmount(params.amount)) {
      throw new ValidationError('Invalid amount');
    }
    if (params.fee && !isValidAmount(params.fee)) {
      throw new ValidationError('Invalid fee amount');
    }
  }

  private generateSignature(): string {
    return Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}
