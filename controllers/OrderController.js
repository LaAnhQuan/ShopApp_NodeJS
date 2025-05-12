import { Sequelize, where } from "sequelize"
const { Op } = Sequelize
import db from "../models"
import { OrderStatus } from "../constants"
import { getAvatarURL } from "../helpers/imageHelper";

module.exports = {
    getOrders: async (req, res) => {
        const { search = '', page = 1, status } = req.query;
        const pageSize = 5;
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { note: { [Op.like]: `%${search}%` } },
                ]
            };
        }

        if (status) {
            whereClause.status = status;
        }

        const [orders, totalOrders] = await Promise.all([
            db.Order.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                order: [['created_at', 'DESC']]
            }),
            db.Order.count({ where: whereClause })
        ]);

        return res.status(200).json({
            message: 'Fetched orders successfully',
            data: orders,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalOrders / pageSize),
            totalOrders
        });
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

    /*
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
    */

    deleteOrder: async (req, res) => {
        const { id } = req.params;  // Lấy id của đơn hàng từ URL

        // Cập nhật trạng thái đơn hàng sang FAILED thay vì xóa
        const [updated] = await db.Order.update({ status: OrderStatus.FAILED }, {
            where: { id }
        });

        if (updated) {
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
