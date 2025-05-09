import { Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models";

module.exports = {
    getCartItems: async (req, res) => {
        const { cart_id, page = 1 } = req.query;
        const pageSize = 5;
        const offset = (page - 1) * pageSize;

        const whereClause = {};
        if (cart_id) whereClause.cart_id = cart_id;

        const [cartItems, totalCartItems] = await Promise.all([
            db.CartItem.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
            }),
            db.CartItem.count({
                where: whereClause,
            }),
        ]);

        res.status(200).json({
            message: 'Successfully retrieved cart items',
            data: cartItems,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCartItems / pageSize),
            totalCartItems,
        });
    },

    getCartItemById: async (req, res) => {
        const { id } = req.params;
        const cartItem = await db.CartItem.findByPk(id);

        if (!cartItem) {
            return res.status(404).json({
                message: 'Cart item not found',
            });
        }

        res.status(200).json({
            message: 'Successfully retrieved cart item',
            data: cartItem,
        });
    },


    insertCartItem: async (req, res) => {

        const cartItem = await db.CartItem.create(req.body);

        res.status(201).json({
            message: 'Cart item added successfully',
            data: cartItem,
        });

    },

    deleteCartItem: async (req, res) => {
        const { id } = req.params;
        const deleted = await db.CartItem.destroy({
            where: { id },
        });

        if (deleted) {
            return res.status(200).json({
                message: 'Cart item deleted successfully',
            });
        }

        res.status(404).json({
            message: 'Cart item not found',
        });
    },
    updateCartItem: async (req, res) => {
        const { id } = req.params;
        const [updated] = await db.CartItem.update(req.body, {
            where: { id },
        });

        if (updated) {
            const updatedCartItem = await db.CartItem.findByPk(id);
            return res.status(200).json({
                message: 'Cart item updated successfully',
                data: updatedCartItem,
            });
        }

        res.status(404).json({
            message: 'Cart item not found',
        });

    }
};