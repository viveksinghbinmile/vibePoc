import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find((item) => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 