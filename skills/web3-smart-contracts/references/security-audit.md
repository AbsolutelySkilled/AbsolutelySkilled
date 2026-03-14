<!-- Part of the web3-smart-contracts AbsolutelySkilled skill. Load this file when
     working with smart contract security auditing, vulnerability assessment, or
     reviewing contracts before deployment. -->

# Smart Contract Security Audit Guide

## Audit checklist

Work through each category in order. For each finding, classify severity as
Critical / High / Medium / Low / Informational.

### 1. Reentrancy

- [ ] All external calls happen AFTER state updates (CEI pattern)
- [ ] `ReentrancyGuard` (nonReentrant) used on functions with external calls
- [ ] Cross-function reentrancy checked (function A calls B which re-enters A)
- [ ] Read-only reentrancy checked (view functions reading stale state during callback)

**Real exploit: The DAO hack (2016)** - $60M drained because `withdraw()` sent ETH
before updating the balance. The attacker's fallback function re-entered `withdraw()`
repeatedly before the balance was set to zero.

```solidity
// VULNERABLE
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}(""); // external call first
    balances[msg.sender] = 0; // state update after - too late
}

// FIXED (CEI pattern)
function withdraw() external nonReentrant {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0; // state update first
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

### 2. Access control

- [ ] All privileged functions have proper access modifiers (onlyOwner, role-based)
- [ ] Constructor sets initial owner/admin correctly
- [ ] No unprotected `selfdestruct` or `delegatecall`
- [ ] Ownership transfer uses two-step pattern (propose + accept)
- [ ] No functions accidentally left `public` that should be `internal` or `private`

### 3. Integer arithmetic

- [ ] Solidity >= 0.8.0 used (built-in overflow/underflow checks)
- [ ] `unchecked` blocks are truly safe (loop counters, verified math)
- [ ] Division before multiplication avoided (precision loss)
- [ ] Casting between types checked for truncation (uint256 -> uint128)

### 4. Oracle manipulation

- [ ] Spot prices from DEX pools are NOT used for critical decisions
- [ ] TWAP (time-weighted average price) used with sufficient window (30 min+)
- [ ] Chainlink price feeds use `latestRoundData()` with staleness checks
- [ ] Oracle failure mode handled (stale price, zero price, negative price)

```solidity
// Chainlink oracle with proper validation
function getPrice(address feed) internal view returns (uint256) {
    (, int256 price, , uint256 updatedAt, ) = AggregatorV3Interface(feed)
        .latestRoundData();
    require(price > 0, "Invalid price");
    require(block.timestamp - updatedAt < 3600, "Stale price");
    return uint256(price);
}
```

### 5. Flash loan attack vectors

- [ ] No single-transaction price manipulation possible
- [ ] Governance voting requires token locking (not just balance snapshot)
- [ ] Reward calculations use time-weighted mechanisms
- [ ] No reliance on `balanceOf(address(this))` for accounting (use internal tracking)

### 6. Front-running / MEV

- [ ] Slippage protection on swaps (minAmountOut parameter)
- [ ] Commit-reveal schemes for sensitive operations (auctions, governance)
- [ ] Deadline parameters on time-sensitive transactions
- [ ] No information leakage in pending transactions that can be exploited

### 7. External call safety

- [ ] Return values of `call`, `delegatecall`, `staticcall` are checked
- [ ] No use of `transfer()` or `send()` (2300 gas limit breaks receivers)
- [ ] External contract addresses validated (not zero address)
- [ ] Callbacks from untrusted contracts handled safely

### 8. Proxy and upgradeability

- [ ] Storage layout is append-only between upgrades (no reordering)
- [ ] Implementation contract has `initializer` instead of `constructor`
- [ ] `initialize()` can only be called once (use OpenZeppelin's Initializable)
- [ ] No storage collision between proxy and implementation
- [ ] UUPS proxies have `_authorizeUpgrade` properly restricted

### 9. Token integration

- [ ] ERC-20 tokens with fee-on-transfer handled (check actual received amount)
- [ ] ERC-20 tokens with rebasing handled or explicitly blocked
- [ ] `approve` race condition mitigated (use `increaseAllowance/decreaseAllowance`)
- [ ] ERC-777 callback hooks accounted for (reentrancy via token transfer)

### 10. Denial of service

- [ ] No unbounded loops that grow with user count
- [ ] Pull-over-push pattern for payments (users withdraw, not contract pushes)
- [ ] No single point of failure (owner key compromise doesn't freeze all funds)
- [ ] Emergency withdrawal mechanisms for edge cases

---

## Common vulnerability catalog

| Vulnerability | Severity | Detection | Mitigation |
|---|---|---|---|
| Reentrancy | Critical | External call before state update | CEI pattern + ReentrancyGuard |
| Unprotected selfdestruct | Critical | Missing access control on selfdestruct | Remove selfdestruct or add onlyOwner |
| Oracle manipulation | Critical | Using spot price for liquidation/collateral | TWAP or Chainlink with staleness check |
| Unchecked return value | High | `address.call()` without checking bool | Always check return value of low-level calls |
| Front-running | High | Transactions visible in mempool | Commit-reveal, slippage protection, deadlines |
| Integer truncation | Medium | Unsafe casting uint256 to smaller types | Use SafeCast library or explicit bounds checking |
| Centralization risk | Medium | Single owner can drain/pause protocol | Multisig, timelock, governance |
| Missing zero-address check | Low | Constructor/setter accepts address(0) | require(addr != address(0)) |
| Floating pragma | Low | `pragma solidity ^0.8.0` instead of fixed | Use exact version: `pragma solidity 0.8.20;` |

---

## Tools for auditing

| Tool | Purpose | Usage |
|---|---|---|
| Slither | Static analysis - detects common vulnerabilities | `slither .` in project root |
| Mythril | Symbolic execution - finds deeper bugs | `myth analyze src/Contract.sol` |
| Foundry invariant tests | Property-based testing | `forge test --match-test invariant` |
| Echidna | Fuzzer for smart contracts | Define invariants, let it find violations |
| Certora Prover | Formal verification | Write specs in CVL, prove mathematical properties |
