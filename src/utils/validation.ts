/**
 * Validates if a string is a valid address
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }
  // Basic validation - check if it's a hex string of appropriate length
  return /^[a-fA-F0-9]{40,}$/.test(address);
}

/**
 * Validates if an amount is valid
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || typeof amount !== 'string') {
    return false;
  }
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
}

/**
 * Validates slippage tolerance (0-100)
 */
export function isValidSlippage(slippage: number): boolean {
  return typeof slippage === 'number' && slippage >= 0 && slippage <= 100;
}

/**
 * Validates a transaction signature
 */
export function isValidSignature(signature: string): boolean {
  if (!signature || typeof signature !== 'string') {
    return false;
  }
  return /^[a-fA-F0-9]{64,}$/.test(signature);
}
