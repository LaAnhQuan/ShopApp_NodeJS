import { Sequelize, where } from "sequelize"
const { Op } = Sequelize
import db from "../models"
import { getAvatarURL } from "../helpers/imageHelper"

module.exports = {
    getCategories: async (req, res) => {
        // Get search and pagination parameters from the request query
        const { search = '', page = 1 } = req.query
        const pageSize = 5 // Define the number of items per page
        const offset = (page - 1) * pageSize

        let whereClause = {}
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    // { description: { [Op.like]: `%${search}%` } }
                ]
            }
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
        ])

        // Send the response
        return res.status(200).json({
            message: 'Get categories successfully',
            data: categories.map(category => ({
                ...category.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(category.image) // Format image URL
            })),
            current_page: parseInt(page, 10),
            total_page: Math.ceil(totalCategories / pageSize),
            total: totalCategories
        })

    },


    getCategoryById: async (req, res) => {
        const { id } = req.params
        const category = await db.Category.findByPk(id)

        if (!category) {
            // Nếu không tìm thấy danh mục với ID đã cho, trả về lỗi 404
            return res.status(404).json({
                message: 'Category not found'
            })
        }
        res.status(200).json({
            message: 'Get a category successfully',
            data: {
                ...category.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(category.image) // Format image URL
            }
        })

    },

    insertCategory: async (req, res) => {
        // console.log(req.body)
        const category = await db.Category.create(req.body)
        res.status(201).json({
            message: 'Insert a category successfully',
            data: {
                ...category.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(category.image) // Format image URL
            }
        })

    },

    deleteCategory: async (req, res) => {
        const { id } = req.params  // Lấy id từ params trong URL
        const deleted = await db.Category.destroy({
            where: { id }
        })

        if (deleted) {
            res.status(200).json({
                message: 'Delete a category successfully'
            })
        } else {
            res.status(404).json({
                message: 'Category not found'
            })
        }
    },

    updateCategory: async (req, res) => {
        const { id } = req.params
        const { name } = req.body  // Lấy id của danh mục từ params

        //check another category with the same and a different ID
        if (name !== undefined) {
            const existingCategory = await db.Category.findOne({
                where: {
                    name: name,
                    id: { [db.Sequelize.Op.ne]: id } // Exclude the current category from the check
                }
            })


            if (existingCategory) {
                //If a duplicate is found, return an error response
                return res.status(400).json({
                    message: "The Category is exists, please choose different name"
                })
            }
        }

        const updatedCategory = await db.Category.update(req.body, {
            where: { id }
        })

        return res.status(200).json({
            message: 'Category updated successfully',
        })
    },

    getProductByNameCategory: async (req, res) => {
        // Lấy tham số tìm kiếm và phân trang từ query
        const { page = 1, search = '' } = req.query;
        const pageSize = 5; // Số lượng item mỗi trang
        const offset = (page - 1) * pageSize;

        // Lọc theo tên (category name và product name)
        let whereClause = {};
        if (search) {
            whereClause = {
                name: {
                    [Op.like]: `%${search}%` // Lọc tên theo chuỗi tìm kiếm (bao gồm cả dấu % để tìm kiếm kiểu chứa)
                }
            };
        }

        // Lấy danh mục và tất cả sản phẩm liên quan với phân trang và tìm kiếm
        const [categories, totalCategories] = await Promise.all([
            db.Category.findAll({
                where: whereClause, // Sử dụng whereClause đã cập nhật
                limit: pageSize,
                offset: offset,
                include: [{
                    model: db.Product, // Kết hợp bảng Product
                    as: 'Products', // Alias phải trùng với quan hệ đã thiết lập
                    required: false, // Để lấy danh mục dù không có sản phẩm nào
                    attributes: ['id', 'name', 'price', 'image'], // Chọn các trường cần thiết từ bảng Product
                }],
                attributes: ['id', 'name'] // Thêm id của Category vào đây
            }),
            db.Category.count({
                where: whereClause // Đếm tổng số danh mục theo điều kiện lọc
            })
        ]);

        // Trả về kết quả
        return res.status(200).json({
            message: 'Lấy danh mục và sản phẩm thành công',
            data: categories.map(category => ({
                id: category.id, // Lấy id của Category
                name: category.name, // Lấy tên của Category
                products: category.Products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                }))
            })),
            current_page: parseInt(page, 10),
            total_page: Math.ceil(totalCategories / pageSize),
            total: totalCategories
        });
    }

}
