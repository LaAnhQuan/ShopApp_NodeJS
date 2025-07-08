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
import * as GoogleController from './controllers/social/GoogleController'
import * as AuthController from './controllers/AuthController'

import asyncHandler from './middlewares/asyncHandler'
import validateImageExists from './middlewares/validateImageExists'
import validate from './middlewares/validate'

import InsertProductRequest from './dtos/requests/product/InsertProductRequest'
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest'
import InsertOrderRequest from './dtos/requests/order/InsertOrderRequest'
import UpdateOrderRequest from './dtos/requests/order/UpdateOrderRequest'
import InsertUserRequest from './dtos/requests/user/InsertUserRequest'
import LoginUserRequest from './dtos/requests/user/LoginUserRequest'
import InsertNewsRequest from './dtos/requests/news/InsertNewsRequest'
import InsertNewsDetailRequest from './dtos/requests/newsdetail/InsertNewsDetailRequest'
import UpdateNewsRequest from './dtos/requests/news/UpdateNewsRequest'
import InsertBannerRequest from './dtos/requests/banner/InsertBannerRequest'
import InsertBannerDetailRequest from './dtos/requests/banner-detail/InsertBannerDetailRequest'
import InsertProductImageRequest from './dtos/requests/product_images/InsertProductImageRequest'
import uploadImageMiddleware from './middlewares/imageUpload'
import InsertCartItemRequest from './dtos/requests/cart_item/InsertCartItemRequest'
import InsertCartRequest from './dtos/requests/cart/InsertCartRequest'

import { requireRoles } from './middlewares/jwtMiddleware'
import { UserRole } from './constants'
import delayMiddleware from './middlewares/delayMiddleware'
const router = express.Router()

// Auth Routes
router.post('/auth/login', asyncHandler(AuthController.login));
router.post('/auth/verify-otp', asyncHandler(AuthController.verifyOTP));
router.post('/auth/register', asyncHandler(AuthController.register));
router.post('/auth/resend-otp', asyncHandler(AuthController.resendOTP));


// User Routes
router.post('/users/register',
    asyncHandler(UserController.registerUser))
router.post('/users/login',
    delayMiddleware,
    validate(LoginUserRequest),
    asyncHandler(UserController.login))
router.post('/users/me/:id',
    requireRoles([UserRole.User, UserRole.Admin]),
    asyncHandler(UserController.getUserById))
router.post('/users/:id',
    requireRoles([UserRole.User, UserRole.Admin]),
    asyncHandler(UserController.updateUser))

router.put('/users/:id/profile',
    requireRoles([UserRole.User, UserRole.Admin]),
    asyncHandler(UserController.updateProfile));
router.put('/users/:id/password',
    requireRoles([UserRole.User, UserRole.Admin]),
    asyncHandler(UserController.changePassword));

router.get('/users',
    delayMiddleware,
    requireRoles([UserRole.User, UserRole.Admin]),
    asyncHandler(UserController.fetchUser))
// Product Routes
router.get('/products',
    delayMiddleware,
    asyncHandler(ProductController.getProducts))
router.get('/products/:id',
    delayMiddleware,
    asyncHandler(ProductController.getProductById))
router.post('/products',
    requireRoles([UserRole.Admin]),
    validateImageExists,
    validate(InsertProductRequest),
    asyncHandler(ProductController.insertProduct)
)
router.put('/products/:id',
    requireRoles([UserRole.Admin]),
    validateImageExists,
    validate(UpdateProductRequest),
    asyncHandler(ProductController.updatedProduct))
router.delete('/products/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(ProductController.deleteProduct))

router.get('/products/category/:category_id',
    asyncHandler(ProductController.getProductByCategory_id)
)

// ProductImage Routes
router.get('/product-images', asyncHandler(ProductImageController.getProductImages));
router.get('/product-images/:id', asyncHandler(ProductImageController.getProductImageById));
router.post('/product-images',
    requireRoles([UserRole.Admin]),
    validate(InsertProductImageRequest),
    asyncHandler(ProductImageController.insertProductImage));
router.delete('/product-images/:id', asyncHandler(ProductImageController.deleteProductImage));


// Category Routes
router.get('/categories', asyncHandler(CategoryController.getCategories))
router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById))
router.post('/categories',
    requireRoles([UserRole.Admin]),
    validateImageExists,
    asyncHandler(CategoryController.insertCategory))
router.put('/categories/:id',
    requireRoles([UserRole.Admin]),
    validateImageExists,
    asyncHandler(CategoryController.updateCategory))
