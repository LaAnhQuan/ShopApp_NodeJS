import { Sequelize, where } from "sequelize";
const { Op } = Sequelize;
import db from "../models";
import { getAvatarURL } from "../helpers/imageHelper";

module.exports = {
    getBannerDetails: async (req, res) => {

        const bannerDetails = await db.BannerDetail.findAll();
        return res.status(200).json({
            message: 'Get banner details successfully',
            data: bannerDetails
        });
    },

    getBannerDetailById: async (req, res) => {
        const { id } = req.params;

        const bannerDetail = await db.BannerDetail.findByPk(id);

        if (!bannerDetail) {
            return res.status(404).json({ message: 'Banner detail not found' });
        }

        return res.status(200).json({
            message: 'Get a banner detail successfully',
            data: bannerDetail
        });
    },

    insertBannerDetail: async (req, res) => {
        const { banner_id, product_id } = req.body;

        // Check if product_id exists in db.Product
        const productExists = await db.Product.findByPk(product_id);
        if (!productExists) {
            return res.status(404).json({
                message: "Product not found."
            })
        }

        // Check if banner_id exists in db.Banner
        const bannerExists = await db.Banner.findByPk(banner_id);
        if (!bannerExists) {
            return res.status(404).json({
                message: "Banner not found."
            });
        }

        // check for duplicate product_id and banner_id in db.BannerDetail

        const duplicateExists = await db.BannerDetail.findOne({
            where: { product_id, banner_id }
        })

        if (duplicateExists) {
            return res.status(409).json({
                message: "Banner Detail is already exists"
            })
        }
        const banner = await db.Banner.findByPk(banner_id);
        const product = await db.Product.findByPk(product_id);

        if (!banner || !product) {
            return res.status(400).json({
                message: 'Invalid banner_id or product_id'
            });
        }

        const bannerDetail = await db.BannerDetail.create({ banner_id, product_id });

        return res.status(201).json({
            message: 'Banner detail added successfully!',
            data: bannerDetail
        });
    },
    updateBannerDetail: async (req, res) => {
        const { id } = req.params;
        const { product_id, banner_id } = req.body;

        // Check if product_id exists in db.Product
        const productExists = await db.Product.findByPk(product_id);
        if (!productExists) {
            return res.status(404).json({
                message: "Product not found."
            })
        }

        // Check if banner_id exists in db.Banner
        const bannerExists = await db.Banner.findByPk(banner_id);
        if (!bannerExists) {
            return res.status(404).json({
                message: "Banner not found."
            });
        }

        // check if there's another record with the same product_id and banner_id

        const existingBannerDetail = await db.BannerDetail.findOne({
            where: {
                product_id,
                banner_id,
                id: { [db.Sequelize.Op.ne]: id } // Exclude the current record

            }
        })

        if (existingBannerDetail) {
            return res.status(409).json({
                message: "A banner detail with this product and banner already exists."
            })
        }

        const [updated] = await db.BannerDetail.update(
            {
                product_id,
                banner_id
            },
            {
                where: { id }
            }
        );

        if (updated) {
            return res.status(200).json({
                message: 'Banner detail updated successfully'
            });
        } else {
            res.status(404).json({
                message: "Banner detail not found or nothing to update."
            })
        }


    },

    deleteBannerDetail: async (req, res) => {
        const { id } = req.params;

        const deleted = await db.BannerDetail.destroy({
            where: { id }
        });

        if (deleted) {
            return res.status(200).json({
                message: 'Banner detail deleted successfully'
            });
        } else {
            return res.status(404).json({
                message: 'Banner detail not found'
            });
        }
    }
}
