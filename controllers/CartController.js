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
                    as: 'cart_items'
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
        const cart = await db.Cart.findByPk(id, {
            include: [{
                model: db.CartItem,
                as: 'cart_items'
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
    },


    insertCart: async (req, res) => {
        const { session_id, user_id } = req.body;

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
                    { user_id: user_id ? user_id : null },
                ],
            },
        });

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
        const { cart_id, total, note } = req.body;
        const transaction = await db.sequelize.transaction();

        try {
            // Verify the cart exists and has items
            const cart = await db.Cart.findByPk(cart_id, {
                include: [{
                    model: db.CartItem,
                    as: 'cart_items',
                    include: [{
                        model: db.Product,
                        as: 'product'
                    }]
                }]
            });

            if (!cart || !cart.cart_items.length) {
                return res.status(404).json({ message: 'Cart does not exist or is empty.' });
            }

            // Create an order
            const newOrder = await db.Order.create(
                {
                    user_id: cart.user_id, // assuming cart model has user_id
                    session_id: cart.session_id, // assuming cart model has session_id
                    status: OrderStatus.PENDING,
                    total: total || cart.cart_items.reduce((acc, item) => acc + item.quantity * item.product.price, 0),
                    note: note,
                },
                { transaction: transaction }
            );

            // Insert cart items to order_details
            for (let item of cart.cart_items) {
                await db.OrderDetail.create(
                    {
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.product.price, // assuming join to fetch product details
                    },
                    { transaction: transaction }
                );
            }

            // Delete cart items
            await db.CartItem.destroy(
                {
                    where: { cart_id: cart.id },
                },
                { transaction: transaction }
            );

            // Delete the cart
            await cart.destroy({ transaction: transaction });
            // add 3rd module(eg: vnpay,...);
            // Commit the transaction
            await transaction.commit();
            res.status(201).json({
                message: 'Checkout successful.',
                data: newOrder
            });
        } catch (error) {
            // Rollback the transaction on error
            await transaction.rollback();
            res.status(500).json({
                message: 'Checkout failed.',
                error: error.message,
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