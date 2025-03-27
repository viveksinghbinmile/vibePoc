# DentalCare E-commerce Platform

A full-stack e-commerce application for dental products built with React and Node.js.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Redux for state management
- Material-UI for components
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose for ODM

## Project Structure

```
dentalcare/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── services/
└── server/             # Backend Node.js application
    ├── controllers/
    ├── models/
    ├── routes/
    └── middleware/
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a .env file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (Admin only)
- PUT /api/products/:id - Update product (Admin only)
- DELETE /api/products/:id - Delete product (Admin only)

### Orders
- POST /api/orders - Create order
- GET /api/orders - Get user orders
- GET /api/orders/:id - Get order details
- PUT /api/orders/:id - Update order status (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
