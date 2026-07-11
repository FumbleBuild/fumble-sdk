import {
  isValidAddress,
  isValidAmount,
  isValidSlippage,
  isValidSignature,
} from './validation';

describe('validation utilities', () => {
  describe('isValidAddress', () => {
    it('should validate correct addresses', () => {
      expect(isValidAddress('a'.repeat(40))).toBe(true);
      expect(isValidAddress('A'.repeat(40))).toBe(true);
      expect(isValidAddress('1'.repeat(40))).toBe(true);
      expect(isValidAddress('abc123'.repeat(7))).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidAddress('')).toBe(false);
      expect(isValidAddress('invalid')).toBe(false);
      expect(isValidAddress('zzz')).toBe(false);
      expect(isValidAddress(null as any)).toBe(false);
      expect(isValidAddress(undefined as any)).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should validate correct amounts', () => {
      expect(isValidAmount('0')).toBe(true);
      expect(isValidAmount('1')).toBe(true);
      expect(isValidAmount('100.50')).toBe(true);
      expect(isValidAmount('1000000')).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(isValidAmount('')).toBe(false);
      expect(isValidAmount('invalid')).toBe(false);
      expect(isValidAmount('-1')).toBe(false);
      expect(isValidAmount(null as any)).toBe(false);
    });
  });

  describe('isValidSlippage', () => {
    it('should validate correct slippage values', () => {
      expect(isValidSlippage(0)).toBe(true);
      expect(isValidSlippage(1)).toBe(true);
      expect(isValidSlippage(50)).toBe(true);
      expect(isValidSlippage(100)).toBe(true);
    });

    it('should reject invalid slippage values', () => {
      expect(isValidSlippage(-1)).toBe(false);
      expect(isValidSlippage(101)).toBe(false);
      expect(isValidSlippage(1000)).toBe(false);
      expect(isValidSlippage(NaN)).toBe(false);
    });
  });

  describe('isValidSignature', () => {
    it('should validate correct signatures', () => {
      expect(isValidSignature('a'.repeat(64))).toBe(true);
      expect(isValidSignature('0'.repeat(128))).toBe(true);
    });

    it('should reject invalid signatures', () => {
      expect(isValidSignature('')).toBe(false);
      expect(isValidSignature('short')).toBe(false);
      expect(isValidSignature('z'.repeat(64))).toBe(false);
      expect(isValidSignature(null as any)).toBe(false);
    });
  });
});
