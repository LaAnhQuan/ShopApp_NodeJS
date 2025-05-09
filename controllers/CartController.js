import { Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models";

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
                    as: 'cartItems'
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
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalCarts / pageSize),
            totalCarts
        });
    },

    getCartById: async (req, res) => {
        const { id } = req.params;
        const cart = await db.Cart.findByPk(id, {
            include: [{
                model: db.CartItem,
                as: 'cartItems'
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

        const cart = await db.Cart.create(req.body);
        return res.status(201).json({
            message: 'Create cart successfully',
            data: cart
        });

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