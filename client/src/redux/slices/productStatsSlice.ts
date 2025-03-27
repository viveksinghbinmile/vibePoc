import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProductStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryStats: {
    category: string;
    count: number;
    totalValue: number;
    averagePrice: number;
  }[];
  salesStats: {
    totalSales: number;
    averageOrderValue: number;
    topProducts: {
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }[];
  };
}

interface ProductStatsState {
  stats: ProductStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductStatsState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchProductStats = createAsyncThunk(
  'productStats/fetchStats',
  async () => {
    const response = await axios.get('/api/products/stats');
    return response.data;
  }
);

const productStatsSlice = createSlice({
  name: 'productStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product statistics';
      });
  },
});

export default productStatsSlice.reducer; 