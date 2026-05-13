import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Home = () => {
  const [, setFeaturedProducts] = useState([]);
  const [, setLoading] = useState(true);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const res = await api.get('/products/featured');
      setFeaturedProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const categories = [
    { name: 'Electronics', color: 'bg-blue-100 text-blue-600' },
    { name: 'Clothing', color: 'bg-pink-100 text-pink-600' },
    { name: 'Home', color: 'bg-green-100 text-green-600' },
    { name: 'Sports', color: 'bg-orange-100 text-orange-600' },
    { name: 'Books', color: 'bg-purple-100 text-purple-600' },
    { name: 'Other', color: 'bg-gray-100 text-gray-600' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Discover Amazing Products
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="inline-flex items-center bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </Link>
                <Link to="/register" className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors">
                  Get Started
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" 
                  alt="Shopping" 
                  className="relative rounded-3xl shadow-2xl w-full object-cover h-96"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

           <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="card p-6 text-center hover:scale-105 transition-transform duration-200"
              >
                
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;