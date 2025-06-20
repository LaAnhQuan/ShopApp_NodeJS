import { Sequelize, where } from "sequelize";
const { Op } = Sequelize;
import db from "../models";
import { getAvatarURL } from "../helpers/imageHelper";

module.exports = {
    getProductImages: async (req, res) => {
        const { product_id } = req.query
        const page = parseInt(req.query.page) || 1
        const pageSize = 5
        const offset = (page - 1) * pageSize

        let whereClause = {}
        if (product_id) {
            whereClause.product_id = product_id
        }

        const [productImages, totalProductImages] = await Promise.all([
            db.ProductImage.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                // include: [{ model: db.Product, as: 'Product' }]
            }),
            db.ProductImage.count({
                where: whereClause
            })
        ])

        return res.status(200).json({
            message: 'Get product images successfully',
            // data: productImages,
            data: productImages.map(productImage => ({
                ...productImage.get({ plain: true }),
                image_url: productImage.image_url
            })),
            current_page: page,
            total_page: Math.ceil(totalProductImages / pageSize),
            total: totalProductImages
        })
    },

    getProductImageById: async (req, res) => {
        const { id } = req.params;
        const productImage = await db.ProductImage.findByPk(id);

        if (!productImage) {
            return res.status(404).json({
                message: "Product image not found"
            });
        }

        res.status(200).json({
            message: "Get product image successfully",
            data: {
                ...productImage.get({ plain: true }), // Chuyển Sequelize instance thành đối tượng thuần
                image_url: productImage.image_url // Định dạng URL của ảnh
            }
        });

    },

    insertProductImage: async (req, res) => {

        const { product_id, image_url } = req.body;
        // Kiem tra xem san pham co ton tai hay khong
        const product = await db.Product.findByPk(product_id)
        if (!product) {
            return res.status(404).json({
                message: "Product is not found"
            })
        }


        // Neu truong product.image trong thi cap nhat no bang image_url
        if (!product.image || product.image.trim() === "") {
            await product.update({ image: image_url });
        }


        //Kiem tra xem cap product_id va image_url da ton tai trong bang productImage hay chua
        const existingImage = await db.ProductImage.findOne({
            where: {
                product_id: product_id,
                image_url: image_url
            }
        })
        if (existingImage) {
            return res.status(409).json({
                message: "This image has already been linked to this product."
            })
        }


        const productImage = await db.ProductImage.create(req.body);
        res.status(201).json({
            message: "Insert product image successfully",
            data: {
                ...productImage.get({ plain: true }), // Chuyển Sequelize instance thành đối tượng thuần
                image_url: productImage.image_url
            }
        });


    },

    deleteProductImage: async (req, res) => {
        const { id } = req.params;
        const deleted = await db.ProductImage.destroy({
            where: { id }
        });

        if (deleted) {
            return res.status(200).json({
                message: "Delete product image successfully"
            });
        } else {
            return res.status(404).json({
                message: "Product image not found"
            });
        }
    },

};
