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
        const brand = await db.Brand.create(req.body);  // Thêm một thương hiệu mới vào bảng Brand
        res.status(201).json({
            message: 'Insert a brand successfully',
            data: brand
        });
    },

    deleteBrand: async (req, res) => {
        const { id } = req.params;  // Lấy id của thương hiệu từ URL
        const deleted = await db.Brand.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({
                message: 'Delete a brand successfully'
            });
        } else {
            res.status(404).json({
                message: 'Brand not found'
            });
        }
    },


    updateBrand: async (req, res) => {
        const { id } = req.params;  // Lấy id của thương hiệu từ URL
        const { name } = req.body;
        if (name !== undefined) {
            //check another category with the same and a different ID
            const existingBrand = await db.Brand.findOne({
                where: {
                    name: name,
                    id: { [db.Sequelize.Op.ne]: id } // Exclude the current category from the check
                }
            })
            if (existingBrand) {
                //If a duplicate is found, return an error response
                return res.status(400).json({
                    message: "The Brand is exists, please choose different name"
                })
            }
        }

        const updatedBrand = await db.Brand.update(req.body, {
            where: { id }
        });

        return res.status(200).json({
            message: 'Brand updated successfully',
        });
    }

}
