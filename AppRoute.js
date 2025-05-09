import express from 'express'
import * as ProductController from './controllers/ProductController'
import * as CategoryController from './controllers/CategoryController'
import * as BrandController from './controllers/BrandController'
import * as OrderController from './controllers/OrderController'
import * as OrderDetailController from './controllers/OrderDetailController'
import * as UserController from './controllers/UserController'
import * as NewsController from './controllers/NewsController'
import * as NewsDetailController from './controllers/NewsDetailController'
import * as BannerController from './controllers/BannerController'
import * as BannerDetailController from './controllers/BannerDetailController'
import * as ImageController from './controllers/ImageController'
import * as ProductImageController from './controllers/ProductImageController'
import * as CartItemController from './controllers/CartItemController'
import * as CartController from './controllers/CartController'

import asyncHandler from './middlewares/asyncHandler'
import validateImageExists from './middlewares/validateImageExists'
import validate from './middlewares/validate'

import InsertProductRequest from './dtos/requests/product/InsertProductRequest'
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest'
import InsertOrderRequest from './dtos/requests/order/InsertOrderRequest'
import InsertUserRequest from './dtos/requests/user/InsertUserRequest'
import InsertNewsRequest from './dtos/requests/news/InsertNewsRequest'
import InsertNewsDetailRequest from './dtos/requests/newsdetail/InsertNewsDetailRequest'
import UpdateNewsRequest from './dtos/requests/news/UpdateNewsRequest'
import InsertBannerRequest from './dtos/requests/banner/InsertBannerRequest'
import InsertBannerDetailRequest from './dtos/requests/banner-detail/InsertBannerDetailRequest'
import InsertProductImageRequest from './dtos/requests/product_images/InsertProductImageRequest'
import uploadImageMiddleware from './middlewares/imageUpload'
import InsertCartItemRequest from './dtos/requests/cart_item/InsertCartItemRequest'
import InsertCartRequest from './dtos/requests/cart/InsertCartRequest'
const router = express.Router()


// User Routes
router.post('/users',
    validate(InsertUserRequest),
    asyncHandler(UserController.insertUser))
router.put('/users/:id', asyncHandler(UserController.updateUser))

// Product Routes
router.get('/products', asyncHandler(ProductController.getProducts))
router.get('/products/:id', asyncHandler(ProductController.getProductById))
router.post('/products',
    validateImageExists,
    validate(InsertProductRequest),
    asyncHandler(ProductController.insertProduct)
)
router.put('/products/:id',
    validateImageExists,
    validate(UpdateProductRequest),
    asyncHandler(ProductController.updateProduct))
router.delete('/products/:id', asyncHandler(ProductController.deleteProduct))

// ProductImage Routes
router.get('/product-images', asyncHandler(ProductImageController.getProductImages));
router.get('/product-images/:id', asyncHandler(ProductImageController.getProductImageById));
router.post('/product-images',
    validate(InsertProductImageRequest),
    asyncHandler(ProductImageController.insertProductImage));
router.delete('/product-images/:id', asyncHandler(ProductImageController.deleteProductImage));


// Category Routes
router.get('/categories', asyncHandler(CategoryController.getCategories))
router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById))
router.post('/categories',
    validateImageExists,
    asyncHandler(CategoryController.insertCategory))
router.put('/categories/:id',
    validateImageExists,
    asyncHandler(CategoryController.updateCategory))
router.delete('/categories/:id', asyncHandler(CategoryController.deleteCategory))

// Brand Routes
router.get('/brands', asyncHandler(BrandController.getBrands))
router.get('/brands/:id', asyncHandler(BrandController.getBrandById))
router.post('/brands',
    validateImageExists,
    asyncHandler(BrandController.insertBrand))
router.put('/brands/:id',
    validateImageExists,
    asyncHandler(BrandController.updateBrand))
router.delete('/brands/:id', asyncHandler(BrandController.deleteBrand))

// Order Routes
router.get('/orders', asyncHandler(OrderController.getOrders))
router.get('/orders/:id', asyncHandler(OrderController.getOrderById))
router.post('/orders',
    validate(InsertOrderRequest),
    asyncHandler(OrderController.insertOrder)
)
router.put('/orders/:id', asyncHandler(OrderController.updateOrder))
router.delete('/orders/:id', asyncHandler(OrderController.deleteOrder))

