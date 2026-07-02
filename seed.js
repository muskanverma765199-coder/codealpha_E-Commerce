const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // Featured Products
  {
    name: "iPhone 15 Pro",
    price: 84900,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
    description: "The ultimate iPhone featuring a strong and light aerospace-grade titanium design, the powerhouse A17 Pro chip, a customizable Action button, and a powerful camera system.",
    category: "Electronics",
    tag: "featured"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    price: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    description: "Industry-leading noise-canceling wireless headphones with exceptional sound, crystal-clear hands-free calling, and up to 30 hours of battery life.",
    category: "Audio",
    tag: "featured"
  },
  {
    name: "MacBook Pro 14-inch",
    price: 149900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
    description: "Supercharged by the next-generation M3 chip, this laptop delivers stunning performance, a breathtaking Liquid Retina XDR display, and up to 22 hours of battery life.",
    category: "Electronics",
    tag: "featured"
  },
  {
    name: "Fujifilm X-T5 Camera",
    price: 149900,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    description: "A compact and lightweight mirrorless digital camera featuring the high-resolution 40.2MP X-Trans 5 HR sensor, 3-way tilting LCD, and classic retro dial layout.",
    category: "Cameras",
    tag: "featured"
  },
  {
    name: "Apple Watch Series 9",
    price: 41900,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80",
    description: "A smarter, brighter, and more powerful smartwatch featuring the S9 SiP chip, double-tap gesture control, and advanced health and fitness tracking.",
    category: "Wearables",
    tag: "featured"
  },
  {
    name: "Minimalist Daily Backpack",
    price: 4999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    description: "A clean, water-resistant everyday backpack featuring a padded laptop compartment, smart interior pockets, and ergonomic padded shoulder straps.",
    category: "Accessories",
    tag: "featured"
  },

  // Trending Products
  {
    name: "iPad Air M1",
    price: 54900,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80",
    description: "Incredible performance with the M1 chip, an all-screen design, a 10.9-inch Liquid Retina display, and support for Apple Pencil and Magic Keyboard.",
    category: "Electronics",
    tag: "trending"
  },
  {
    name: "Bose QC Ultra Earbuds",
    price: 25900,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    description: "Immersive audio earbuds with world-class noise cancellation, customized sound shape, and touch controls for all-day comfort and stability.",
    category: "Audio",
    tag: "trending"
  },
  {
    name: "GoPro HERO12 Black",
    price: 37900,
    image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=500&auto=format&fit=crop&q=80",
    description: "Take class-leading image quality, even better HyperSmooth video stabilization, and a huge boost in battery performance to the absolute max with GoPro HERO12.",
    category: "Cameras",
    tag: "trending"
  },
  {
    name: "Kindle Paperwhite",
    price: 14999,
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=80",
    description: "Now with a 6.8-inch display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    category: "Electronics",
    tag: "trending"
  },

  // Top Sales / Offers
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 109900,
    originalPrice: 129900,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility.",
    category: "Electronics",
    tag: "offer"
  },
  {
    name: "Sony PlayStation 5",
    price: 44990,
    originalPrice: 54990,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
    description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    category: "Electronics",
    tag: "offer"
  },
  {
    name: "Dell XPS 13 Laptop",
    price: 99990,
    originalPrice: 119990,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80",
    description: "Stunningly small. Masterfully crafted. This thin-and-light laptop features premium materials, an infinityedge display, and powerful Intel Core processors.",
    category: "Electronics",
    tag: "offer"
  },
  {
    name: "Marshall Stanmore III Speaker",
    price: 31990,
    originalPrice: 39990,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    description: "Marshall's signature heavy-weight speaker has a wider soundstage than its predecessor, delivering home-shaking Marshall signature sound that has been re-engineered.",
    category: "Audio",
    tag: "offer"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB for seeding (INR & Sections)...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');
    
    // Insert products
    await Product.insertMany(products);
    console.log('Database seeded successfully with 14 products in INR.');
    
    mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
