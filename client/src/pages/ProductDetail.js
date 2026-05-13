import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingCartIcon, 
  StarIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success && res.data.product) {
        setProduct(res.data.product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!product) return;
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">{error || 'Product not found.'}</p>
        <button onClick={() => navigate('/products')} className="mt-4 btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const ratings = product.ratings || { average: 0, count: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <img 
              src={images[selectedImage] || 'https://via.placeholder.com/600x600?text=No+Image'} 
              alt={product.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {product.category || 'Other'}
            </span>
            {product.stock < 10 && product.stock > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                Only {product.stock} left
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-5 h-5 ${
                    i < Math.round(ratings.average || 0) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="ml-2 text-gray-600">
                {ratings.average || 0} ({ratings.count || 0} reviews)
              </span>
            </div>
          </div>

          <p className="text-4xl font-bold text-primary-600 mb-6">${product.price}</p>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                disabled={quantity >= (product.stock || 0)}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.stock || 0} available</span>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <TruckIcon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
            <div className="text-center">
              <ArrowPathIcon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Easy Returns</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;