import { KeeperBotService } from './keeperBotService';
import { Order } from './keeperBotService';

const keeperBot = new KeeperBotService();

// 1. add delay order
(async () => {
    try {
        let order1: Order = new Order('BTC', await keeperBot.getPrice("BTC"), 1, 5000);
        keeperBot.addDelayedOrder(order1); // execute after 5s
        let order2: Order = new Order('ETH', await keeperBot.getPrice("ETH"), 5, 10000)
        keeperBot.addDelayedOrder(order2); // execute after 10s

        keeperBot.executeDelayedOrders();
    } catch (error) {
        console.error("Error fetching price for BTC:", error);
    }
})();