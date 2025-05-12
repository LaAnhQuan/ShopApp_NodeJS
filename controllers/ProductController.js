import { Sequelize, where } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest"
import { date } from "joi"
import { getAvatarURL } from "../helpers/imageHelper";


module.exports = {
    getProducts: async (req, res) => {
        // const products = await db.Product.findAll() //not good, must "paging"
        //search and paging 
        //req.query.search, eg: ...?search=iphone16&page=1
        //name, description, or description, or specification contains "search" 
        const { search = '', page = 1 } = req.query; // Default to an empty search
        const pageSize = 5; // Define the number of items per page
        const offset = (page - 1) * pageSize;
        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { specification: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        const [products, totalProducts] = await Promise.all([
            db.Product.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                // Consider adding `order` if you need sorting
            }),
            db.Product.count({
                where: whereClause
            })
        ]);
        return res.status(200).json({
            message: 'Get a product successfully',
            data: products,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalProducts / pageSize),
            totalProducts
        });

    },

    getProductById: async (req, res) => {
        const { id } = req.params;  // Lấy id từ params trong URL
        const product = await db.Product.findByPk(id, {
            include: [{
                model: db.ProductImage, // Su dung ten model dung dinh nghia trong associations
                as: 'product_images' // Đảm bảo rằng đã khai báo 'as' trong mối quan hệ associations nếu có 
            }]
        });

        if (product) {
            res.status(200).json({
                message: 'Product found successfully',
                data: product
            });
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    },

    insertProduct: async (req, res) => {

        const product = await db.Product.create(req.body)
        res.status(201).json({
            message: 'Insert a product successfully',
            data: product
        })
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;
        const deleted = await db.Product.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(200).json({
                message: 'Delete a product successfully'
            })
        } else {
            res.status(404).json({
                message: 'Product is not found'
            })
        }

    },

    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const existingProduct = await db.Product.findOne({
            where: {
                name: name,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (existingProduct) {
            return res.status(400).json({
                message: 'A product with this name already exists. Please choose a different name.'
            });
        }

        const updatedProduct = await db.Product.update(req.body, {
            where: { id }
        });


        if (updatedProduct[0] > 0) {  // Sequelize `update` returns an array where the first element is the number of affected rows
            return res.status(200).json({
                message: 'Product updated successfully',
            });
        } else {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
    },

}
