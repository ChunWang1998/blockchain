const { ethers } = require("hardhat");
const { cometAbi, wethAbi, stdErc20Abi } = require("../abi");

/*
1. Swap 0.0001 ETH to WETH 
(deposit directly into the WETH contract to receive WETH).

2. Approve the Comet contract to operate with my WETH.

3. Supply 0.0001 WETH into the Comet contract 
(use `comet.supply()` to use WETH as collateral).

4. Borrow 0.01 USDC 
(use `comet.withdraw()` to withdraw USDC, which requires supplying collateral).

5. To attempt to repay some (0.0025) USDC, first approve the Comet contract to operate with my USDC.

6. Supply 0.0025 USDC into the Comet contract.

Final status:
ETH: decreases by 0.0001
USDC: increases by 0.01-0.0025 
*/

async function main() {
  const baseAssetAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
  const usdcAddress = baseAssetAddress;
  const cometAddress = "0x3EE77595A8459e93C2888b13aDB354017B198188";
  const wethAddress = "0x42a71137C09AE83D8d05974960fd607d40033499";

  const provider = new ethers.InfuraProvider(
    (network = "goerli"),
    process.env.INFURA_API_KEY
  );
  const signer = new ethers.Wallet(
    process.env.METAMASK_ACCOUNT_PRIVATE_KEY,
    provider
  );

  const comet = new ethers.Contract(cometAddress, cometAbi, signer);
  const weth = new ethers.Contract(wethAddress, wethAbi, signer);
  const usdc = new ethers.Contract(usdcAddress, stdErc20Abi, signer);

  const baseAssetMantissa = 1e6; // USDC has 6 decimal places

  console.log("\tStart to deposit eth to get weth...");
  let tx = await weth.deposit({
    value: ethers.parseEther("0.0001"),
  });
  await tx.wait(1);

  console.log("\tApproving Comet to move WETH collateral...");
  tx = await weth.approve(cometAddress, ethers.MaxUint256);
  await tx.wait(1);

  console.log("\tSending initial WETH supply of collateral to Compound...");
  tx = await comet.supply(wethAddress, ethers.parseEther("0.0001"));
  await tx.wait(1);

  // Accounts cannot hold a borrow smaller than baseBorrowMin (0.01 USDC).
  const borrowSize = 0.01;
  console.log("\tExecuting initial borrow of the base asset from Compound...");
  console.log("\tBorrow size:", borrowSize);

  tx = await comet.withdraw(usdcAddress, borrowSize * baseAssetMantissa);
  await tx.wait(1);

  // Repay some of the open borrow
  const repayAmount = 0.0025; // USDC

  console.log("\tApproving to repay the borrow...", repayAmount);
  tx = await usdc.approve(
    cometAddress,
    (repayAmount * baseAssetMantissa).toString()
  );
  await tx.wait(1);

  // We don't have enough of the base asset to repay the borrow principal plus accrued interest
  console.log("\tRepaying some of the open borrow...", repayAmount);
  tx = await comet.supply(usdcAddress, repayAmount * baseAssetMantissa);
  await tx.wait(1);
}

main();
