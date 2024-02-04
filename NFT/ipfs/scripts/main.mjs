import { NFTStorage, File } from "nft.storage";
import fs from "fs";
import util from "util";
import {
  API_KEY,
  ASSETSFOLDERPATH,
  NFT_NAME,
  NFT_DESCRIPTION,
} from "../constant.mjs";

async function getAssetsNum() {
  const readDirAsync = util.promisify(fs.readdir);
  const files = await readDirAsync(ASSETSFOLDERPATH);
  const validExtensions = ["jpg", "png", "mp4"];
  const assetFiles = files.filter((file) => {
    const fileExtension = file.split(".").pop().toLowerCase();
    return validExtensions.includes(fileExtension);
  });
  const assetCount = assetFiles.length;
  console.log(`Asset count: ${assetCount}`);
  return assetCount;
}

async function createJsonFileInJsonsFolder(num, cid) {
  let baseUri = "ipfs://" + cid;
  for (let i = 1; i <= num; i++) {
    let tempMetadata = {
      name: NFT_NAME + i.toString().padStart(3, "0"),
      description: NFT_DESCRIPTION,
      image: `${baseUri}/0.mp4`,
      attributes: [
        {
          display_type: "string",
          trait_type: "Color",
          value: "Green",
        },
      ],
    };
    fs.writeFileSync(`jsons/${i}.json`, JSON.stringify(tempMetadata, null, 2));
  }
}

async function deployAssetsToIPFS(num) {
  let files = [];
  for (let i = 0; i < num; i++) {
    const fileExtension = "png"; // Change the file extension as needed (e.g., "mp4")
    files.push(
      new File(
        [await fs.promises.readFile(`assets/${i}.${fileExtension}`)],
        `${i}.${fileExtension}`,
        {
          type: `image/${fileExtension}`,
        }
      )
    );
  }

  const storage = new NFTStorage({ token: API_KEY });
  return await storage.storeDirectory(files);
}

async function deployJSONsToIPFS(num) {
  let files = [];
  for (let i = 1; i <= num; i++) {
    files.push(
      new File([await fs.promises.readFile(`jsons/${i}.json`)], `${i}.json`)
    );
  }

  const storage = new NFTStorage({ token: API_KEY });

  return await storage.storeDirectory(files);
}

async function main() {
  let num = await getAssetsNum();

  let cidAssets = await deployAssetsToIPFS(num);
  console.log("Assets base CID: " + cidAssets);

  await createJsonFileInJsonsFolder(3, cidAssets);

  let cidJSONs = await deployJSONsToIPFS(3);
  console.log("JSONs base CID: " + cidJSONs);
}
main();
