# upload-ipfs-flow
Deploy multiple images on the same layer to ipfs so that they belong to the same CID in ipfs, and create json metadata based on these ipfs deploy to ipfs, and make them belong to the same CID in ipfs
## Run Example
### CMD
```
npm install
node scripts/main.mjs   
```
### Output
- output log:
```
Image count: 1
Assets base CID: bafybeiacnap3zv7wseaot2c7u22fivfvkkj5jdybq2ehteg5fg743x5iau
JSONs base CID: bafybeids52v44cun7xrwv6x33cwsxweysyyqotlcebdkcjd6bk4nycmwfy
```
- json file in /jsons
  

## Use Flow
0. Prepare:
- personal API_KEY (if needed)
- photo
- NFT metadata
1. set photos in /assets with name
[
  0.png
  1.png
  ...
]
1. update NFT metandata (NFT_...) and API_KEY(if needed) in `scripts/constant.mjs`
2. run
```
npm install
node scripts/storeDirectory.mjs   
```
## Retrieve
`ipfs://CID/0.json`
`ipfs://CID/1.json`
...
## Note
- after deploying finish, you may wait at most 48hrs to see the data on ipfs.