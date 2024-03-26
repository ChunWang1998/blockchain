init:
	npx hardhat init 

compile:
	npx hardhat compile

localnode:
	npx hardhat node

localrun:
	npx hardhat run scripts/deploy.js --network localhost	

console:
	npx hardhat console

deploy:
	rm -rf ./artifacts ./cache
	npx hardhat run scripts/deploy.js      

verify:
	@read -p "Enter the deployment address (NEW_ADDR): " NEW_ADDR; \
	npx hardhat verify $$NEW_ADDR