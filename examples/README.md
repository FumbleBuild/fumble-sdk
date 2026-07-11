# Fumble SDK Examples

This directory contains example code demonstrating how to use the Fumble SDK.

## Running the Examples

### Using TypeScript directly

```bash
# Install dependencies first
npm install

# Run the basic usage example
npx ts-node examples/basic-usage.ts
```

### Using the compiled JavaScript

```bash
# Build the SDK
npm run build

# Compile the example
npx tsc examples/basic-usage.ts --outDir examples/dist --module commonjs

# Run the compiled example
node examples/dist/basic-usage.js
```

## Available Examples

### basic-usage.ts

Demonstrates the core functionality of the SDK:
- Initializing the client
- Getting account information
- Sending transactions
- Executing program instructions
- Generating and verifying proofs (Merkle, zk-SNARK, signature)
- Finding swap routes
- Executing swaps
- Checking network status

## Learn More

For more detailed information, see the main [README](../README.md).
