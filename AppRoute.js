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
import asyncHandler from './middlewares/asyncHandler'
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
    validate(InsertProductRequest),
    asyncHandler(ProductController.insertProduct)
)
router.put('/products/:id',
    validate(UpdateProductRequest),
    asyncHandler(ProductController.updateProduct))
router.delete('/products/:id', asyncHandler(ProductController.deleteProduct))

// Category Routes
router.get('/categories', asyncHandler(CategoryController.getCategories))
router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById))
router.post('/categories', asyncHandler(CategoryController.insertCategory))
router.put('/categories/:id', asyncHandler(CategoryController.updateCategory))
router.delete('/categories/:id', asyncHandler(CategoryController.deleteCategory))

// Brand Routes
router.get('/brands', asyncHandler(BrandController.getBrands))
router.get('/brands/:id', asyncHandler(BrandController.getBrandById))
router.post('/brands', asyncHandler(BrandController.insertBrand))
router.put('/brands/:id', asyncHandler(BrandController.updateBrand))
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

// News Routes
router.post('/news',
    validate(InsertNewsRequest),
    asyncHandler(NewsController.insertNewsArticle))
router.get('/news/:id', asyncHandler(NewsController.getNewsArticleById))
router.put('/news/:id', asyncHandler(NewsController.updateNewsArticle))
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
    asyncHandler(BannerController.insertBanner))
router.put('/banners/:id', asyncHandler(BannerController.updateBanner))
router.delete('/banners/:id', asyncHandler(BannerController.deleteBanner))

// BannerDetail Routes
router.get('/banner-details', asyncHandler(BannerDetailController.getBannerDetails))
router.get('/banner-details/:id', asyncHandler(BannerDetailController.getBannerDetailById))
router.post('/banner-details',
    validate(InsertBannerDetailRequest),
    asyncHandler(BannerDetailController.insertBannerDetail))
router.put('/banner-details/:id', asyncHandler(BannerDetailController.updateBannerDetail))
router.delete('/banner-details/:id', asyncHandler(BannerDetailController.deleteBannerDetail))

module.exports = router
