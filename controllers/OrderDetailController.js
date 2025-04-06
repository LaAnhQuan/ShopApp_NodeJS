import { Sequelize } from "sequelize"
import db from "../models"

module.exports = {
    getOrderDetails: async (req, res) => {
        const orderDetails = await db.OrderDetail.findAll();  // Lấy tất cả các chi tiết đơn hàng
        res.status(200).json({
            message: 'Get order details successfully',
            data: orderDetails
        })
    },
    getOrderDetailById: async (req, res) => {
        res.status(200).json({
            message: 'Get an order detail successfully'
        })
    },

    insertOrderDetail: async (req, res) => {
        res.status(200).json({
            message: 'Insert an order detail successfully'
        })
    },

    deleteOrderDetail: async (req, res) => {
        res.status(200).json({
            message: 'Delete an order detail successfully'
        })
    },

    updateOrderDetail: async (req, res) => {
        res.status(200).json({
            message: 'Update an order detail successfully'
        })
    },
}
