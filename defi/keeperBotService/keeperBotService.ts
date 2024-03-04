import { EvmPriceServiceConnection, Price } from "@pythnetwork/pyth-evm-js";
const connection = new EvmPriceServiceConnection("https://hermes.pyth.network"); // See Hermes endpoints section below for other endpoints

const priceIds = {
    BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
    ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
};

export class Order {
    symbol: string;
    price: number;
    quantity: number;
    executionTime: number;

    constructor(symbol: string, price: number, quantity: number, executionTime: number) {
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
        this.executionTime = executionTime;
    }
}

export class KeeperBotService {
    async getPrice(asset: string): Promise<number> {
        if (Object.keys(priceIds).includes(asset)) {
            //@ts-ignore
            let priceId = [priceIds[asset]]
            const priceFeed = await connection.getLatestPriceFeeds(Object.values(priceId));
            //@ts-ignore
            let price: Price = priceFeed[0].getPriceNoOlderThan(60)
            return Number(price.price) * (10 ** price.expo)
        }
        else {
            console.log(asset + " not in the portfolio")
            return 0
        }

    }
}

export default KeeperBotService;
