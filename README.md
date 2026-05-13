# MERN E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, shopping cart, order management, and admin dashboard.

## Features

- **User Authentication**: JWT-based auth with login, register, and protected routes
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Shopping Cart**: Add, update, remove items with real-time cart count
- **Checkout Flow**: Multi-step checkout with shipping address and order placement
- **Order Management**: View order history with status tracking
- **Admin Dashboard**: Manage products and orders (admin-only access)
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Animations**: Smooth page transitions with Framer Motion

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React 18 with Hooks & Context API
- React Router v6 for navigation
- Tailwind CSS for styling
- Heroicons for icons
- Framer Motion for animations
- Axios for API requests
- React Hot Toast for notifications

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Setup Server

```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 2. Seed Database

```bash
npm run seed
```

### 3. Start Server

```bash
npm run dev    # Development with nodemon
```

Server runs on `http://localhost:8000`

### 4. Setup Client

```bash
cd client
npm install
```

### 5. Start React App

```bash
npm start
```

Client runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |
| GET | /api/products | Get all products | Public |
| GET | /api/products/featured | Get featured | Public |
| GET | /api/products/:id | Get single product | Public |
| POST | /api/cart/add | Add to cart | Private |
| GET | /api/cart | Get cart | Private |
| PUT | /api/cart/update/:id | Update quantity | Private |
| DELETE | /api/cart/remove/:id | Remove item | Private |
| POST | /api/orders | Create order | Private |
| GET | /api/orders | Get my orders | Private |

## Bug Fixes Applied (v1.1)

### Fixed Issues:
1. **React StrictMode Double Mount**: Removed StrictMode, added `useRef` guards in contexts
2. **Cart Empty State**: Fixed cart model to handle empty items array
3. **Missing Data Handling**: Added null checks throughout all components
4. **Image Fallbacks**: Added `onError` handlers for broken images
5. **API Timeouts**: Added 10s timeout to axios instance
6. **Auth Persistence**: Fixed token validation on page refresh
7. **Category Filtering**: Fixed case-sensitivity in product queries
8. **Cart Total Calculation**: Fixed NaN issues with undefined quantities

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more details.

## Project Structure

```
ecommerce-mern/
├── server/
│   ├── config/db.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seed.js
└── client/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## License
MIT

---
Built with the MERN Stack | Bug-fixed & Production Ready