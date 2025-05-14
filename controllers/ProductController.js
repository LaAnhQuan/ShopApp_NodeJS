import { Sequelize, where } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest"
import { date } from "joi"
import { getAvatarURL } from "../helpers/imageHelper";


module.exports = {
    getProducts: async (req, res) => {
        // const products = await db.Product.findAll() //not good, must "paging"
        //search and paging 
        //req.query.search, eg: ...?search=iphone16&page=1
        //name, description, or description, or specification contains "search" 
        const { search = '', page = 1 } = req.query; // Default to an empty search
        const pageSize = 5; // Define the number of items per page
        const offset = (page - 1) * pageSize;
        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { specification: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        let attributeWhereClause = {}
        if (search.trim() !== '') {
            attributeWhereClause = {
                value: { [Op.like]: `%${search}%` }
            };
        }
        const [products, totalProducts] = await Promise.all([
            db.Product.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.ProductAttributeValue,
                        as: 'attributes',
                        include: [{ model: db.Attribute }],
                        where: attributeWhereClause,
                        required: false // Không bắt buộc sản phẩm nào cũng có thuộc tính
                    }
                ],
                limit: pageSize,
                offset: offset,
                // Có thể thêm `order` nếu cần sắp xếp
            }),
            db.Product.count({
                where: whereClause
            })
        ]);
        return res.status(200).json({
            message: 'Lấy danh sách sản phẩm thành công',
            data: products.map(product => ({
                ...product.get({ plain: true }), // Chuyển đổi Sequelize instance thành plain object
                image: getAvatarURL(product.image), // Áp dụng hàm getAvatarURL cho trường image
                attributes: product.attributes.map(attr => ({
                    name: attr.Attribute.name,
                    value: attr.value
                }))
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
                    model: db.ProductImage, // Su dung ten model dung dinh nghia trong associations
                    as: 'product_images' // Đảm bảo rằng đã khai báo 'as' trong mối quan hệ associations nếu có 
                },
                {
                    model: db.ProductAttributeValue, //Bao gồm thuocj tính động
                    as: 'attributes',
                    include: [
                        {
                            model: db.Attribute, //Bao gồm tên của thuộc tính từ bảng Attribute
                            attributes: ['name'] // Lấy tên thuocj tính 
                        }
                    ]
                }
            ]

        });

        if (product) {
            res.status(200).json({
                message: 'Product found successfully',
                data: {
                    ...product.get({ plain: true }), // Chuyển đổi Sequelize instance thành plain object.
                    image: getAvatarURL(product.image),
                    product_images: product.product_images.map(img => getAvatarURL(img.image_url)),
                    attributes: product.attributes.map(attr => ({
                        name: attr.Attribute.name,// Truy cập thuộc tính `name` từ bảng Attribute (quan hệ giữa Product và Attribute thông qua ProductAttributeValue)
                        value: attr.value // Lấy giá trị thuộc tính từ bảng ProductAttributeValue (ví dụ: "6GB", "512GB", v.v...)
                    }))
                }

            });

        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    },

    insertProduct: async (req, res) => {
        //Tach attributes khỏi phần tử attributes từ req.body 
        //và tách phần dữ liệu sản phẩm còn lại (productData) để lưu vào bảng products;

        const { name, attributes = [], ...productData } = req.body;
        // Kiueerm tra xem tên sản phẩm đã tồn tại trong cơ sở dữ liệu hay chưa
        const productExists = await db.Product.findOne({
            where: { name }
        });

        if (productExists) {
            return res.status(400).json({
                message: 'Product name already exists, please choose another one',
                data: productExists
            });
        }
        // Tạo các sản phẩm mới trong bảng products
        const product = await db.Product.create({ ...productData, name });

        // Xử lý các thuộc tính động
        for (const attributeData of attributes) {
            // Create a new attribute in the attributes table (if not exists)
            const [attribute] = await db.Attribute.findOrCreate({
                where: { name: attributeData.name }
            });
            // Add attribute value to the product_attribute_values table
            await db.ProductAttributeValue.create({
                product_id: product.id,
                attribute_id: attribute.id,
                value: attributeData.value
            });
        }

        // Return product information along with dynamic attributes
        return res.status(201).json({
            message: 'Product added successfully',
            data: {
                ...product.get({ plain: true }), // Convert Sequelize instance to plain object
                image: getAvatarURL(product.image), // Apply getAvatarURL function to image field
                attributes: attributes.map(attr => ({
                    name: attr.name,
                    value: attr.value
                }))
            }
        });



    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;
        const orderDetailExists = await db.OrderDetail.findOne({
            where: { product_id: id },
            include: [{
                model: db.Order, // Bao gồm thông tin từ bảng `Order`
                as: 'order',     // Đảm bảo alias hợp lý nếu đã đặt alias trong associations
                attributes: ['id', 'status', 'note', 'total', 'created_at'] // Chọn các trường cần thiết từ Order
            }]
        });

        // Nếu có OrderDetail tham chiếu đến sản phẩm, không cho phép xóa và trả về thông tin đơn hàng
        if (orderDetailExists) {
            return res.status(400).json({
                message: 'Cannot delete the product because it is referenced by an existing order.',
                data: {
                    order: orderDetailExists.order
                }
            });
        }
        // Xóa các bản ghi trong bảng 'product_attribute_values' liên quan đến sản phẩm
        await db.ProductAttributeValue.destroy({
            where: { product_id: id }
        })
        // Xóa sản phẩm khỏi bảng `products`
        const deleted = await db.Product.destroy({
            where: { id }
        });

        if (deleted) {
            return res.status(200).json({
                message: 'Product deleted successfully'
            });
        } else {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

    },

    updatedProduct: async (req, res) => {
        const { id } = req.params;
        const { attributes = [], ...productData } = req.body;

        // Cập nhật thông tin cơ bản của sản phẩm trong bảng `products`
        const [updatedRowCount] = await db.Product.update(productData, {
            where: { id }
        });

        if (updatedRowCount > 0) {
            // Nếu cập nhật thành công, tiến hành cập nhật thuộc tính động
            for (const attr of attributes) {
                // Tìm hoặc tạo thuộc tính trong bảng `attributes`
                const [attribute] = await db.Attribute.findOrCreate({
                    where: { name: attr.name }
                });

                // Tìm xem thuộc tính đã tồn tại cho sản phẩm chưa
                const productAttributeValue = await db.ProductAttributeValue.findOne({
                    where: {
                        product_id: id,
                        attribute_id: attribute.id
                    }
                });

                if (productAttributeValue) {
                    // Nếu thuộc tính đã tồn tại, cập nhật giá trị
                    await productAttributeValue.update({ value: attr.value });
                } else {
                    // Nếu chưa tồn tại, thêm mới thuộc tính và giá trị vào bảng `product_attribute_values`
                    await db.ProductAttributeValue.create({
                        product_id: id,
                        attribute_id: attribute.id,
                        value: attr.value
                    });
                }
            }

            return res.status(200).json({
                message: 'Product updated successfully'
            });
        } else {
            // Nếu không tìm thấy sản phẩm cần cập nhật
            return res.status(404).json({
                message: 'Product not found'
            });
        }
    }
}
