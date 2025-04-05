import express from 'express';
import * as ProductController from './controllers/ProductController'

const router = express.Router()

router.get('/products', ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', ProductController.insertProduct);
router.put('/products', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);


module.exports = router;