require('dotenv').config();

module.exports = {
    app_id: process.env.ZALO_APP_ID,
    key1: process.env.ZALO_KEY1,
    key2: process.env.ZALO_KEY2,
    callback_url: process.env.ZALO_CALLBACK_URL,
    endpoint: process.env.ZALO_ENDPOINT,
    query_endpoint: process.env.ZALO_QUERY_ENDPOINT,
    refund_url: process.env.ZALO_REFUND_URL,
    refund_endpoint: process.env.ZALO_REFUND_ENDPOINT,
};
