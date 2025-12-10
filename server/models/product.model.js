import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a product name'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  imageUrl: { 
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  category: { 
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  description: { 
    type: String,
    default: ''
  },
  stock: { 
    type: Number, 
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  image: {
    type: String,
    default: '📦'
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
