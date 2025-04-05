import { Sequelize } from "sequelize"
import db from "../models"

module.exports = {
    getProducts: async (req, res) => {
        res.status(200).json({
            message: 'Get products successfully'
        })
    },
    getProductById: async (req, res) => {
        res.status(200).json({
            message: 'Get a product successfully'
        })
    },

    insertProduct: async (req, res) => {

        try {
            // console.log(req.body)
            const product = await db.Product.create(req.body)
            res.status(201).json({
                message: 'Insert a product successfully',
                data: product
            })
        } catch (error) {
            res.status(500).json({
                message: 'Error when add a product',
                error: error.message
            })
        }
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


