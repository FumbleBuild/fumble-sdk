import { ProofGenerator } from './ProofGenerator';
import { ProofError } from '../utils/errors';

describe('ProofGenerator', () => {
  let generator: ProofGenerator;

  beforeEach(() => {
    generator = new ProofGenerator();
  });

  describe('generateProof', () => {
    it('should generate Merkle proof', async () => {
      const proof = await generator.generateProof({
        type: 'merkle',
        data: { value: 'test-data' },
        witness: {
          root: 'root-hash',
          path: ['hash1', 'hash2'],
        },
      });

      expect(proof).toBeDefined();
      expect(proof.type).toBe('merkle');
      expect(proof.proof).toBeDefined();
      expect(proof.publicInputs).toBeDefined();
      expect(proof.isValid).toBe(true);
    });

    it('should generate zk-SNARK proof', async () => {
      const proof = await generator.generateProof({
        type: 'zk-snark',
        data: { secret: 'secret-value' },
        witness: { commitment: 'commitment' },
      });

      expect(proof).toBeDefined();
      expect(proof.type).toBe('zk-snark');
      expect(proof.proof).toBeDefined();
      expect(proof.publicInputs.length).toBeGreaterThan(0);
    });

    it('should generate signature proof', async () => {
      const proof = await generator.generateProof({
        type: 'signature',
        data: { message: 'sign-this' },
        witness: { privateKey: 'private-key' },
      });

      expect(proof).toBeDefined();
      expect(proof.type).toBe('signature');
      expect(proof.proof).toBeDefined();
    });

    it('should throw error for unsupported proof type', async () => {
      await expect(
        generator.generateProof({
          type: 'unsupported' as any,
          data: {},
        })
      ).rejects.toThrow(ProofError);
    });
  });

  describe('verifyProof', () => {
    it('should verify valid Merkle proof', async () => {
      const proof = await generator.generateProof({
        type: 'merkle',
        data: { value: 'test' },
      });

      const isValid = await generator.verifyProof(proof);
      expect(isValid).toBe(true);
    });

    it('should verify valid zk-SNARK proof', async () => {
      const proof = await generator.generateProof({
        type: 'zk-snark',
        data: { value: 'test' },
      });

      const isValid = await generator.verifyProof(proof);
      expect(isValid).toBe(true);
    });

    it('should verify valid signature proof', async () => {
      const proof = await generator.generateProof({
        type: 'signature',
        data: { value: 'test' },
      });

      const isValid = await generator.verifyProof(proof);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid proof', async () => {
      const isValid = await generator.verifyProof({
        type: 'invalid',
        proof: '',
        publicInputs: [],
        timestamp: Date.now(),
        isValid: false,
      });

      expect(isValid).toBe(false);
    });
  });
});
