import { Sequelize } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertProductRequest from "../dtos/requests/InsertProductRequest"
import { date } from "joi"

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

    insertProduct: async (req, res) => {
        const product = await db.Product.create(req.body)
        res.status(201).json({
            message: 'Insert a product successfully',
            data: product
        })
    },

    deleteProduct: async (req, res) => {
        res.status(200).json({
            message: 'Delete a product successfully'
        })
    },

    updateProduct: async (req, res) => {
        res.status(200).json({
            message: 'Update a product successfully'
        })
    },

}
