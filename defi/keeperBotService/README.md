# intro
1. Borrowing within decentralized protocols
1-1. Choose Compound as main protocol.
1-2. Use goerli testnet.
1-3. In the test, use WETH as collateral, and borrow and repay USDC.
1-4. Can't test liquidate since can't let the collateral price down.
1-5. (TODO) Create a liquidation bot to liquidate or arbitrage from buying collateral.

1. Place order script 
2-1. Choose Binance as main DEX.
2-2. Get price by using Pyth 
2-3. spot order / limit order
2-4. (TODO) delay order

# Dev
1. Borrowing within decentralized protocols
## script
```
node hardhat/test/borrowAndRepay.js
```

2. Place order bot 
## script
```
ts-node placeOrder.ts  
```

# note
- get oracle price for cosmos: https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/cosmwasm/sdk/rust
- compound borrow and repay reference: https://github.com/compound-developers/compound-3-developer-faq/blob/master/examples/borrow-repay-example.js
- compound liquidation bot: https://github.com/compound-finance/comet/tree/main/scripts/liquidation_bot