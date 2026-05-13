import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCartIcon, 
  StarIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  // Read filters from URL only once on mount
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || ''
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = { category: '', search: '', minPrice: '', maxPrice: '', sort: '' };
    setFilters(emptyFilters);
    setSearchParams(new URLSearchParams());
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['electronics', 'clothing', 'home', 'sports', 'books', 'other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-600 mt-1">{pagination.total} products found</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>

          <select
            value={filters.sort}
            onChange={(e) => {
              const newFilters = { ...filters, sort: e.target.value };
              setFilters(newFilters);
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set('sort', e.target.value);
              } else {
                params.delete('sort');
              }
              params.set('page', '1');
              setSearchParams(params);
            }}
            className="input-field w-auto"
          >
            <option value="">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="$9999"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex items-end gap-2">
              <button onClick={applyFilters} className="btn-primary flex-1">Apply</button>
              <button onClick={clearFilters} className="btn-secondary flex-1">Clear</button>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <button onClick={clearFilters} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card overflow-hidden group"
              >
                <Link to={`/products/${product._id}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">
                      {product.ratings?.average || 0}
                    </span>
                  </div>

                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">${product.price}</span>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                      className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
         
        </>
      )}
    </div>
  );
};

export default Products;