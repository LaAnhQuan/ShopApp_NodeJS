import { Sequelize } from "sequelize"
const { Op } = Sequelize
import db from "../models"


module.exports = {
    getBrands: async (req, res) => {
        // Get search and pagination parameters from the request query
        const { search = '', page = 1 } = req.query;
        const pageSize = 5; // Define the number of items per page
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                ]
            };
        }

        // Fetch brands with search and pagination
        const [brands, totalBrands] = await Promise.all([
            db.Brand.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                // Add sorting if needed
            }),
            db.Brand.count({
                where: whereClause
            })
        ]);

        // Send the response
        return res.status(200).json({
            message: 'Get brands successfully',
            data: brands,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalBrands / pageSize),
            totalBrands
        });
    },

    getBrandById: async (req, res) => {
        const { id } = req.params;

        const brand = await db.Brand.findByPk(id);
        if (!brand) {
            // If no brand is found with the given ID, return a 404 Not Found response
            return res.status(404).json({
                message: 'Brand not found'
            });
        }

        // If the brand is found, return it with a status of 200 OK
        res.status(200).json({
            message: 'Brand information retrieved successfully',
            data: brand
        });
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
