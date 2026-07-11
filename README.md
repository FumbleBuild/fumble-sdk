# Fumble SDK

### The Security Layer for Autonomous AI.

The Fumble SDK is the official developer interface for integrating Fumble's runtime security checks directly into AI agents, copilots, and autonomous workflows.

This SDK enables:

- Real-time risk signal queries via the Fumble detection engine
- Scoped autonomous agent deployment with configurable risk limits
- Cryptographic proof generation and verification for auditable security decisions
- Transaction broadcasting and monitoring for agent-initiated actions

Fumble makes autonomous AI programmable, and accountable.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Core Modules](#core-modules)
- [Signal Layer API](#signal-layer-api)
- [Agent Layer API](#agent-layer-api)
- [Transaction Layer](#transaction-layer)
- [Cryptographic Proof Engine](#cryptographic-proof-engine)
- [Environment Configuration](#environment-configuration)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install @fumble/sdk
```

Or build from source:

```bash
git clone https://github.com/FumbleBuild/fumble-sdk.git
cd fumble-sdk
npm install
npm run build
```

---

## Quick Start

```ts
import { FumbleClient } from '@fumble/sdk';

const client = new FumbleClient({
  rpcEndpoint: 'https://api.fumblebuild.xyz',
  network: 'mainnet',
  apiKey: 'your-api-key',
});

// Fetch a live risk signal for an agent action
const signal = await client.getSignal({
  subnetId: 1,
  signalType: 'risk',
  target: 'agent:research-assistant',
});

console.log(`Signal: ${signal.value} (confidence: ${signal.confidence})`);

// Deploy a policy-scoped autonomous agent
const agent = await client.deployAgent({
  type: 'risk',
  maxAllocation: '5000000',
  slippageTolerance: 0.5,
  protocols: ['internal-api', 'payment-gateway'],
});

console.log(`Agent deployed: ${agent.signatures[0]}`);
```

---

## Architecture Overview

The SDK mirrors the Fumble runtime layers:

```text
Application Layer
        ↓
FumbleClient
        ↓
Signal | Agent | Account | Proof | Transaction
        ↓
Fumble Detection Engine + Policy Enforcement
```

Each module operates independently and is composable.

---

## Core Modules

### 1. FumbleClient

The main entry point for all runtime interactions.

```ts
const client = new FumbleClient({
  rpcEndpoint: 'https://api.fumblebuild.xyz',
  network: 'mainnet',
});
```

### 2. Signal Module

Query confidence-weighted risk intelligence from the Fumble detection engine before an action executes.

Capabilities:
- Real-time risk signals
- Sentiment and intent analysis outputs
- Anomaly assessments
- Behavioral forecasts

```ts
const signal = await client.getSignal({
  subnetId: 1,
  signalType: 'risk',
  target: 'agent:research-assistant',
});
```

### 3. Agent Module

Deploy and manage autonomous agents under explicit, policy-scoped limits.

Agent types:
- `trading` — directional strategy execution under enforced limits
- `arbitrage` — cross-system reconciliation tasks
- `yield` — resource allocation optimization within scoped bounds
- `risk` — portfolio monitoring and automatic circuit breakers
- `governance` — approval coordination and policy tracking

```ts
const agent = await client.deployAgent({
  type: 'risk',
  maxAllocation: '10000000',
  slippageTolerance: 1.0,
  protocols: ['internal-api', 'billing-service'],
});
```

### 4. Transaction Module

Send, monitor, and execute agent-initiated actions under audit.

```ts
const tx = await client.sendTransaction({
  amount: '1000000',
  recipient: '0xrecipient...',
  memo: 'agent-authorized payment',
});

const status = await client.getTransaction(tx.signature);
```

### 5. Cryptographic Proof Engine

Generate and verify Merkle, zk-SNARK, and signature proofs for auditable security decisions.

```ts
const proof = await client.proofGenerator.generateProof({
  type: 'merkle',
  data: { signal: 0.87, subnetId: 1 },
});

const isValid = await client.proofGenerator.verifyProof(proof);
```

---

## Signal Layer API

Fetch confidence-weighted risk intelligence before an agent action is allowed to proceed.

```ts
// Single signal
const signal = await client.getSignal({
  subnetId: 1,
  signalType: 'risk',   // 'price' | 'sentiment' | 'risk' | 'forecast'
  target: 'agent:research-assistant',
});

// Signal fields
signal.subnetId     // number — originating detection source
signal.signalType   // string — type of intelligence
signal.value        // number — normalized signal value
signal.confidence   // number — confidence score (0–1)
signal.blockNumber  // number — block when signal was produced
signal.timestamp    // number — Unix timestamp
```

---

## Agent Layer API

Deploy and manage autonomous agents within the Fumble execution environment.

```ts
const agent = await client.deployAgent({
  type: 'risk',               // agent specialization
  maxAllocation: '5000000',   // maximum capital in smallest unit
  slippageTolerance: 0.5,     // max allowed execution tolerance (%)
  protocols: ['internal-api'],// whitelisted system interactions
});

// Result fields
agent.agentType   // string — deployed agent type
agent.action      // string — action taken ('deployed')
agent.signatures  // string[] — on-chain transaction signatures
agent.status      // 'success' | 'failed' | 'pending'
agent.timestamp   // number — Unix timestamp
```

---

## Transaction Layer

```ts
await client.sendTransaction({ amount, recipient, memo?, fee? });
await client.getTransaction(signature);
await client.executeInstruction({ programId, data, accounts });
await client.executeInstructions(instructions[]);
await client.getBlockHeight();
await client.getNetworkStatus();
```

---

## Cryptographic Proof Engine

Supported proof types: `merkle`, `zk-snark`, `signature`.

```ts
const proof = await client.proofGenerator.generateProof({
  type: 'zk-snark',
  data: { commitment: '0xabc...' },
  witness: { privateInput: '...' },
});

const valid = await client.proofGenerator.verifyProof(proof);
```

---

## Environment Configuration

| Environment | Purpose |
|---|---|
| `devnet` | Local development |
| `testnet` | Integration testing |
| `mainnet` | Production |

```ts
const client = new FumbleClient({
  network: 'testnet',
  rpcEndpoint: 'https://testnet.api.fumblebuild.xyz',
  apiKey: 'your-key',
  timeout: 30000,
});
```

---

## Error Handling

All errors extend `FumbleError` and include a `code` field.

```ts
import {
  FumbleError,
  ValidationError,
  NetworkError,
  TransactionError,
  ProofError,
  SwapError,
  SignalError,
  AgentError,
} from '@fumble/sdk';

try {
  await client.getSignal({ subnetId: -1, signalType: 'risk', target: 'agent:research-assistant' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.error('Validation failed:', err.message, err.code);
  }
}
```

---

## Examples

Run the basic example:

```bash
npx ts-node examples/basic-usage.ts
```

Build and run compiled output:

```bash
npm run build
node dist/examples/basic-usage.js
```

---

## Contributing

Before submitting:

- Follow TypeScript strict mode
- Include test coverage for new API surfaces
- Document all public methods with JSDoc
- Ensure cryptographic correctness for proof changes

Open a pull request with a detailed explanation.

---

## License

MIT License.

---

## About Fumble

Fumble is the security layer for autonomous AI.

Every powerful AI system will eventually make mistakes — the challenge is preventing those mistakes from becoming security incidents. Fumble sits between an AI agent and the actions it performs, evaluating every request against policy and threat signals before execution is allowed to proceed.

- Website: [fumblebuild.xyz](https://www.fumblebuild.xyz)
- Whitepaper: [fumblebuild.xyz/Fumble_Whitepaper.pdf](https://www.fumblebuild.xyz/Fumble_Whitepaper.pdf)
- Twitter: [@FumbleBuild](https://x.com/FumbleBuild)
- Telegram: [t.me/FumbleBuild](https://t.me/FumbleBuild)
