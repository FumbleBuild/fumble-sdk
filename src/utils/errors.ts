/**
 * Base error class for Fumble SDK errors
 */
export class FumbleError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'FumbleError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, FumbleError.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error thrown when transaction fails
 */
export class TransactionError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
    Object.setPrototypeOf(this, TransactionError.prototype);
  }
}

/**
 * Error thrown when proof generation/verification fails
 */
export class ProofError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'PROOF_ERROR', details);
    this.name = 'ProofError';
    Object.setPrototypeOf(this, ProofError.prototype);
  }
}

/**
 * Error thrown when swap routing fails
 */
export class SwapError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'SWAP_ERROR', details);
    this.name = 'SwapError';
    Object.setPrototypeOf(this, SwapError.prototype);
  }
}

/**
 * Error thrown when signal/intelligence fetch fails
 */
export class SignalError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'SIGNAL_ERROR', details);
    this.name = 'SignalError';
    Object.setPrototypeOf(this, SignalError.prototype);
  }
}

/**
 * Error thrown when agent execution fails
 */
export class AgentError extends FumbleError {
  constructor(message: string, details?: any) {
    super(message, 'AGENT_ERROR', details);
    this.name = 'AgentError';
    Object.setPrototypeOf(this, AgentError.prototype);
  }
}
