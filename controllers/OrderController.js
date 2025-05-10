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
        const { id } = req.params;
        const order = await db.Order.findByPk(id, {
            include: [{
                model: db.OrderDetail,
                as: 'order_details' // 'orderDetails' should match the alias used in the association
            }]
        });

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json({
            message: 'Order information retrieved successfully',
            data: order
        });

    },

    insertOrder: async (req, res) => {
        const userId = req.body.user_id;
        // Check if the user exists in the database
        const userExists = await db.User.findByPk(userId);
        if (!userExists) {
            // If the user does not exist, return a 404 Not Found error
            return res.status(404).json({
                message: 'User does not exist'
            });
        }

        // If the user exists, create the order
        const newOrder = await db.Order.create(req.body);
        if (newOrder) {
            res.status(201).json({
                message: 'New order created successfully',
                data: newOrder
            });
        } else {
            // Handle cases where the order could not be created
            res.status(400).json({
                message: 'Could not create order'
            });
        }

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
