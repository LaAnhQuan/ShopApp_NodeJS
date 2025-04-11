import { Model, Sequelize } from "sequelize"
const { Op } = Sequelize
import db from "../models"


module.exports = {
    getNewsDetails: async (req, res) => {
        // Get search and pagination parameters from the request query
        const { page = 1 } = req.query;
        const pageSize = 5; // Define the number of items per page
        const offset = (page - 1) * pageSize;

        // Fetch categories with search and pagination
        const [newsDetails, totalNewsDetails] = await Promise.all([
            db.NewsDetail.findAll({
                limit: pageSize,
                offset: offset,
                // Add sorting if needed
                // include: [{ model: db.News }, { model: db.Product }]
            }),
            db.NewsDetail.count()
        ]);

        // Send the response
        return res.status(200).json({
            message: 'Get news detail successfully',
            data: newsDetails,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalNewsDetails / pageSize),
            totalNewsDetails
        });
    },

    getNewsDetailById: async (req, res) => {
        const { id } = req.params;
        const newsDetail = await db.NewsDetail.findByPk(id, {
            include: [{ model: db.News }, { model: db.Product }]
        });

        if (!newsDetail) {
            // Nếu không tìm thấy danh mục với ID đã cho, trả về lỗi 404
            return res.status(404).json({
                message: 'News not found'
            });
        }
        res.status(200).json({
            message: 'Get a news successfully',
            data: newsDetail
        })
    },
    insertNewsDetail: async (req, res) => {
        const { product_id, news_id } = req.body;
        const productExists = await db.Product.findByPk(product_id);
        if (!productExists) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }

        // Check if the news article exists
        const newsExists = await db.News.findByPk(news_id);
        if (!newsExists) {
            return res.status(404).json({
                message: 'News article not found',
            });
        }

        const duplicateExists = await db.NewsDetail.findOne({
            where: { news_id, product_id }
        });

        if (duplicateExists) {
            return res.status(409).json({
                // 409 Conflict: phù hợp khi dữ liệu đã tồn tại
                message: 'The relationship between the product and the news already exists',
            });
        }


        const newsDetail = await db.NewsDetail.create({ product_id, news_id });

        res.status(201).json({
            message: 'News detail added successfully!',
            data: newsDetail
        });
    },
    updateNewsDetail: async (req, res) => {
        const { id } = req.params;  // Lấy id của danh mục từ params
        const { product_id, news_id } = req.body;
        // Check for existing duplicate (excluding the current record)
        const existingDuplicate = await db.NewsDetail.findOne({
            where: {
                product_id,
                news_id,
                id: { [Sequelize.Op.ne]: id } // Exclude the current record from the check
            }
        });

        if (existingDuplicate) {
            return res.status(409).json({
                message: 'The relationship between the product and the news already exists in another record',
            });
        }

        const updateNewsDetail = await db.NewsDetail.update({ product_id, news_id }, {
            where: { id }
        });

        if (updateNewsDetail[0] > 0) {  // Sequelize `update` trả về mảng với phần tử đầu tiên là số dòng bị ảnh hưởng
            return res.status(200).json({
                message: 'News detail update successfully',
            });
        } else {
            return res.status(404).json({
                message: 'News detail not found'
            });
        }
    },
    deleteNewsDetail: async (req, res) => {
        const { id } = req.params;  // Lấy id từ params trong URL
        const deleted = await db.NewsDetail.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({
                message: 'Delete a news detail successfully'
            });
        } else {
            res.status(404).json({
                message: 'News detail not found'
            });
        }
    },
}