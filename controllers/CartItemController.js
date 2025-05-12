import { Sequelize, where } from "sequelize";
const { Op } = Sequelize;
import db from "../models";
import { getAvatarURL } from "../helpers/imageHelper";

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
                message: 'Cart Item not found'
            });
        }

        res.status(200).json({
            message: 'Get cart item information successfully',
            data: cartItem
        });
    },

    getCartItemsByCartId: async (req, res) => {
        const { cart_id } = req.params;
        const cartItem = await db.CartItem.findAll({
            where: { cart_id: cart_id } //Tim tat ca cac cart items liên quan đến cart_id đã được cung cấp
        });

        return res.status(200).json({
            message: 'Successfully retrieved cart item',
            data: cartItem,
        });
    },


    insertCartItem: async (req, res) => {

        const { product_id, quantity, cart_id } = req.body;

        const productExists = await db.Product.findByPk(product_id);
        if (!productExists) {
            return res.status(404).json({
                message: 'Product is not found'
            })
        }

        // Kiểm tra số lượng sản phâm có còn đủ hay là không
        if (productExists.quantity < quantity) {
            return res.status(400).json({
                message: 'Product quantity not enough'
            })
        }
        const cartExists = await db.Cart.findByPk(cart_id);
        if (!cartExists) {
            return res.status(404).json({
                message: 'Cart is not found'
            })
        }

        const existingCartItem = await db.CartItem.findOne({
            where: {
                product_id: product_id,
                cart_id: cart_id
            }
        })
        if (existingCartItem) {
            if (quantity === 0) {
                // If quantity is 0, remove the item
                await existingCartItem.destroy();
                return res.status(200).json({
                    message: 'Cart item has been removed'
                });
            } else {
                // Update the quantity of the existing cart item
                existingCartItem.quantity = quantity;
                await existingCartItem.save();
                return res.status(200).json({
                    message: 'Cart item quantity updated successfully',
                    data: existingCartItem
                });
            }
        } else {
            // If the item doesn't exist and quantity is not 0, create a new item
            if (quantity > 0) {
                const newCartItem = await db.CartItem.create(req.body);
                return res.status(201).json({
                    message: 'New cart item added successfully',
                    data: newCartItem
                });
            }
        }

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