// OrderDetail Routes
router.get('/order-details', asyncHandler(OrderDetailController.getOrderDetails))
router.get('/order-details/:id', asyncHandler(OrderDetailController.getOrderDetailById))
router.post('/order-details', asyncHandler(OrderDetailController.insertOrderDetail))
router.put('/order-details/:id', asyncHandler(OrderDetailController.updateOrderDetail))
router.delete('/order-details/:id', asyncHandler(OrderDetailController.deleteOrderDetail))

// Cart Routes
router.get('/carts', asyncHandler(CartController.getCarts));
router.get('/carts/:id', asyncHandler(CartController.getCartById));
router.post('/carts',
    validate(InsertCartRequest),
    asyncHandler(CartController.insertCart));
router.post('/carts/checkout', asyncHandler(CartController.checkoutCart));
// router.put('/carts/:id', asyncHandler(CartController.updateCart));
router.delete('/carts/:id', asyncHandler(CartController.deleteCart));


// CartItem Routes
router.get('/cart-items', asyncHandler(CartItemController.getCartItems));
router.get('/cart-items/:id', asyncHandler(CartItemController.getCartItemById));
router.get('/cart-items/carts/:cart_id', asyncHandler(CartItemController.getCartItemsByCartId));
router.post('/cart-items',
    validate(InsertCartItemRequest),
    asyncHandler(CartItemController.insertCartItem));
router.put('/cart-items/:id', asyncHandler(CartItemController.updateCartItem));
router.delete('/cart-items/:id', asyncHandler(CartItemController.deleteCartItem));


// News Routes
router.post('/news',
    validateImageExists,
    validate(InsertNewsRequest),
    asyncHandler(NewsController.insertNewsArticle))
router.get('/news/:id', asyncHandler(NewsController.getNewsArticleById))
router.put('/news/:id',
    validateImageExists,
    asyncHandler(NewsController.updateNewsArticle))
router.get('/news', asyncHandler(NewsController.getNewsArticles))
router.delete('/news/:id', asyncHandler(NewsController.deleteNewsArticle))


// NewsDetail Routers
router.get('/news-details', asyncHandler(NewsDetailController.getNewsDetails))
router.get('/news-details/:id', asyncHandler(NewsDetailController.getNewsDetailById))
router.post('/news-details',
    validate(InsertNewsDetailRequest),
    asyncHandler(NewsDetailController.insertNewsDetail))
router.put('/news-details/:id',
    validate(UpdateNewsRequest),
    asyncHandler(NewsDetailController.updateNewsDetail))
router.delete('/news-details/:id', asyncHandler(NewsDetailController.deleteNewsDetail))

// Banner Routes
router.get('/banners', asyncHandler(BannerController.getBanners))
router.get('/banners/:id', asyncHandler(BannerController.getBannerById))
router.post('/banners',
    validate(InsertBannerRequest),
    validateImageExists,
    asyncHandler(BannerController.insertBanner))
router.put('/banners/:id',
    validateImageExists,
    asyncHandler(BannerController.updateBanner))
router.delete('/banners/:id', asyncHandler(BannerController.deleteBanner))

// BannerDetail Routes
router.get('/banner-details', asyncHandler(BannerDetailController.getBannerDetails))
router.get('/banner-details/:id', asyncHandler(BannerDetailController.getBannerDetailById))
router.post('/banner-details',
    validate(InsertBannerDetailRequest),
    asyncHandler(BannerDetailController.insertBannerDetail))
router.put('/banner-details/:id', asyncHandler(BannerDetailController.updateBannerDetail))
router.delete('/banner-details/:id', asyncHandler(BannerDetailController.deleteBannerDetail))


router.post('/images/upload',
    uploadImageMiddleware.array('images', 5), //max 5 photo
    asyncHandler(ImageController.uploadImages))
router.delete('/images/delete', ImageController.deleteImage)
router.get('/images/:fileName', asyncHandler(ImageController.viewImage))
module.exports = router
