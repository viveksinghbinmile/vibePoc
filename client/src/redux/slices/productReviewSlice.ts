import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface ProductReviewState {
  reviews: ProductReview[];
  loading: boolean;
  error: string | null;
  selectedReview: ProductReview | null;
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: number]: number;
    };
  } | null;
}

const initialState: ProductReviewState = {
  reviews: [],
  loading: false,
  error: null,
  selectedReview: null,
  reviewStats: null,
};

export const fetchProductReviews = createAsyncThunk(
  'productReviews/fetchReviews',
  async (productId: string) => {
    const response = await axios.get(`/api/products/${productId}/reviews`);
    return response.data;
  }
);

export const createProductReview = createAsyncThunk(
  'productReviews/createReview',
  async ({ productId, reviewData }: { productId: string; reviewData: Partial<ProductReview> }) => {
    const response = await axios.post(`/api/products/${productId}/reviews`, reviewData);
    return response.data;
  }
);

export const updateReviewStatus = createAsyncThunk(
  'productReviews/updateStatus',
  async ({ reviewId, status }: { reviewId: string; status: ProductReview['status'] }) => {
    const response = await axios.put(`/api/product-reviews/${reviewId}/status`, { status });
    return response.data;
  }
);

export const deleteProductReview = createAsyncThunk(
  'productReviews/deleteReview',
  async (reviewId: string) => {
    await axios.delete(`/api/product-reviews/${reviewId}`);
    return reviewId;
  }
);

export const fetchReviewStats = createAsyncThunk(
  'productReviews/fetchStats',
  async (productId: string) => {
    const response = await axios.get(`/api/products/${productId}/review-stats`);
    return response.data;
  }
);

const productReviewSlice = createSlice({
  name: 'productReviews',
  initialState,
  reducers: {
    setSelectedReview: (state, action) => {
      state.selectedReview = action.payload;
    },
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product reviews';
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      })
      .addCase(fetchReviewStats.fulfilled, (state, action) => {
        state.reviewStats = action.payload;
      });
  },
});

export const { setSelectedReview, clearSelectedReview } = productReviewSlice.actions;
export default productReviewSlice.reducer; 