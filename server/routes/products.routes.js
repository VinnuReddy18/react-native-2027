import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// GET /api/products - Get all products (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { q, category, limit = 100 } = req.query;
    const filter = {};
    
    // Search by name (case-insensitive)
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    const products = await Product.find(filter).limit(parseInt(limit));
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock, image } = req.body;
    
    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, and category'
      });
    }
    
    const product = new Product({ 
      name, 
      price, 
      imageUrl, 
      category, 
      description, 
      stock,
      image 
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// PUT /api/products/:id - Update a product (bonus)
router.put('/:id', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock, image } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, imageUrl, category, description, stock, image },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.status(400).json({ 
      success: false,
      message: 'Error updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// DELETE /api/products/:id - Delete a product (bonus)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

export default router;
