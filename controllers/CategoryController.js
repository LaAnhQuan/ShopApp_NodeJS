import { Sequelize } from "sequelize"
const { Op } = Sequelize
import db from "../models"

module.exports = {
    getCategories: async (req, res) => {
        // Get search and pagination parameters from the request query
        const { search = '', page = 1 } = req.query;
        const pageSize = 5; // Define the number of items per page
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    // { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Fetch categories with search and pagination
        const [categories, totalCategories] = await Promise.all([
            db.Category.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                // Add sorting if needed
            }),
            db.Category.count({
                where: whereClause
            })
        ]);

        // Send the response
        return res.status(200).json({
            message: 'Get categories successfully',
            data: categories,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalCategories / pageSize),
            totalCategories
        });
    },


    getCategoryById: async (req, res) => {
        const { id } = req.params;
        const category = await db.Category.findByPk(id);

        if (!category) {
            // Nếu không tìm thấy danh mục với ID đã cho, trả về lỗi 404
            return res.status(404).json({
                message: 'Category not found'
            });
        }
        res.status(200).json({
            message: 'Get a category successfully',
            data: category
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
        const { id } = req.params;  // Lấy id từ params trong URL
        const deleted = await db.Category.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({
                message: 'Delete a category successfully'
            });
        } else {
            res.status(404).json({
                message: 'Category not found'
            });
        }
    },

    updateCategory: async (req, res) => {
        const categoryId = req.params.id;  // Lấy id của danh mục từ params
        const updatedCategory = await db.Category.update(req.body, {
            where: { id: categoryId }
        });

        if (updatedCategory[0] > 0) {  // Sequelize `update` trả về mảng với phần tử đầu tiên là số dòng bị ảnh hưởng
            return res.status(200).json({
                message: 'Category updated successfully',
            });
        } else {
            return res.status(404).json({
                message: 'Category not found'
            });
        }
    }
}
