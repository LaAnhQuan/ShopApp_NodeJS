import { Sequelize } from "sequelize"
import db from "../models"

module.exports = {
    getCategories: async (req, res) => {
        res.status(200).json({
            message: 'Get categories successfully'
        })
    },

    getCategoryById: async (req, res) => {
        res.status(200).json({
            message: 'Get a category successfully'
        })
    },

    insertCategory: async (req, res) => {
        try {
            // console.log(req.body)
            const category = await db.Category.create(req.body);
            res.status(201).json({
                message: 'Insert a category successfully',
                data: category
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error when add a category',
                error: error.message
            });
        }
    },

    deleteCategory: async (req, res) => {
        res.status(200).json({
            message: 'Delete a category successfully'
        })
    },

    updateCategory: async (req, res) => {
        res.status(200).json({
            message: 'Update a category successfully'
        })
    },
}
