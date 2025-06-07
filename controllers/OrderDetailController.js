import { Sequelize } from "sequelize"
import db from "../models"
import { getAvatarURL } from "../helpers/imageHelper";

module.exports = {
    getOrderDetails: async (req, res) => {
        const orderDetails = await db.OrderDetail.findAll();  // Lấy tất cả các chi tiết đơn hàng
        res.status(200).json({
            message: 'Get order details successfully',
            data: orderDetails
        })
    },
    getOrderDetailById: async (req, res) => {
        const { id } = req.params;  // Lấy id từ params trong URL
        const orderDetail = await db.OrderDetail.findOne({
            where: { id }
        })

        if (orderDetail) {
            res.status(200).json({
                message: 'Get an order detail successfully',
                data: orderDetail
            })
        } else {
            res.status(404).json({
                message: 'Order detail not found'
            })
        }
    },

    getOrderDetailByOrderId: async (req, res) => {
        const { order_id } = req.params;  // Lấy id từ params trong URL
        const orderDetail = await db.OrderDetail.findAll({
            where: { order_id: order_id },
            include: [{
                model: db.ProductVariantValue,
                as: 'product_variant_values',
                include: [{
                    model: db.Product,
                    as: 'product',
                    attributes: ['name', 'image']
                }]
            }]
        });

        if (orderDetail) {
            res.status(200).json({
                message: 'Get an order detail successfully',
                data: orderDetail
            })
        } else {
            res.status(404).json({
                message: 'Order detail not found'
            })
        }
    },

    insertOrderDetail: async (req, res) => {
        const orderDetail = await db.OrderDetail.create(req.body);  // Tạo chi tiết đơn hàng mới từ req.body
        res.status(201).json({
            message: 'Insert an order detail successfully',
            data: orderDetail
        });
    },

    deleteOrderDetail: async (req, res) => {
        const { id } = req.params;  // Lấy id từ params trong URL
        const deleted = await db.OrderDetail.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({
                message: 'Delete an order detail successfully'
            });
        } else {
            res.status(404).json({
                message: 'Order detail not found'
            });
        }
    },

    updateOrderDetail: async (req, res) => {
        const { id } = req.params;  // Lấy id từ params trong URL
        const updatedOrderDetail = await db.OrderDetail.update(req.body, {
            where: { id }
        });

        if (updatedOrderDetail[0] > 0) {  // Sequelize `update` trả về mảng với phần tử đầu tiên là số dòng bị ảnh hưởng
            res.status(200).json({
                message: 'Update an order detail successfully',
            });
        } else {
            res.status(404).json({
                message: 'Order detail not found'
            });
        }
    },
}
