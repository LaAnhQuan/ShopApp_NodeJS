import { Sequelize } from "sequelize"
import db from "../models"

module.exports = {
    getBrands: async (req, res) => {
        res.status(200).json({
            message: 'Get brands successfully'
        })
    },

    getBrandById: async (req, res) => {
        res.status(200).json({
            message: 'Get a brand successfully'
        })
    },

    insertBrand: async (req, res) => {
        try {
            // console.log(req.body)
            const brand = await db.Brand.create(req.body);  // Thêm một thương hiệu mới vào bảng Brand
            res.status(201).json({
                message: 'Insert a brand successfully',
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error when add a brand',
                error: error.message
            });
        }
    },

    deleteBrand: async (req, res) => {
        res.status(200).json({
            message: 'Delete a brand successfully'
        })
    },

    updateBrand: async (req, res) => {
        res.status(200).json({
            message: 'Update a brand successfully'
        })
    },
}
