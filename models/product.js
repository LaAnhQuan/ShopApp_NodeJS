'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand',
      })
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
      })
      Product.hasMany(models.BannerDetail, {
        foreignKey: 'product_id'
      })
      // Product.hasMany(models.OrderDetail, {
      //   foreignKey: 'product_id',
      // })
      Product.hasMany(models.Feedback, {
        foreignKey: 'product_id',
      })
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'product_images' // Thêm bí danh 'as' để sử dụng trong truy vấn
      })
      Product.hasMany(models.CartItem, {
        foreignKey: 'product_id',
        // as: 'cart_items' // Thêm bí danh 'as' để sử dụng trong truy vấn
      })
      Product.hasMany(models.ProductAttributeValue, {
        foreignKey: 'product_id',
        as: 'product_attribute_values' // Thêm bí danh 'as' để sử dụng trong truy vấn
      })
      Product.hasMany(models.ProductVariantValue, {
        foreignKey: 'product_id',
        as: 'product_variant_values' // Thêm bí danh 'as' để sử dụng trong truy vấn
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    oldprice: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    description: DataTypes.TEXT,
    stock: DataTypes.TEXT,
    specification: DataTypes.TEXT,
    total_sold: DataTypes.INTEGER,
    buyturn: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    rating: DataTypes.DECIMAL(2, 1),
    total_ratings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Product;
};


