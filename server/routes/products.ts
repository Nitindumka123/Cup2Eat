import { Router } from 'express';
import { getProducts, getProductBySlug } from '../db';

export const productsRouter = Router();

// GET /api/products - Get all active products
productsRouter.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products from database.',
    });
  }
});

// GET /api/products/:slug - Get single product by slug
productsRouter.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with slug '${slug}' not found.`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error(`❌ Error fetching product ${req.params.slug}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product details.',
    });
  }
});
