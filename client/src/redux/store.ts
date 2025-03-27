import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import adminReducer from './slices/adminSlice';
import userManagementReducer from './slices/userManagementSlice';
import categoryReducer from './slices/categorySlice';
import productManagementReducer from './slices/productManagementSlice';
import productStatsReducer from './slices/productStatsSlice';
import productVariantReducer from './slices/productVariantSlice';
import productReviewReducer from './slices/productReviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    admin: adminReducer,
    userManagement: userManagementReducer,
    category: categoryReducer,
    productManagement: productManagementReducer,
    productStats: productStatsReducer,
    productVariants: productVariantReducer,
    productReviews: productReviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 