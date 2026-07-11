/**
 * Configuration options for the Fumble SDK client
 */
export interface FumbleConfig {
  /** The RPC endpoint URL for the Fumble network */
  rpcEndpoint: string;
  /** Optional API key for authenticated requests */
  apiKey?: string;
  /** Network environment (mainnet, testnet, devnet) */
  network?: 'mainnet' | 'testnet' | 'devnet';
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Transaction parameters for protocol interactions
 */
export interface TransactionParams {
  /** Transaction amount in smallest unit */
  amount: string;
  /** Recipient address */
  recipient: string;
  /** Optional transaction memo */
  memo?: string;
  /** Optional fee amount */
  fee?: string;
}

/**
 * Result of a transaction submission
 */
export interface TransactionResult {
  /** Transaction signature/hash */
  signature: string;
  /** Transaction status */
  status: 'pending' | 'confirmed' | 'failed';
  /** Block height where transaction was included */
  blockHeight?: number;
  /** Timestamp of the transaction */
  timestamp: number;
}

/**
 * Account information
 */
export interface AccountInfo {
  /** Account address */
  address: string;
  /** Account balance in smallest unit */
  balance: string;
  /** Account nonce for transactions */
  nonce: number;
  /** Whether account is initialized */
  initialized: boolean;
}

/**
 * Program instruction parameters
 */
export interface ProgramInstruction {
  /** Program ID to interact with */
  programId: string;
  /** Instruction data */
  data: Buffer | Uint8Array;
  /** Accounts involved in the instruction */
  accounts: Array<{
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }>;
}

/**
 * Proof generation parameters
 */
export interface ProofParams {
  /** Type of proof to generate */
  type: 'merkle' | 'zk-snark' | 'signature';
  /** Data to generate proof for */
  data: any;
  /** Optional witness data */
  witness?: any;
}

/**
 * Generated proof
 */
export interface Proof {
  /** Type of proof */
  type: string;
  /** Proof data */
  proof: string;
  /** Public inputs used in proof */
  publicInputs: string[];
  /** Timestamp of proof generation */
  timestamp: number;
  /** Whether proof is valid */
  isValid: boolean;
}

/**
 * Swap route parameters
 */
export interface SwapParams {
  /** Input token address */
  inputMint: string;
  /** Output token address */
  outputMint: string;
  /** Amount of input tokens */
  amount: string;
  /** Maximum slippage tolerance (in percentage) */
  slippageTolerance: number;
  /** User's wallet address */
  userAddress: string;
}

/**
 * Swap route information
 */
export interface SwapRoute {
  /** Route identifier */
  routeId: string;
  /** Input token amount */
  inputAmount: string;
  /** Expected output amount */
  outputAmount: string;
  /** Minimum output amount considering slippage */
  minimumOutputAmount: string;
  /** Price impact percentage */
  priceImpact: number;
  /** Array of pools used in the route */
  pools: Array<{
    poolId: string;
    tokenIn: string;
    tokenOut: string;
    fee: number;
  }>;
  /** Estimated fee */
  fee: string;
}

/**
 * Swap execution result
 */
export interface SwapResult {
  /** Transaction signature */
  signature: string;
  /** Actual input amount */
  inputAmount: string;
  /** Actual output amount */
  outputAmount: string;
  /** Status of the swap */
  status: 'success' | 'failed' | 'pending';
  /** Timestamp of swap execution */
  timestamp: number;
}

/**
 * Intelligence signal from Bittensor subnets
 */
export interface SignalParams {
  /** Subnet ID to query */
  subnetId: number;
  /** Type of signal to request */
  signalType: 'price' | 'sentiment' | 'risk' | 'forecast';
  /** Target asset or market identifier */
  target: string;
}

/**
 * Intelligence signal result
 */
export interface SignalResult {
  /** Subnet that produced the signal */
  subnetId: number;
  /** Signal type */
  signalType: string;
  /** Confidence-weighted signal value */
  value: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** Block number when signal was produced */
  blockNumber: number;
  /** Timestamp */
  timestamp: number;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Agent type */
  type: 'trading' | 'arbitrage' | 'yield' | 'risk' | 'governance';
  /** Maximum allocation in smallest unit */
  maxAllocation: string;
  /** Slippage tolerance */
  slippageTolerance: number;
  /** Target protocols to interact with */
  protocols: string[];
}

/**
 * Agent execution result
 */
export interface AgentResult {
  /** Agent type that executed */
  agentType: string;
  /** Action taken */
  action: string;
  /** Transaction signatures from execution */
  signatures: string[];
  /** Status */
  status: 'success' | 'failed' | 'pending';
  /** Timestamp */
  timestamp: number;
}

/**
 * Error response from API
 */
export interface ApiError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Additional error details */
  details?: any;
}
