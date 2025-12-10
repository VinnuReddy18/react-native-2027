import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/grocery_app';

const seedProducts = [
  { 
    name: 'Red Apple', 
    price: 40, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Fruits', 
    stock: 50, 
    description: 'Fresh red apples from Kashmir',
    image: '🍎'
  },
  { 
    name: 'Banana Bunch', 
    price: 30, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Fruits', 
    stock: 100,
    description: 'Ripe yellow bananas',
    image: '🍌'
  },
  { 
    name: 'Spinach Pack', 
    price: 20, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Vegetables', 
    stock: 70,
    description: 'Fresh green spinach',
    image: '🥬'
  },
  { 
    name: 'Tomatoes', 
    price: 49, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Vegetables', 
    stock: 150,
    description: 'Fresh red tomatoes',
    image: '🍅'
  },
  { 
    name: 'Milk 1L', 
    price: 50, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Dairy', 
    stock: 200,
    description: 'Fresh cow milk',
    image: '🥛'
  },
  { 
    name: 'Paneer 200g', 
    price: 120, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Dairy', 
    stock: 40,
    description: 'Fresh cottage cheese',
    image: '🧀'
  },
  { 
    name: 'Carrot kg', 
    price: 35, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Vegetables', 
    stock: 80,
    description: 'Fresh orange carrots',
    image: '🥕'
  },
  { 
    name: 'Orange kg', 
    price: 60, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Fruits', 
    stock: 90,
    description: 'Sweet and juicy oranges',
    image: '🍊'
  },
  { 
    name: 'Smartphone', 
    price: 15999, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Electronics', 
    stock: 25,
    description: 'Latest Android smartphone',
    image: '📱'
  },
  { 
    name: 'T-Shirt', 
    price: 499, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Clothes', 
    stock: 60,
    description: 'Cotton round neck t-shirt',
    image: '👕'
  },
  { 
    name: 'Potato Chips', 
    price: 20, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Snacks', 
    stock: 120,
    description: 'Crispy and salty chips',
    image: '🍿'
  },
  { 
    name: 'Chocolate Bar', 
    price: 45, 
    imageUrl: 'https://via.placeholder.com/150', 
    category: 'Snacks', 
    stock: 80,
    description: 'Delicious milk chocolate',
    image: '🍫'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    console.log('Inserting seed products...');
    await Product.insertMany(seedProducts);
    console.log(`✅ Successfully seeded ${seedProducts.length} products`);

    console.log('\n📦 Seeded Products:');
    seedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.image} ${product.name} - ₹${product.price} (${product.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
