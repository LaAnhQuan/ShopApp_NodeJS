const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const config = require('../config/zalopay.config');

const createPayment = async (req, res) => {
    const embed_data = {
        redirecturl: "https://www.facebook.com/?locale=vi_VN"
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: "user123",
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `HK - Payment for the order #${transID}`,
        bank_code: "",
        callback_url: config.callback_url
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const handleCallback = async (req, res) => {
    let result = {};

    try {
        const { data: dataStr, mac: reqMac } = req.body;
        const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            const dataJson = JSON.parse(dataStr);
            console.log(" Order thành công:", dataJson.app_trans_id);

            // TODO: Cập nhật đơn hàng ở đây nếu bạn có DB

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (err) {
        result.return_code = 0;
        result.return_message = err.message;
    }

    res.json(result);
};

const getOrderStatus = async (req, res) => {
    const app_trans_id = req.params.app_trans_id;

    const postData = {
        app_id: config.app_id,
        app_trans_id
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios({
            method: 'post',
            url: config.query_endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(postData)
        });

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const refundMoney = async (req, res) => {
    const zp_trans_id = req.params.zp_trans_id;
    const timestamp = Date.now();
    const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id

    let params = {
        app_id: config.app_id,
        m_refund_id: `${moment().format('YYMMDD')}_${config.app_id}_${uid}`,
        timestamp, // miliseconds
        zp_trans_id: Number(zp_trans_id), // ép kiểu
        amount: 50000,
        description: 'ZaloPay Refund Demo',
    };

    // app_id|zp_trans_id|amount|description|timestamp
    let data = params.app_id + "|" + params.zp_trans_id + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.refund_url, qs.stringify(params), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error.message)

    }

}

const refundMoneyStatus = async (req, res) => {
    const m_refund_id = req.params.m_refund_id;

    const params = {
        app_id: config.app_id,
        timestamp: Date.now(),
        m_refund_id: m_refund_id,
    };

    const data = `${params.app_id}|${params.m_refund_id}|${params.timestamp}`;
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(
            config.refund_endpoint,
            new URLSearchParams(params).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return res.status(200).json(result.data);
    } catch (error) {
        console.error('ZaloPay Refund Status Error:', error.message);
        return res.status(500).json({ error: 'Refund status check failed' });
    }
};


module.exports = {
    createPayment,
    handleCallback,
    getOrderStatus,
    refundMoney,
    refundMoneyStatus
};
