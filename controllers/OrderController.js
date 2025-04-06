import { Sequelize } from "sequelize"
const { Op } = Sequelize
import db from "../models"

module.exports = {
    getOrders: async (req, res) => {
        res.status(200).json({
            message: 'Get orders successfully'
        })
    },

    getOrderById: async (req, res) => {
        res.status(200).json({
            message: 'Get an order successfully'
        })
    },

    insertOrder: async (req, res) => {
        const order = await db.Order.create(req.body);  // Tạo đơn hàng mới từ dữ liệu trong req.body
        res.status(201).json({
            message: 'Insert an order successfully',
            data: order
        });
    },

    deleteOrder: async (req, res) => {
        const { id } = req.params;  // Lấy id của đơn hàng từ URL
        const deleted = await db.Order.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({
                message: 'Delete an order successfully'
            });
        } else {
            res.status(404).json({
                message: 'Order not found'
            });
        }
    },

    updateOrder: async (req, res) => {
        const orderId = req.params.id;  // Lấy id của đơn hàng từ URL
        const updatedOrder = await db.Order.update(req.body, {
            where: { id: orderId }
        });

        if (updatedOrder[0] > 0) {  // Sequelize `update` trả về mảng với phần tử đầu tiên là số dòng bị ảnh hưởng
            return res.status(200).json({
                message: 'Update an order successfully',
            });
        } else {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
    },
}
