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
    private orders: Order[] = [];
    private portfolio: { [key: string]: number } = { 'BTC': 2, 'ETH': 10 };

    addDelayedOrder(order: Order) {
        this.orders.push(order);
    }

    async executeDelayedOrders() {
        for (const order of this.orders) {
            await this.delay(order.executionTime);
            console.log(`Executing order for ${order.quantity} ${order.symbol} at ${order.price} at ${new Date().toLocaleString()}`);
        }
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async liquidate() {
        console.log('Performing liquidation...');
        for (const asset in this.portfolio) {
            const quantity = this.portfolio[asset];
            if (quantity > 0) {
                // The simulated liquidation operation involves selling assets at 50% of the current price.
                const price = await this.getPrice(asset);
                const sellAmount = quantity * price * 0.5;
                console.log(`Sold ${sellAmount} worth of ${asset}`);
                this.portfolio[asset] -= quantity;
            }
        }
        console.log('Liquidation completed.');
    }

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
