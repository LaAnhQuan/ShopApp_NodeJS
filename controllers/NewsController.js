import { Model, Sequelize } from "sequelize"
const { Op } = Sequelize
import db from "../models"
import { getAvatarURL } from "../helpers/imageHelper";

module.exports = {
    getNewsArticles: async (req, res) => {
        // Get search and pagination parameters from the request query
        const { search = '', page = 1 } = req.query;
        const pageSize = 5; // Define the number of items per page
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Fetch categories with search and pagination
        const [news, totalNews] = await Promise.all([
            db.News.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                // Add sorting if needed
            }),
            db.News.count({
                where: whereClause
            })
        ]);

        // Send the response
        return res.status(200).json({
            message: 'Get news articles successfully',
            data: news.map(article => ({
                ...article.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(article.image) // Format image URL
            })),
            current_page: parseInt(page, 10),
            total_page: Math.ceil(totalNews / pageSize),
            total: totalNews
        });

    },

    getNewsArticleById: async (req, res) => {
        const { id } = req.params;
        const newsArticle = await db.News.findByPk(id);

        if (!newsArticle) {
            // Nếu không tìm thấy danh mục với ID đã cho, trả về lỗi 404
            return res.status(404).json({
                message: 'News not found'
            });
        }
        return res.status(200).json({
            message: 'Get a news successfully',
            data: {
                ...newsArticle.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(newsArticle.image) // Format image URL
            }
        });

    },
    insertNewsArticle: async (req, res) => {
        // Start a transaction
        const transaction = await db.sequelize.transaction();

        try {
            // Create the news article within the transaction
            const newsArticle = await db.News.create(req.body, { transaction });

            // Validate product IDs if provided
            const productIds = req.body.product_ids;
            if (productIds && productIds.length) {
                // Fetch all products that match the given IDs
                const validProducts = await db.Product.findAll({
                    where: {
                        id: productIds
                    },
                    transaction
                });

                // Extract valid IDs from the validProducts
                const validProductIds = validProducts.map(product => product.id);

                // Filter out any invalid IDs from the request
                const filteredProductIds = productIds.filter(id => validProductIds.includes(id));

                // Create NewsDetail entries only for valid product IDs
                const newsDetailPromises = filteredProductIds.map(productId => {
                    return db.NewsDetail.create({
                        news_id: newsArticle.id,
                        product_id: productId
                    }, { transaction });
                });

                // Wait for all the NewsDetail entries to be created
                await Promise.all(newsDetailPromises);
            }

            // Commit the transaction
            await transaction.commit();

            res.status(201).json({
                message: 'New article added successfully!',
                data: {
                    ...newsArticle.get({ plain: true }), // Chuyển Sequelize instance thành đối tượng thuần
                    image: getAvatarURL(newsArticle.image) // Định dạng URL của ảnh
                }
            });

        } catch (error) {
            // Rollback the transaction in case of an error
            await transaction.rollback();
            res.status(500).json({
                message: "Unable to add a new article",
                error: error.message
            });
        }
    },
    updateNewsArticle: async (req, res) => {
        const { id } = req.params;
        const { title } = req.body;
        // Check if another article exists with the same title but a different ID
        const existingArticle = await db.News.findOne({
            where: {
                title: title,
                id: { [db.Sequelize.Op.ne]: id } // Exclude the current article from check
            }
        });

        if (existingArticle) {
            return res.status(400).json({
                message: 'An article with this title already exists. Please choose a different title.'
            });
        }
        const updateNewsArticle = await db.News.update(req.body, {
            where: { id }
        });

        return res.status(200).json({
            message: 'News updated successfully',
        });
    },
    deleteNewsArticle: async (req, res) => {
        const { id } = req.params;
        const transaction = await db.sequelize.transaction(); // Start a transaction

        try {
            // First, delete any associated news details
            await db.NewsDetail.destroy({
                where: { news_id: id },
                transaction: transaction // Use the transaction
            });

            // Then, delete the news article itself
            const deleted = await db.News.destroy({
                where: { id },
                transaction: transaction // Use the transaction
            });

            if (deleted) {
                await transaction.commit(); // Commit if everything is okay
                return res.status(200).json({
                    message: 'News article deleted successfully'
                });
            } else {
                await transaction.rollback(); // Rollback if article not found
                return res.status(404).json({
                    message: 'News article not found'
                });
            }
        } catch (error) {
            await transaction.rollback(); // Rollback if any error occurs
            return res.status(500).json({
                message: 'An error occurred while deleting the news article',
                error: error.message
            });
        }

    },
}