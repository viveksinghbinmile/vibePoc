import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SalesReport {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByCategory: Array<{
    category: string;
    total: number;
    percentage: number;
  }>;
  salesByMonth: Array<{
    month: string;
    total: number;
  }>;
  topProducts: Array<{
    productId: string;
    name: string;
    totalSales: number;
    quantity: number;
  }>;
}

interface AdminState {
  salesReport: SalesReport | null;
  loading: boolean;
  error: string | null;
  filters: {
    startDate: string | null;
    endDate: string | null;
    category: string | null;
  };
}

const initialState: AdminState = {
  salesReport: null,
  loading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    category: null,
  },
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchSalesReport = createAsyncThunk(
  'admin/fetchSalesReport',
  async (
    { startDate, endDate, category }: { startDate?: string; endDate?: string; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${API_URL}/admin/sales-report`, {
        params: { startDate, endDate, category },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales report');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = adminSlice.actions;
export default adminSlice.reducer; 