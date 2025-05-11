import { Model, Sequelize, where } from "sequelize"
const { Op } = Sequelize
import db from "../models"
import { BannerStatus } from "../constants"

module.exports = {
    getBanners: async (req, res) => {
        const { search = '', page = 1 } = req.query;
        const pageSize = 5;
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                name: { [Op.like]: `%${search}%` }
            };
        }

        const [banners, totalBanners] = await Promise.all([
            db.Banner.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
            }),
            db.Banner.count({
                where: whereClause
            })
        ]);

        return res.status(200).json({
            message: 'Get banners successfully',
            data: banners,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalBanners / pageSize),
            totalBanners
        });
    },
    getBannerById: async (req, res) => {
        const { id } = req.params;
        const banner = await db.Banner.findByPk(id);

        if (!banner) {
            return res.status(404).json({
                message: 'Banner not found'
            });
        }

        return res.status(200).json({
            message: 'Get a banner successfully',
            data: banner
        });
    },


    insertBanner: async (req, res) => {
        const { name } = req.body;
        //Check for a duplicate banner name in the database
        const existingBanner = await db.Banner.findOne(
            {
                where: {
                    name: name.trim()
                }
            }
        );
        if (existingBanner) {
            return res.status(409).json({
                message: "Banner name already exists, please choose a different name"
            })
        }

        const bannerData = {
            ...req.body,
            status: BannerStatus.ACTIVE
        }

        // If no duplicates, create the new banner
        const banner = await db.Banner.create(bannerData);
        return res.status(201).json({
            message: 'Banner added successfully!',
            data: banner
        });
    },

    updateBanner: async (req, res) => {
        const { id } = req.params;
        const existingBanner = await db.Banner.findOne({
            where: {
                name: req.body.name,
                id: { [db.Sequelize.Op.ne]: id } // Exclude the current record

            }
        })

        if (existingBanner) {
            return res.status(409).json({
                message: "A banner already exists."
            })
        }

        const updated = await db.Banner.update(req.body, {
            where: { id }
        });

        return res.status(200).json({
            message: 'Banner updated successfully',
        });
    },

    deleteBanner: async (req, res) => {
        const { id } = req.params;

        try {
            const deleted = await db.Banner.destroy({
                where: { id }
            });

            if (deleted) {
                return res.status(200).json({
                    message: 'Banner deleted successfully'
                });
            } else {
                return res.status(404).json({
                    message: 'Banner not found'
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'An error occurred while deleting the banner',
                error: error.message
            });
        }
    }

}
