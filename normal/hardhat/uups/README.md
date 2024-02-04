# upgradable-demo-uups
## Deploy V1 contract
1. Deploy the proxy contract and V1 by js script
```
npx hardhat run scripts/deploy-uups.js --network sepolia
```
You will get proxy contract address and logic contract address.

2. Verify logic contract
```
npx hardhat verify --network sepolia LOGIC_CONTRACT
```

3. Verify proxy contract as proxy on explorer

4. Update proxyAddress in const.js

## Deploy V2 contract
1. Deploy V2 logic contract by js script 
```
npx hardhat run scripts/upgrade-uups.js --network sepolia       
```
2. Verify new logic contract
```
npx hardhat verify --network sepolia NEW_LOGIC_CONTRACT
```
3. Check your proxy contract whether it is update

## run scripts
```
npx hardhat run PATH --network sepolia
```
## Note
- In order for our contract to receive ERC1155 tokens, we can inherit from the convenience contract ERC1155Holder which handles the registering for us:
```
contract MyContract is ERC1155Holder{
    ...
}
```