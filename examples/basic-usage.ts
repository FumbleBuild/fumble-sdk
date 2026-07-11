/**
 * Basic usage examples for the Fumble SDK
 *
 * Demonstrates core protocol interactions: accounts, transactions,
 * subnet signals, agent deployment, proofs, and swap routing.
 */

import { FumbleClient } from '../src';

async function main() {
  // Initialize the client
  const client = new FumbleClient({
    rpcEndpoint: 'https://api.fumblebuild.xyz',
    network: 'testnet',
    apiKey: 'your-api-key-here', // optional
  });

  console.log('Fumble SDK Examples\n');

  // Example 1: Get account information
  console.log('1. Fetching account information...');
  const account = await client.getAccount('a'.repeat(40));
  console.log('   Address:', account.address);
  console.log('   Balance:', account.balance);
  console.log('   Initialized:', account.initialized);
  console.log('');

  // Example 2: Send a transaction
  console.log('2. Sending a transaction...');
  const txResult = await client.sendTransaction({
    amount: '1000000',
    recipient: 'b'.repeat(40),
    memo: 'wTAO bridge deposit',
  });
  console.log('   Transaction signature:', txResult.signature);
  console.log('   Status:', txResult.status);
  console.log('');

  // Example 3: Fetch a live Bittensor subnet signal
  console.log('3. Fetching subnet intelligence signal...');
  const signal = await client.getSignal({
    subnetId: 1,
    signalType: 'price',
    target: 'ETH/USDC',
  });
  console.log('   Subnet ID:', signal.subnetId);
  console.log('   Signal type:', signal.signalType);
  console.log('   Value:', signal.value.toFixed(4));
  console.log('   Confidence:', (signal.confidence * 100).toFixed(1) + '%');
  console.log('');

  // Example 4: Deploy an autonomous agent
  console.log('4. Deploying trading agent...');
  const agent = await client.deployAgent({
    type: 'trading',
    maxAllocation: '5000000',
    slippageTolerance: 0.5,
    protocols: ['uniswap-v3', 'aave-v3'],
  });
  console.log('   Agent type:', agent.agentType);
  console.log('   Status:', agent.status);
  console.log('   Deployment tx:', agent.signatures[0]);
  console.log('');

  // Example 5: Execute a program instruction
  console.log('5. Executing program instruction...');
  const instructionResult = await client.executeInstruction({
    programId: 'c'.repeat(40),
    data: Buffer.from('instruction-data'),
    accounts: [
      {
        pubkey: 'd'.repeat(40),
        isSigner: true,
        isWritable: true,
      },
    ],
  });
  console.log('   Instruction signature:', instructionResult.signature);
  console.log('');

  // Example 6: Generate a Merkle proof
  console.log('6. Generating Merkle proof...');
  const merkleProof = await client.proofGenerator.generateProof({
    type: 'merkle',
    data: { value: 'subnet-signal-commitment' },
    witness: {
      root: 'merkle-root-hash',
      path: ['hash1', 'hash2', 'hash3'],
    },
  });
  console.log('   Proof type:', merkleProof.type);
  console.log('   Proof valid:', merkleProof.isValid);
  console.log('   Public inputs:', merkleProof.publicInputs);
  console.log('');

  // Example 7: Verify the proof
  console.log('7. Verifying proof...');
  const isValid = await client.proofGenerator.verifyProof(merkleProof);
  console.log('   Proof verification result:', isValid);
  console.log('');

  // Example 8: Find swap route (wTAO → USDC)
  console.log('8. Finding swap route...');
  const route = await client.swapRouter.findRoute({
    inputMint: 'e'.repeat(40),   // wTAO
    outputMint: 'f'.repeat(40),  // USDC
    amount: '1000000',
    slippageTolerance: 1.0,
    userAddress: '1'.repeat(40),
  });
  console.log('   Route ID:', route.routeId);
  console.log('   Input amount:', route.inputAmount);
  console.log('   Expected output:', route.outputAmount);
  console.log('   Price impact:', route.priceImpact.toFixed(2) + '%');
  console.log('   Pools used:', route.pools.length);
  console.log('');

  // Example 9: Execute swap
  console.log('9. Executing swap...');
  const swapResult = await client.swapRouter.executeSwap(route);
  console.log('   Swap signature:', swapResult.signature);
  console.log('   Status:', swapResult.status);
  console.log('   Actual output:', swapResult.outputAmount);
  console.log('');

  // Example 10: Get network status
  console.log('10. Getting network status...');
  const status = await client.getNetworkStatus();
  console.log('   Network:', status.network);
  console.log('   Block height:', status.blockHeight);
  console.log('   Healthy:', status.isHealthy);
  console.log('');

  console.log('All examples completed successfully!');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error running examples:', error);
    process.exit(1);
  });
}

export default main;
