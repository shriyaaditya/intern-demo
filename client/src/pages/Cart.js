import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartItems = cart?.items || [];
  const cartTotal = cart?.totalAmount || 0;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-4 flex gap-4"
            >
              <Link to={`/products/${item.product?._id || '#'}`}>
                <img 
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'} 
                  alt={item.product?.name || 'Product'}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?._id || '#'}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate">
                    {item.product?.name || 'Product'}
                  </h3>
                </Link>
                <p className="text-primary-600 font-bold mt-1">${(item.price || 0).toFixed(2)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                      disabled={(item.quantity || 1) >= (item.product?.stock || 0)}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
          >
            <TrashIcon className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">Please sign in to checkout</p>
                <Link to="/login" className="w-full btn-primary block text-center">
                  Sign In to Continue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;