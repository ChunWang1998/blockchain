// const { expect } = require("chai");
// const hre = require("hardhat");
// const { contractsName } = require("../constant");
// const keccak256 = require("keccak256");

// // STILL FAIL TESTING

// /*
// refer: https://www.youtube.com/watch?v=rucZrL1nOO8
// amount: 10 DAI,  gas fee: 0.2 eth

// Case1:
// Alice has DAI, and Bob has eth. Alice wants to give Bob 10 DAI but Alice doesn't have 0.2 eth for gas.

// 1. Alice approve Bob to spend 10 DAI, and sign the msg to Bob
// (Message can be sent via internet, such as email or chat)

// 2. Bob send the msg to DAI contract by calling permit()
// (permit() in ERC20Permit.sol: 
// sender approves GTT to spend amount + fee token,
// without having call the function approved on the token contract. 
// Amount will be sent to receiver, fee will be sent to executer)

// 3. transferfrom() Alice to Bob 

// 3-1. the tx is executed by Bob, so Bob has to pay 0.2 eth gas fee

// Case2:
// If Bob doesn't have eth, we need the other one Carol to pay gas fee, and a contract "gasless token transfer"(GTT)
// 1. Alice approve GTT to spend 10 + 1(for Carol) DAI, and sign the msg to Carol
// 2. Carol send the msg to GTT and execute the func inside
// 3. GTT send the msg to DAI contract by calling permit
// 3-1. permit() will approve GTT spend 11 DAI from Alice to GTT
// 3-2. transferfrom() Alice to GTT
// 3-3. the tx is executed by Carol, so Carol has to pay 0.2 eth gas fee
// 4. GTT send 10 DAI to Bob, 1 DAI to Carol
// */

// describe("Gasless", function () {
//   let signer, account1, account2, sender, receiver;
//   let privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
//   let permitInstance, gasLessInstance;
//   let amount = 1000;
//   let fee = 2;

//   beforeEach(async function () {
//     [signer, account1, account2] = await hre.ethers.getSigners();
//     sender = account1; //Alice
//     receiver = account2; //Bob

//     // new permit contract
//     permitInstance = await hre.ethers.deployContract(contractsName.ERC20Permit, ["test", "test", 18]);
//     await permitInstance.waitForDeployment();
//     console.log("token contract: " + permitInstance.target);

//     // token mint to sender for amount + fee
//     await permitInstance.mint(sender, amount + fee);

//     // new gasless contract
//     gasLessInstance = await hre.ethers.deployContract(contractsName.GaslessTokenTransfer);
//     await gasLessInstance.waitForDeployment();
//   });

//   it("Case1: should swap token after approving", async function () {
//     const blocknumber = await signer.provider.getBlockNumber();

//     const deadline = blocknumber + 6000000000;
//     console.log("owner(sender) address: " + sender.address);
//     // prepare permit msg
//     let signature = await getPermitHash(
//       sender,
//       gasLessInstance.target,
//       amount + fee,
//       0,
//       deadline,
//       permitInstance,
//     );

//     // sign by sender's private key
//     // let signPart = hre.ethers.Signature.from(signature);
//     // console.log(signPart);
//     const signingKey = new hre.ethers.SigningKey(privateKey);
//     const { v, r, s } = signingKey.sign(signature);

//     // send
//     await gasLessInstance.send(permitInstance.target, sender, receiver, amount, fee, deadline, v, r, s);

//     //check token balance
//     expect(await permitInstance.balanceOf(sender.address)).equal.to(0);
//     expect(await permitInstance.balanceOf(receiver.address)).equal.to(amount);
//     // expect(await permitInstance.balanceOf(???)).equal.to(fee)
//   });
// });

// async function getPermitHash(owner, spender, value, nonce, deadline, token) {
//   // const domain, refer to computeDomainSeparator()
//   const domain = {
//     name: "test",
//     version: "1",
//     chainId: undefined,
//     verifyingContract: token.target,
//   };

//   // const types, refer to permit()
//   const types = {
//     Permit: [
//       { name: "owner", type: "address" },
//       { name: "spender", type: "address" },
//       { name: "value", type: "uint256" },
//       { name: "nonce", type: "uint256" },
//       { name: "deadline", type: "uint256" },
//     ],
//   };

//   // const message
//   const message = {
//     owner: owner.address,
//     spender: spender,
//     value: value,
//     nonce: nonce,
//     deadline: deadline,
//   };

//   const signature = await owner.signTypedData(domain, types, message);
//   return signature;
// }
