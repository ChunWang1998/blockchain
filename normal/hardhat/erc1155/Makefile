deploy:
	rm -rf ./artifacts ./cache
	npx hardhat compile
	node scripts/deploy.js      

verify:
	@read -p "Enter the deployment address (NEW_ADDR): " NEW_ADDR; \
	npx hardhat verify --network bsc_testnet $$NEW_ADDR "0x2a1d7C6B22E7D46EbAb56bdb27eDd001F55a94BB"