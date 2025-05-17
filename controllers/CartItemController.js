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
                include: [{
                    model: db.ProductVariantValue,
                    as: 'product_variant_values',  // Alias để liên kết với ProductVariantValue
                    include: [{
                        model: db.Product,
                        as: 'product',  // Alias để liên kết với Product
                        attributes: ['id', 'name', 'image', 'description']  // Các trường cần thiết
                    }]
                }]
            }),
            db.CartItem.count({
                where: whereClause,
            }),
        ]);

        res.status(200).json({
            message: 'Successfully retrieved cart items',
            data: cartItems,
            current_page: parseInt(page),
            total_pages: Math.ceil(totalCartItems / pageSize),
            total: totalCartItems,
        });
    },

    getCartItemById: async (req, res) => {
        const { id } = req.params;
        const cartItem = await db.CartItem.findByPk(id, {
            include: [{
                model: db.ProductVariantValue,
                as: 'product_variant_values',
                include: [{
                    model: db.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'image', 'description']
                }]
            }]
        });

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
            where: { cart_id: cart_id }, // Tim tat ca cac cart items liên quan đến cart_id đã được cung cấp
            include: [{
                model: db.ProductVariantValue,
                as: 'product_variant_values',
                include: [{
                    model: db.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'image', 'description']
                }]
            }]
        });

        return res.status(200).json({
            message: 'Successfully retrieved cart item',
            data: cartItem,
        });
    },

    insertCartItem: async (req, res) => {
        const { product_variant_id, quantity, cart_id } = req.body;

        // Kiểm tra xem product_variant_id có tồn tại trong bảng ProductVariantValue không
        const productVariantExists = await db.ProductVariantValue.findByPk(product_variant_id);
        if (!productVariantExists) {
            return res.status(404).json({
                message: 'Product variant not found'
            })
        }

        // Kiểm tra số lượng sản phẩm có đủ không
        if (productVariantExists.stock < quantity) {
            return res.status(400).json({
                message: 'Product quantity not enough'
            })
        }

        // Kiểm tra xem cart_id có tồn tại không
        const cartExists = await db.Cart.findByPk(cart_id);
        if (!cartExists) {
            return res.status(404).json({
                message: 'Cart not found'
            })
        }

        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        const existingCartItem = await db.CartItem.findOne({
            where: {
                product_variant_id: product_variant_id,
                cart_id: cart_id
            }
        });

        if (existingCartItem) {
            if (quantity === 0) {
                // Nếu số lượng bằng 0, xóa item
                await existingCartItem.destroy();
                return res.status(200).json({
                    message: 'Cart item has been removed'
                });
            } else {
                // Cập nhật số lượng nếu item đã tồn tại
                existingCartItem.quantity = quantity;
                await existingCartItem.save();
                return res.status(200).json({
                    message: 'Cart item quantity updated successfully',
                    data: existingCartItem
                });
            }
        } else {
            // Nếu item chưa tồn tại trong giỏ hàng và quantity > 0
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
