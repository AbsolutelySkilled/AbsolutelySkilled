<!-- Part of the web3-smart-contracts AbsolutelySkilled skill. Load this file when
     working with gas optimization, storage layout, or deployment cost reduction. -->

# Gas Optimization Guide

## EVM opcode cost reference

Understanding gas costs at the opcode level is essential for meaningful optimization.

| Operation | Gas Cost | Notes |
|---|---|---|
| SSTORE (new value) | 20,000 | Most expensive - writing to new storage slot |
| SSTORE (update) | 5,000 | Updating existing non-zero slot |
| SSTORE (zero -> zero) | 2,900 | EIP-2929 cold access |
| SLOAD (cold) | 2,100 | First read of a slot in a transaction |
| SLOAD (warm) | 100 | Subsequent reads of the same slot |
| MSTORE / MLOAD | 3 | Memory is cheap but ephemeral |
| CALLDATALOAD | 3 | Reading function arguments |
| CALL (external) | 2,600+ | Minimum for calling another contract |
| LOG (event) | 375 + 375/topic | Events are cheap compared to storage |
| CREATE | 32,000 | Deploying a new contract |

**Key insight**: Storage operations dominate gas costs. A single SSTORE costs more than
hundreds of memory or calldata operations combined.

---

## Storage layout optimization

### Struct packing

EVM storage uses 32-byte (256-bit) slots. Variables smaller than 32 bytes can share a
slot if packed correctly. Solidity packs variables in declaration order.

```solidity
// BAD: 3 slots (96 bytes of storage)
struct UserBad {
    uint8 age;        // slot 0 (wastes 31 bytes)
    uint256 balance;  // slot 1 (full slot)
    uint8 level;      // slot 2 (wastes 31 bytes)
}

// GOOD: 2 slots (64 bytes of storage)
struct UserGood {
    uint256 balance;  // slot 0 (full slot)
    uint8 age;        // slot 1 (1 byte)
    uint8 level;      // slot 1 (1 byte, packed with age)
}
```

**Rule**: Group smaller-than-32-byte types together. Place uint256/bytes32/address types
on their own.

### Packing booleans

Each bool uses a full storage slot by default. Pack multiple bools into a uint256 using
bitwise operations, or use a bitmap.

```solidity
// BAD: 3 storage slots
bool public paused;
bool public initialized;
bool public locked;

// GOOD: 1 storage slot using bit flags
uint256 private _flags;
uint256 constant PAUSED = 1 << 0;
uint256 constant INITIALIZED = 1 << 1;
uint256 constant LOCKED = 1 << 2;

function isPaused() public view returns (bool) {
    return _flags & PAUSED != 0;
}
```

---

## Calldata vs memory vs storage

```solidity
// BAD: copies array to memory (expensive for large arrays)
function sum(uint256[] memory values) external pure returns (uint256) {
    uint256 total;
    for (uint256 i; i < values.length; ++i) {
        total += values[i];
    }
    return total;
}

// GOOD: reads directly from calldata (no copy)
function sum(uint256[] calldata values) external pure returns (uint256) {
    uint256 total;
    for (uint256 i; i < values.length; ++i) {
        total += values[i];
    }
    return total;
}
```

**Rule**: Use `calldata` for external function parameters that are read-only. Use
`memory` only when you need to modify the data within the function.

---

## Loop optimization

```solidity
// BAD: reads .length from storage each iteration, uses checked arithmetic
function processAll() external {
    for (uint256 i = 0; i < items.length; i++) {
        process(items[i]);
    }
}

// GOOD: cached length, unchecked increment, pre-increment
function processAll() external {
    uint256 length = items.length; // cache storage read
    for (uint256 i; i < length; ) {
        process(items[i]);
        unchecked { ++i; } // safe: i < length guarantees no overflow
    }
}
```

Savings per iteration: ~100 gas (SLOAD for .length) + ~60 gas (overflow check).

---

## Constants and immutables

```solidity
// BAD: stored in storage (SLOAD on every read)
address public owner;
uint256 public fee = 300;

// GOOD: embedded in bytecode (no SLOAD)
address public immutable owner; // set once in constructor
uint256 public constant FEE = 300; // compile-time constant
```

- `constant`: value known at compile time, embedded in bytecode
- `immutable`: value set in constructor, embedded in deployed bytecode
- Both avoid SLOAD (2,100 gas saving per read)

---

## Custom errors vs require strings

```solidity
// BAD: stores string in bytecode, expensive to deploy and emit
require(balance >= amount, "InsufficientBalance: balance too low for withdrawal");

// GOOD: 4-byte selector, minimal bytecode, cheaper to deploy and revert
error InsufficientBalance(uint256 available, uint256 required);

if (balance < amount) revert InsufficientBalance(balance, amount);
```

Custom errors save ~50 gas per revert and significantly reduce deployment cost for
contracts with many require statements.

---

## Event optimization

Events are 10-100x cheaper than storage for data that only needs to be read off-chain.

```solidity
// BAD: storing historical data in storage
mapping(uint256 => Transfer) public transferHistory;

// GOOD: emit events, index off-chain with The Graph or similar
event TransferRecorded(
    address indexed from,
    address indexed to,
    uint256 amount,
    uint256 timestamp
);
```

Use `indexed` on parameters you need to filter by (up to 3 per event). Each indexed
parameter adds 375 gas (LOG topic cost).

---

## Deployment cost reduction

| Technique | Savings | Notes |
|---|---|---|
| Use custom errors | 10-30% deployment | Eliminates long revert strings from bytecode |
| Remove unused imports | Variable | Dead code still compiles into bytecode |
| Use clone/proxy patterns | 80-90% | Minimal proxy (EIP-1167) is ~45 bytes |
| Optimize constructor | Variable | Constructor code is run once but stored in initcode |
| Use optimizer (runs=200) | 5-20% | Foundry: `optimizer = true, optimizer_runs = 200` |

---

## Quick reference: optimization checklist

1. [ ] Storage variables packed into minimal slots
2. [ ] Constructor-set values use `immutable`
3. [ ] Compile-time values use `constant`
4. [ ] External function params use `calldata` not `memory` where possible
5. [ ] Storage reads cached in local variables inside loops
6. [ ] Array `.length` cached before loops
7. [ ] Loop counters use `unchecked { ++i; }`
8. [ ] Custom errors replace require strings
9. [ ] Events used instead of storage for off-chain-only data
10. [ ] Solidity optimizer enabled with appropriate runs count
