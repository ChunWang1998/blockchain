import axios from 'axios';
import crypto from 'crypto';

const apiKey = 'TJqsyYpEF1fdq9qI63kpmGQWs35no6UugVcRTe0eKlAVV4enwK5Uv3JOfVY9NHDH';
const apiSecret = '9dm5SY0KvAMIGkiXtHMAmcsdVTnOosEZ8VFBF4tbXMU4Z7v9tQe4wlnohy0bP2Ok';

const baseUrl = 'https://testnet.binance.vision/api/v3';

// // 
// const order: { [key: string]: string | number } = {
//     symbol: 'BTCUSDT',
//     side: 'BUY',
//     type: 'MARKET',  (MARKET or LIMIT)
//     quantity: 0.001, 
// };

const order: { [key: string]: string | number } = {
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 0.001,
    price: 50000,
    timeInForce: "IOC"
};

//
const binanceAxios = axios.create({
    baseURL: baseUrl,
    headers: {
        'X-MBX-APIKEY': apiKey,
    },
});

const generateSignature = (params: string) => {
    return crypto
        .createHmac('sha256', apiSecret)
        .update(params)
        .digest('hex');
};

const placeOrder = async () => {
    try {
        const timestamp = Date.now().toString();

        const params = new URLSearchParams();
        for (const key in order) {
            params.append(key, order[key] as string);
        }
        params.append('timestamp', timestamp);

        const signature = generateSignature(params.toString());

        params.append('signature', signature);

        const response = await binanceAxios.post('/order', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-MBX-APIKEY': apiKey,
                'signature': signature,
            },
        });

        console.log('Order placed successfully:', response.data);
    } catch (error: any) {
        console.error('Error placing order:', error.response?.data || error.message);
    }
};

placeOrder();
