import { FumbleClient } from './FumbleClient';
import { ValidationError } from '../utils/errors';

describe('FumbleClient', () => {
  let client: FumbleClient;

  beforeEach(() => {
    client = new FumbleClient({
      rpcEndpoint: 'https://api.test.com',
      network: 'testnet',
    });
  });

  describe('constructor', () => {
    it('should create client with valid config', () => {
      expect(client).toBeDefined();
      expect(client.proofGenerator).toBeDefined();
      expect(client.swapRouter).toBeDefined();
    });

    it('should throw error with invalid config', () => {
      expect(() => {
        new FumbleClient({} as any);
      }).toThrow(ValidationError);
    });
  });

  describe('getAccount', () => {
    it('should get account info', async () => {
      const address = 'a'.repeat(40);
      const account = await client.getAccount(address);

      expect(account).toBeDefined();
      expect(account.address).toBe(address);
      expect(account.balance).toBeDefined();
      expect(account.initialized).toBe(true);
    });

    it('should throw error with invalid address', async () => {
      await expect(client.getAccount('invalid')).rejects.toThrow(ValidationError);
    });
  });

  describe('sendTransaction', () => {
    it('should send transaction', async () => {
      const result = await client.sendTransaction({
        amount: '1000',
        recipient: 'a'.repeat(40),
        memo: 'test',
      });

      expect(result).toBeDefined();
      expect(result.signature).toBeDefined();
      expect(result.status).toBe('pending');
    });

    it('should throw error with invalid recipient', async () => {
      await expect(
        client.sendTransaction({
          amount: '1000',
          recipient: 'invalid',
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error with invalid amount', async () => {
      await expect(
        client.sendTransaction({
          amount: 'invalid',
          recipient: 'a'.repeat(40),
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getTransaction', () => {
    it('should get transaction info', async () => {
      const signature = 'a'.repeat(64);
      const tx = await client.getTransaction(signature);

      expect(tx).toBeDefined();
      expect(tx.signature).toBe(signature);
      expect(tx.status).toBe('confirmed');
    });

    it('should throw error with empty signature', async () => {
      await expect(client.getTransaction('')).rejects.toThrow(ValidationError);
    });
  });

  describe('executeInstruction', () => {
    it('should execute program instruction', async () => {
      const result = await client.executeInstruction({
        programId: 'a'.repeat(40),
        data: Buffer.from('test'),
        accounts: [
          {
            pubkey: 'b'.repeat(40),
            isSigner: true,
            isWritable: true,
          },
        ],
      });

      expect(result).toBeDefined();
      expect(result.signature).toBeDefined();
      expect(result.status).toBe('pending');
    });

    it('should throw error with invalid program ID', async () => {
      await expect(
        client.executeInstruction({
          programId: 'invalid',
          data: Buffer.from('test'),
          accounts: [],
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('executeInstructions', () => {
    it('should execute multiple instructions', async () => {
      const instructions = [
        { programId: 'a'.repeat(40), data: Buffer.from('test1'), accounts: [] },
        { programId: 'b'.repeat(40), data: Buffer.from('test2'), accounts: [] },
      ];

      const result = await client.executeInstructions(instructions);

      expect(result).toBeDefined();
      expect(result.signature).toBeDefined();
    });

    it('should throw error with empty instructions', async () => {
      await expect(client.executeInstructions([])).rejects.toThrow(ValidationError);
    });
  });

  describe('getSignal', () => {
    it('should fetch subnet signal', async () => {
      const signal = await client.getSignal({
        subnetId: 1,
        signalType: 'price',
        target: 'ETH/USDC',
      });

      expect(signal).toBeDefined();
      expect(signal.subnetId).toBe(1);
      expect(signal.signalType).toBe('price');
      expect(signal.confidence).toBeGreaterThan(0);
    });

    it('should throw error with invalid subnet ID', async () => {
      await expect(
        client.getSignal({ subnetId: -1, signalType: 'price', target: 'ETH' })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('deployAgent', () => {
    it('should deploy an agent', async () => {
      const result = await client.deployAgent({
        type: 'trading',
        maxAllocation: '1000000',
        slippageTolerance: 1.0,
        protocols: ['uniswap-v3'],
      });

      expect(result).toBeDefined();
      expect(result.agentType).toBe('trading');
      expect(result.status).toBe('success');
      expect(result.signatures.length).toBeGreaterThan(0);
    });

    it('should throw error with invalid allocation', async () => {
      await expect(
        client.deployAgent({
          type: 'trading',
          maxAllocation: 'invalid',
          slippageTolerance: 1.0,
          protocols: [],
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getBlockHeight', () => {
    it('should get block height', async () => {
      const height = await client.getBlockHeight();
      expect(typeof height).toBe('number');
      expect(height).toBeGreaterThan(0);
    });
  });

  describe('getNetworkStatus', () => {
    it('should get network status', async () => {
      const status = await client.getNetworkStatus();

      expect(status).toBeDefined();
      expect(status.network).toBe('testnet');
      expect(status.blockHeight).toBeGreaterThan(0);
      expect(status.isHealthy).toBe(true);
    });
  });
});
