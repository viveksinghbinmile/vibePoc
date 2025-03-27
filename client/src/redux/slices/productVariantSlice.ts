import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductVariantState {
  variants: ProductVariant[];
  loading: boolean;
  error: string | null;
  selectedVariant: ProductVariant | null;
}

const initialState: ProductVariantState = {
  variants: [],
  loading: false,
  error: null,
  selectedVariant: null,
};

export const fetchProductVariants = createAsyncThunk(
  'productVariants/fetchVariants',
  async (productId: string) => {
    const response = await axios.get(`/api/products/${productId}/variants`);
    return response.data;
  }
);

export const createProductVariant = createAsyncThunk(
  'productVariants/createVariant',
  async ({ productId, variantData }: { productId: string; variantData: Partial<ProductVariant> }) => {
    const response = await axios.post(`/api/products/${productId}/variants`, variantData);
    return response.data;
  }
);

export const updateProductVariant = createAsyncThunk(
  'productVariants/updateVariant',
  async ({ variantId, variantData }: { variantId: string; variantData: Partial<ProductVariant> }) => {
    const response = await axios.put(`/api/product-variants/${variantId}`, variantData);
    return response.data;
  }
);

export const deleteProductVariant = createAsyncThunk(
  'productVariants/deleteVariant',
  async (variantId: string) => {
    await axios.delete(`/api/product-variants/${variantId}`);
    return variantId;
  }
);

const productVariantSlice = createSlice({
  name: 'productVariants',
  initialState,
  reducers: {
    setSelectedVariant: (state, action) => {
      state.selectedVariant = action.payload;
    },
    clearSelectedVariant: (state) => {
      state.selectedVariant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = action.payload;
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product variants';
      })
      .addCase(createProductVariant.fulfilled, (state, action) => {
        state.variants.push(action.payload);
      })
      .addCase(updateProductVariant.fulfilled, (state, action) => {
        const index = state.variants.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.variants[index] = action.payload;
        }
      })
      .addCase(deleteProductVariant.fulfilled, (state, action) => {
        state.variants = state.variants.filter((v) => v.id !== action.payload);
      });
  },
});

export const { setSelectedVariant, clearSelectedVariant } = productVariantSlice.actions;
export default productVariantSlice.reducer; 