router.delete('/categories/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(CategoryController.deleteCategory))
router.get('/product/categories', asyncHandler(CategoryController.getProductByNameCategory))

// Brand Routes
router.get('/brands', asyncHandler(BrandController.getBrands))
router.get('/brands/:id', asyncHandler(BrandController.getBrandById))
router.post('/brands',
    validateImageExists,
    asyncHandler(BrandController.insertBrand))
router.put('/brands/:id',
    requireRoles([UserRole.Admin]),
    validateImageExists,
    asyncHandler(BrandController.updateBrand))
router.delete('/brands/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(BrandController.deleteBrand))

// Order Routes
router.get('/orders', asyncHandler(OrderController.getOrders))
router.get('/orders/:id', asyncHandler(OrderController.getOrderById))
router.get('/orders/user/:user_id',
    asyncHandler(OrderController.getOrderByUserId))
/*
router.post('/orders',
    validate(InsertOrderRequest),
    asyncHandler(OrderController.insertOrder))
*/
router.post('/orders',
    asyncHandler(OrderController.buyNow)
)
router.put('/orders/:id',
    validate(UpdateOrderRequest),
    asyncHandler(OrderController.getOrderById))
router.delete('/orders/:id',
    requireRoles([UserRole.Admin, UserRole.User]),
    requireRoles([UserRole.Admin]),
    asyncHandler(OrderController.deleteOrder))

// OrderDetail Routes
router.get('/order-details', asyncHandler(OrderDetailController.getOrderDetails))
router.get('/order-details/:id', asyncHandler(OrderDetailController.getOrderDetailById))
router.get('/order-details/order/:order_id', asyncHandler(OrderDetailController.getOrderDetailByOrderId))
router.post('/order-details',
    requireRoles([UserRole.Admin]),
    asyncHandler(OrderDetailController.insertOrderDetail))
router.put('/order-details/:id', asyncHandler(OrderDetailController.updateOrderDetail))
router.delete('/order-details/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(OrderDetailController.deleteOrderDetail))

// Cart Routes
router.get('/carts', asyncHandler(CartController.getCarts));
router.get('/carts/:id', asyncHandler(CartController.getCartById));
router.post('/carts',
    requireRoles([UserRole.Admin, UserRole.User]),
    validate(InsertCartRequest),
    asyncHandler(CartController.insertCart));
router.post('/carts/checkout', asyncHandler(CartController.checkoutCart));
// router.put('/carts/:id', asyncHandler(CartController.updateCart));
router.delete('/carts/:id',
    requireRoles([UserRole.User]),
    asyncHandler(CartController.deleteCart));


// CartItem Routes
router.get('/cart-items', asyncHandler(CartItemController.getCartItems));
router.get('/cart-items/:id', asyncHandler(CartItemController.getCartItemById));
router.get('/cart-items/carts/:cart_id', asyncHandler(CartItemController.getCartItemsByCartId));
router.post('/cart-items',
    requireRoles([UserRole.User, UserRole.Admin]),
    validate(InsertCartItemRequest),
    asyncHandler(CartItemController.insertCartItem));
router.put('/cart-items/:id',
    requireRoles([UserRole.User]),
    asyncHandler(CartItemController.updateCartItem));
router.delete('/cart-items/:id',
    requireRoles([UserRole.User, UserRole.Admin]),
    asyncHandler(CartItemController.deleteCartItem));


// News Routes
router.post('/news',
    requireRoles([UserRole.Admin, UserRole.User]),
    validateImageExists,
    validate(InsertNewsRequest),
    asyncHandler(NewsController.insertNewsArticle))
router.get('/news/:id', asyncHandler(NewsController.getNewsArticleById))
router.put('/news/:id',
    requireRoles([UserRole.Admin, UserRole.User]),
    validateImageExists,
    asyncHandler(NewsController.updateNewsArticle))
router.get('/news', asyncHandler(NewsController.getNewsArticles))
router.delete('/news/:id', asyncHandler(NewsController.deleteNewsArticle))


// NewsDetail Routers
router.get('/news-details', asyncHandler(NewsDetailController.getNewsDetails))
router.get('/news-details/:id', asyncHandler(NewsDetailController.getNewsDetailById))
router.post('/news-details',
    requireRoles([UserRole.Admin, UserRole.User]),
    validate(InsertNewsDetailRequest),
    asyncHandler(NewsDetailController.insertNewsDetail))
router.put('/news-details/:id',
    requireRoles([UserRole.Admin, UserRole.User]),
    validate(UpdateNewsRequest),
    asyncHandler(NewsDetailController.updateNewsDetail))
router.delete('/news-details/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(NewsDetailController.deleteNewsDetail))

// Banner Routes
router.get('/banners', asyncHandler(BannerController.getBanners))
router.get('/banners/:id', asyncHandler(BannerController.getBannerById))
router.post('/banners',
    requireRoles([UserRole.Admin]),
    validate(InsertBannerRequest),
    validateImageExists,
    asyncHandler(BannerController.insertBanner))
router.put('/banners/:id',
    requireRoles([UserRole.Admin]),
    validateImageExists,
    asyncHandler(BannerController.updateBanner))
router.delete('/banners/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(BannerController.deleteBanner))

// BannerDetail Routes
router.get('/banner-details', asyncHandler(BannerDetailController.getBannerDetails))
router.get('/banner-details/:id', asyncHandler(BannerDetailController.getBannerDetailById))
router.post('/banner-details',
    requireRoles([UserRole.Admin]),
    validate(InsertBannerDetailRequest),
    asyncHandler(BannerDetailController.insertBannerDetail))
router.put('/banner-details/:id', asyncHandler(BannerDetailController.updateBannerDetail))
router.delete('/banner-details/:id',
    requireRoles([UserRole.Admin]),
    asyncHandler(BannerDetailController.deleteBannerDetail))

//Image Routes
router.post('/images/upload',
    requireRoles([UserRole.Admin, UserRole.User]),
    uploadImageMiddleware.array('images', 5), //max 5 photo
    asyncHandler(ImageController.uploadImages))
router.delete('/images/delete',
    requireRoles([UserRole.Admin, UserRole.User]),
    ImageController.deleteImage)
router.get('/images/:fileName', asyncHandler(ImageController.viewImage))
module.exports = router

//Social Routes
router.post('/auth/google', GoogleController.authenticateGoogle);

