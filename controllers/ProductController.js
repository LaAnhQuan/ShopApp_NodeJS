import { Sequelize, where } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest"
import { date } from "joi"
import { getAvatarURL } from "../helpers/imageHelper";
import attribute from "../models/attribute";


module.exports = {
    getProducts: async (req, res) => {
        // const { search = '', page = 1 } = req.query;
        // const pageSize = 5;
        // const offset = (page - 1) * pageSize;

        const { search = '', page, pageSize } = req.query;

        // Nếu không truyền page hoặc pageSize thì sẽ không phân trang
        const isPaginationEnabled = page && pageSize;

        const limit = isPaginationEnabled ? parseInt(pageSize) : undefined;
        const offset = isPaginationEnabled ? (parseInt(page) - 1) * parseInt(pageSize) : undefined;


        let whereClause = {};
        let attributeWhereClause = {};

        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { specification: { [Op.like]: `%${search}%` } }
                ]
            };

            attributeWhereClause = {
                value: { [Op.like]: `%${search}%` }
            };
        }

        // // Tìm tổng số sản phẩm thỏa điều kiện, bao gồm cả tìm theo attribute
        // const [products, totalProducts] = await Promise.all([
        //     db.Product.findAll({
        //         where: whereClause,
        //         include: [{
        //             model: db.ProductAttributeValue,
        //             as: 'product_attribute_values',
        //             include: [{ model: db.Attribute, as: 'attribute' }],
        //             where: attributeWhereClause,
        //             required: false
        //         }],
        //         limit: pageSize,
        //         offset,
        //         // order: [['created_at', 'DESC']]
        //     }),
        //     db.Product.count({ where: whereClause })
        // ]);



        const productQuery = {
            where: whereClause,
            include: [{
                model: db.ProductAttributeValue,
                as: 'product_attribute_values',
                include: [{ model: db.Attribute, as: 'attribute' }],
                where: attributeWhereClause,
                required: false
            }]
        };

        if (isPaginationEnabled) {
            productQuery.limit = limit;
            productQuery.offset = offset;
        }

        const [products, totalProducts] = await Promise.all([
            db.Product.findAll(productQuery),
            db.Product.count({ where: whereClause })
        ]);

        return res.status(200).json({
            message: 'Get list product successfully',
            data: products.map(product => ({
                ...product.get({ plain: true }),
                // image: getAvatarURL(product.image),
                // attributes: product.product_attribute_values.map(attr => ({
                //     name: attr.attribute?.name || null,
                //     value: attr.value
                // }))
            })),
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalProducts / pageSize),
            total: totalProducts
        });
    },



    getProductById: async (req, res) => {
        const { id } = req.params;  // Lấy id từ params trong URL
        const product = await db.Product.findByPk(id, {
            include: [
                {
                    model: db.ProductImage,
                    as: 'product_images',
                    attributes: ['id', 'image_url'],
                },
                {
                    model: db.ProductAttributeValue, //Bao gồm thuocj tính động
                    as: 'product_attribute_values',
                    include: [
                        {
                            model: db.Attribute,
                            as: 'attribute', //Bao gồm tên của thuộc tính từ bảng Attribute
                            attributes: ['id', 'name'] // Lấy tên thuocj tính 
                        }
                    ]
                },
                {
                    model: db.ProductVariantValue,
                    as: 'product_variant_values',
                    attributes: ['id', 'price', 'old_price', 'stock', 'sku'],
                }
            ]

        });


        if (product) {
            // Lấy danh sách variant_values từ các sku trong product_variant_values
            const variantValuesData = [];
            for (const variant of product.product_variant_values) {
                const variantValueIds = variant.sku.split('-').map(Number);
                const variantValues = await db.VariantValue.findAll({
                    where: { id: variantValueIds },
                    include: [
                        {
                            model: db.Variant,
                            as: 'variants',
                            attributes: ['id', 'name'],
                        }
                    ]
                });

                // Gắn variant_values chi tiết vào biến thể hiện tại
                variantValuesData.push({
                    id: variant.id,
                    price: variant.price,
                    old_price: variant.old_price,
                    stock: variant.stock,
                    sku: variant.sku,
                    values: variantValues.map(value => ({
                        id: value.id,
                        name: value.variants?.name || null,
                        value: value.value,
                        image: value.image || null,
                    }))
                })
            }
            // Xử lý dữ liệu để trả về phản hồi
            const productData = {
                id: product.id,
                name: product.name,
                price: product.price,
                oldprice: product.oldprice,
                description: product.description,
                rating: product.rating,
                total_ratings: product.total_ratings,
                total_sold: product.total_sold,
                brand_id: product.brand_id,
                category_id: product.category_id,
                image: product.image,
                created_at: product.create_at,
                updated_at: product.updated_at
            }
            return res.status(200).json({
                message: 'Product found successfully',
                data: {
                    ...productData, // Dùng lại object đã chuẩn bị

                    image: product.image,
                    product_images: product.product_images?.map(img => img.image_url) || [],

                    attributes: product.product_attribute_values.map(attrVal => ({
                        id: attrVal.id,
                        name: attrVal.attribute?.name || null,
                        value: attrVal.value
                    })),

                    variants: variantValuesData
                }

            });

        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    },

    insertProduct: async (req, res) => {
        const { name, attributes = [], variants = [], variant_values = [], ...productData } = req.body;

        // Check if category_id and brand_id exist
        const { category_id, brand_id } = productData;
        const categoryExists = await db.Category.findByPk(category_id);
        if (!categoryExists) {
            return res.status(400).json({
                message: `Category ID ${category_id} does not exist, please check again.`
            });
        }

        const brandExists = await db.Brand.findByPk(brand_id);
        if (!brandExists) {
            return res.status(400).json({
                message: `Brand ID ${brand_id} does not exist, please check again.`,
            });
        }

        // Start a transaction
        const transaction = await db.sequelize.transaction();

        // Check if a product with the same name already exists
        const productExists = await db.Product.findOne({
            where: { name },
        });

        if (productExists) {
            return res.status(400).json({
                message: 'Product name already exists, please choose a different name.',
                data: productExists,
            });
        }
        // Create new product
        const product = await db.Product.create(
            { ...productData, name },
            { transaction }
        );

        // Xử lý các thuộc tính động
        const createdAttributes = [];
        for (const attributeData of attributes) {
            // Tìm hoặc tạo mới thuộc tính
            const [attribute] = await db.Attribute.findOrCreate({
                where: { name: attributeData.name },
                transaction, // Use transaction
            });

            // Thêm giá trị thuộc tính vào bảng product_attribute_values
            await db.ProductAttributeValue.create(
                {
                    product_id: product.id,
                    attribute_id: attribute.id,
                    value: attributeData.value,
                },
                { transaction } // Use transaction
            )
            // Lưu trữ thông tin thuộc tính để trả về
            createdAttributes.push({
                name: attribute.name,
                value: attributeData.value
            })
        }

        // Xử lý các biến thể (variants)
        for (const variant of variants) {
            const [variantEntry] = await db.Variant.findOrCreate({
                where: { name: variant.name },
                transaction
            });
            for (const value of variant.values) {
                await db.VariantValue.findOrCreate({
                    where: { value, variant_id: variantEntry.id },
                    transaction
                })
            }
        }
        // Xử lý các giá trị biến thể {variant_values}
        const createdVariantValues = [];
        for (const variantData of variant_values) {
            const variantValueIds = [];
            for (const value of variantData.variant_combination) {
                const variantValue = await db.VariantValue.findOne({
                    where: { value },
                    transaction,
                });

                if (variantValue) {
                    variantValueIds.push(variantValue.id);
                }
            }

            // Tạo mã SKU theo nguyên tắc "id1-id2-id3-..."
            const sku = variantValueIds.sort((a, b) => a - b).join('-')
            // Thêm biến thể vào bảng product_variant_values
            const createdVariant = await db.ProductVariantValue.create(
                {
                    product_id: product.id,
                    price: variantData.price,
                    old_price: variantData.old_price || null,
                    stock: variantData.stock || 0,
                    sku,
                },
                { transaction } // Sử dụng transaction
            );

            createdVariantValues.push({
                sku,
                price: createdVariant.price,
                old_price: createdVariant.old_price,
                stock: createdVariant.stock,
            })
        }

        //Commit transaction
        await transaction.commit();

        // Trả về thông tin sản phẩm kèm theo các biển thể
        return res.status(200).json({
            message: "Insert product is successful",
            data: {
                ...product.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(product.image), // Apply getAvatarURL function to image field
                attributes: createdAttributes,
                variants: variants.map(variant => ({
                    name: variant.name,
                    values: variant.values
                })),
                variant_values: createdVariantValues
            }
        })
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;
        const transaction = await db.sequelize.transaction();

        const orderDetailExists = await db.OrderDetail.findOne({
            where: { product_id: id },
            include: [{
                model: db.Order,
                as: 'order',
                attributes: ['id', 'status', 'note', 'total', 'created_at']
            }],
            transaction
        });

        if (orderDetailExists) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Cannot delete the product because it is referenced by an existing order.',
                data: { order: orderDetailExists.order }
            });
        }

        await db.ProductAttributeValue.destroy({
            where: { product_id: id },
            transaction
        });

        await db.ProductVariantValue.destroy({
            where: { product_id: id },
            transaction
        });

        const deleted = await db.Product.destroy({
            where: { id },
            transaction
        });

        if (deleted) {
            await transaction.commit();
            return res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            await transaction.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }
    },

    updatedProduct: async (req, res) => {
        const { id } = req.params;
        const { attributes = [], variants = [], variant_values = [], ...productData } = req.body;

        const transaction = await db.sequelize.transaction();

        const [updatedCount] = await db.Product.update(productData, { where: { id }, transaction });

        if (updatedCount === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        for (const attr of attributes) {
            const [attribute] = await db.Attribute.findOrCreate({
                where: { name: attr.name },
                transaction
            });

            const productAttributeValue = await db.ProductAttributeValue.findOne({
                where: { product_id: id, attribute_id: attribute.id },
                transaction
            });

            if (productAttributeValue) {
                await productAttributeValue.update({ value: attr.value }, { transaction });
            } else {
                await db.ProductAttributeValue.create({
                    product_id: id,
                    attribute_id: attribute.id,
                    value: attr.value
                }, { transaction });
            }
        }

        for (const variant of variants) {
            const [variantEntry] = await db.Variant.findOrCreate({
                where: { name: variant.name },
                transaction
            });

            for (const value of variant.values) {
                await db.VariantValue.findOrCreate({
                    where: { value, variant_id: variantEntry.id },
                    transaction
                });
            }
        }

        for (const variantData of variant_values) {
            const variantValueIds = [];

            for (const value of variantData.variant_combination) {
                const variantValue = await db.VariantValue.findOne({
                    where: { value },
                    transaction
                });

                if (variantValue) {
                    variantValueIds.push(variantValue.id);
                }
            }

            const sku = variantValueIds.sort((a, b) => a - b).join('-');

            const existingVariant = await db.ProductVariantValue.findOne({
                where: { product_id: id, sku },
                transaction
            });

            if (existingVariant) {
                await existingVariant.update({
                    price: variantData.price,
                    old_price: variantData.old_price || null,
                    stock: variantData.stock || 0
                }, { transaction });
            } else {
                await db.ProductVariantValue.create({
                    product_id: id,
                    price: variantData.price,
                    old_price: variantData.old_price || null,
                    stock: variantData.stock || 0,
                    sku,
                }, { transaction });
            }
        }

        await transaction.commit();
        return res.status(200).json({ message: 'Product updated successfully' });
    },

}
