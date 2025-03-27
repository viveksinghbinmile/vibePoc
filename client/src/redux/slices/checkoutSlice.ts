import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

interface CheckoutState {
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  loading: boolean;
  error: string | null;
  orderId: string | null;
}

const initialState: CheckoutState = {
  shippingAddress: null,
  paymentMethod: null,
  loading: false,
  error: null,
  orderId: null,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createOrder = createAsyncThunk(
  'checkout/createOrder',
  async (
    {
      shippingAddress,
      paymentMethod,
      items,
      total,
    }: {
      shippingAddress: ShippingAddress;
      paymentMethod: PaymentMethod;
      items: any[];
      total: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, {
        shippingAddress,
        paymentMethod,
        items,
        total,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCheckout: (state) => {
      state.shippingAddress = null;
      state.paymentMethod = null;
      state.error = null;
      state.orderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload._id;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShippingAddress, setPaymentMethod, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer; 