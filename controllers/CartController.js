import { Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models";
import { OrderStatus } from "../constants";
import { getAvatarURL } from "../helpers/imageHelper";

module.exports = {
    getCarts: async (req, res) => {
        const { session_id, user_id, page = 1 } = req.query;
        const pageSize = 5;
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (session_id) whereClause.session_id = session_id;
        if (user_id) whereClause.user_id = user_id;

        const [carts, totalCarts] = await Promise.all([
            db.Cart.findAll({
                where: whereClause,
                include: [{
                    model: db.CartItem,
                    as: 'cart_items',
                    include: [{
                        model: db.ProductVariantValue,
                        as: 'product_variant_values',  // Alias cần phải khớp với alias trong mối quan hệ
                        include: [{
                            model: db.Product,
                            as: 'product',  // Alias cho bảng Product
                            attributes: ['id', 'name', 'image', 'description']
                        }]
                    }]
                }],
                limit: pageSize,
                offset: offset
            }),
            db.Cart.count({
                where: whereClause
            })
        ]);

        return res.status(200).json({
            message: 'Get carts successfully',
            data: carts,
            current_page: parseInt(page, 10),
            total_page: Math.ceil(totalCarts / pageSize),
            total: totalCarts
        });
    },


    getCartById: async (req, res) => {
        const { id } = req.params;
        const cart = await db.Cart.findOne({
            where: { user_id: id },
            include: [{
                model: db.CartItem,
                as: 'cart_items',
                include: [{
                    model: db.ProductVariantValue,
                    as: 'product_variant_values',  // Alias cần phải khớp với alias trong mối quan hệ
                    include: [{
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name', 'image', 'description']
                    }]
                }]
            }]
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        res.status(200).json({
            message: 'Get cart information successfully',
            data: cart
        });
    }
    ,

    insertCart: async (req, res) => {
        const { session_id, user_id } = req.body;
        console.log(">>> check req.body", req.body.user_id)

        // Ensure only one of session_id or user_id is provided
        if ((session_id && user_id) || (!session_id && !user_id)) {
            return res.status(400).json({
                message: 'Only one of session_id or user_id must be provided',
            });
        }

        // Check if a cart with the same session_id already exists
        const existingCart = await db.Cart.findOne({
            where: {
                [Op.or]: [
                    { session_id: session_id ? session_id : null },
                    { user_id: req.body.user_id ? user_id : null },
                ],
            },
        });

        console.log("check >>> ", existingCart);
        if (existingCart) {
            // If a cart with the same session_id exists, send an error response
            return res.status(409).json({
                message: 'A cart with this session_id or user_id already exists.',
            });
        }

        const cart = await db.Cart.create(req.body);
        return res.status(201).json({
            message: 'Create cart successfully',
            data: cart
        });
    },

    checkoutCart: async (req, res) => {
        const { cart_id, phone, note, address } = req.body;
        const transaction = await db.sequelize.transaction();  // Khởi tạo transaction

        try {
            // Lấy thông tin giỏ hàng
            const cart = await db.Cart.findByPk(cart_id, {
                include: [{
                    model: db.CartItem,
                    as: 'cart_items',
                    attributes: ['product_variant_id', 'quantity'],  // Chỉ lấy các trường này
                    include: [{
                        model: db.ProductVariantValue,
                        as: 'product_variant_values',  // Alias cho liên kết với ProductVariantValue
                        include: [{
                            model: db.Product,
                            as: 'product',  // Alias cho liên kết với Product
                            attributes: ['id', 'name', 'image', 'description']  // Chỉ lấy các trường cần thiết từ Product
                        }]
                    }]
                }]
            });

            if (!cart || !cart.cart_items.length) {
                return res.status(404).json({
                    message: 'Cart does not exist or is empty'
                });
            }

            // Tính tổng giá trị không được cung cấp
            const calculatedTotal = cart.cart_items.reduce((acc, item) => {
                acc += item.quantity * item.product_variant_values.price;  // Sửa theo alias đúng
                return acc;
            }, 0);

            // Tạo đơn hàng mới
            const newOrder = await db.Order.create({
                user_id: cart.user_id || null,  // Giả định cart có user_id
                session_id: cart.session_id || null,  // Giả định cart có session_id
                status: OrderStatus.PENDING,  // Trạng thái đơn hàng
                total: calculatedTotal,  // Dùng tổng giá trị được tính
                note: note || '',  // Ghi chú
                phone: phone,
                address: address,
            }, { transaction });

            // Chèn thông tin chi tiết vào bảng order_details
            for (const item of cart.cart_items) {
                await db.OrderDetail.create({
                    order_id: newOrder.id,
                    product_variant_id: item.product_variant_values.id,  // Sử dụng product_variant_id
                    quantity: item.quantity,
                    price: item.product_variant_values.price  // Giá của sản phẩm biến thể
                }, { transaction });
            }

            // Xóa các mục trong giỏ hàng
            await db.CartItem.destroy({
                where: { cart_id: cart_id },
                transaction
            });

            // Xóa giỏ hàng
            await cart.destroy({ transaction });

            // Thêm tích hợp thanh toán (ví dụ: VNPay...)
            // Có thể tích hợp thêm các bước thanh toán vào module thanh toán sử dụng

            // Xác nhận transaction thành công
            await transaction.commit();

            res.status(201).json({
                message: 'Cart checkout successful',
                data: newOrder
            });

        } catch (error) {
            // Rollback transaction khi có lỗi
            await transaction.rollback();
            res.status(500).json({
                message: 'Cart checkout error',
                error: error.message
            });
        }
    },

    deleteCart: async (req, res) => {
        const { id } = req.params;

        const deletedCart = await db.Cart.destroy({
            where: { id }
        });

        if (deletedCart) {
            return res.status(200).json({
                message: 'Cart deleted successfully'
            });
        } else {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }
    }
};
