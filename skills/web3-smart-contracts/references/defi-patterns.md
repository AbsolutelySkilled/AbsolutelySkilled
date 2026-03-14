<!-- Part of the web3-smart-contracts AbsolutelySkilled skill. Load this file when
     working with DeFi protocol patterns, AMMs, lending, staking, vaults, or governance. -->

# DeFi Protocol Patterns

## AMM (Automated Market Maker)

The constant product formula `x * y = k` is the foundation of Uniswap V2-style AMMs.

**Core mechanics:**
- Two tokens in a pool with reserves `x` and `y`
- Product `k = x * y` must remain constant after every trade
- Buying token A increases its price (less A, more B in pool)
- Liquidity providers (LPs) deposit both tokens proportionally

```solidity
contract SimpleAMM {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    function swap(address tokenIn, uint256 amountIn)
        external
        returns (uint256 amountOut)
    {
        require(amountIn > 0, "Zero amount");
        bool isA = tokenIn == address(tokenA);
        (uint256 resIn, uint256 resOut) = isA
            ? (reserveA, reserveB)
            : (reserveB, reserveA);

        // 0.3% fee
        uint256 amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * resOut) /
            (resIn * 1000 + amountInWithFee);

        // Update reserves
        if (isA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        (isA ? tokenB : tokenA).transfer(msg.sender, amountOut);
    }
}
```

**Key risks:**
- Impermanent loss for LPs when prices diverge
- Flash loan manipulation of reserves for price oracle attacks
- Sandwich attacks (front-running + back-running user swaps)

**Mitigation:** Use TWAP oracles, enforce slippage protection (`minAmountOut`), add
deadline parameters.

---

## Lending protocol

Lending protocols (Aave, Compound) allow users to supply collateral and borrow against it.

**Core concepts:**
- **Collateral factor**: Maximum borrow value as % of collateral (e.g., 75%)
- **Liquidation threshold**: Borrow/collateral ratio triggering liquidation (e.g., 80%)
- **Interest rate model**: Algorithmic rate based on utilization (borrowed / supplied)
- **Health factor**: `(collateral * liquidation_threshold) / borrow_value` - below 1.0 = liquidatable

```solidity
contract SimpleLending {
    struct UserAccount {
        uint256 collateral;
        uint256 borrowed;
        uint256 lastUpdate;
    }

    uint256 public constant COLLATERAL_FACTOR = 7500; // 75% in basis points
    uint256 public constant LIQUIDATION_THRESHOLD = 8000; // 80%
    uint256 public constant BASIS_POINTS = 10000;

    mapping(address => UserAccount) public accounts;

    function borrow(uint256 amount) external {
        UserAccount storage account = accounts[msg.sender];
        accrueInterest(account);

        uint256 maxBorrow = (account.collateral * COLLATERAL_FACTOR) / BASIS_POINTS;
        require(account.borrowed + amount <= maxBorrow, "Exceeds collateral factor");

        account.borrowed += amount;
        // transfer borrowed tokens to user
    }

    function isLiquidatable(address user) public view returns (bool) {
        UserAccount memory account = accounts[user];
        uint256 threshold = (account.collateral * LIQUIDATION_THRESHOLD) / BASIS_POINTS;
        return account.borrowed > threshold;
    }
}
```

**Key risks:**
- Oracle manipulation to trigger false liquidations
- Bad debt from rapid price drops exceeding liquidation capacity
- Interest rate model exploits (manipulating utilization ratio)

---

## ERC-4626 tokenized vault

The standard interface for yield-bearing vaults. Users deposit an underlying asset and
receive vault shares representing their proportional claim.

**Core formula:**
- `shares = assets * totalSupply / totalAssets` (on deposit)
- `assets = shares * totalAssets / totalSupply` (on withdrawal)

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract YieldVault is ERC4626 {
    constructor(IERC20 asset_)
        ERC4626(asset_)
        ERC20("Yield Vault", "yVAULT")
    {}

    function totalAssets() public view override returns (uint256) {
        // Include earned yield in total
        return IERC20(asset()).balanceOf(address(this)) + _pendingYield();
    }

    function _pendingYield() internal view returns (uint256) {
        // Calculate yield from strategy
        return 0; // placeholder
    }
}
```

**Key risks:**
- First depositor attack: attacker inflates share price to steal from next depositor
- Mitigation: seed vault with initial deposit, or use virtual shares (OpenZeppelin default)
- Donation attacks: sending assets directly to inflate totalAssets

---

## Staking and reward distribution

Distributing rewards proportionally to stakers without iterating over all stakers.

**Reward-per-token accumulator pattern** (used by Synthetix):

```solidity
contract StakingRewards {
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    uint256 public rewardRate; // rewards per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balances;
    uint256 public totalSupply;

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored +
            ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalSupply;
    }

    function earned(address account) public view returns (uint256) {
        return (balances[account] *
            (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18
            + rewards[account];
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        totalSupply += amount;
        balances[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        totalSupply -= amount;
        balances[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
    }

    function getReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
        }
    }
}
```

**Key insight**: The accumulator pattern avoids iterating over all stakers. Each user's
reward is calculated as `balance * (currentRewardPerToken - userPaidRewardPerToken)`.

---

## Governance

On-chain governance typically follows the Governor pattern (OpenZeppelin Governor):

**Components:**
- **Token**: ERC-20 with voting power (ERC20Votes)
- **Governor**: Propose, vote, execute lifecycle
- **Timelock**: Delay between vote passing and execution (gives users time to exit)

**Typical flow:**
1. User creates proposal (requires minimum token threshold)
2. Voting delay (e.g., 1 day) for users to delegate/prepare
3. Voting period (e.g., 3 days)
4. If passed: queued in timelock (e.g., 2 day delay)
5. After timelock: anyone can execute

**Key risks:**
- Flash loan governance attacks (borrow tokens, vote, return in same block)
- Mitigation: Require token balance at a past snapshot block, not current balance
- Low voter turnout allowing minority capture
- Timelock bypass via emergency functions

---

## Common ERC standards reference

| Standard | Purpose | Key functions |
|---|---|---|
| ERC-20 | Fungible tokens | `transfer`, `approve`, `transferFrom`, `balanceOf` |
| ERC-721 | Non-fungible tokens (NFTs) | `ownerOf`, `transferFrom`, `approve`, `safeTransferFrom` |
| ERC-1155 | Multi-token (fungible + NFT) | `balanceOf`, `safeTransferFrom`, `safeBatchTransferFrom` |
| ERC-4626 | Tokenized vault | `deposit`, `withdraw`, `totalAssets`, `convertToShares` |
| ERC-2612 | Permit (gasless approval) | `permit` - approve via signature, no separate tx |
| ERC-3156 | Flash loans | `flashLoan`, `flashFee`, `maxFlashLoan` |
