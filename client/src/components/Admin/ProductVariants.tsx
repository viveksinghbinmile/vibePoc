import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  setSelectedVariant,
  clearSelectedVariant,
} from '../../redux/slices/productVariantSlice';

interface ProductVariantsProps {
  productId: string;
}

interface VariantFormData {
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
  imageUrl?: string;
}

const initialFormData: VariantFormData = {
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  attributes: {},
  imageUrl: '',
};

const ProductVariants: React.FC<ProductVariantsProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { variants, loading, error, selectedVariant } = useAppSelector((state) => state.productVariants);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<VariantFormData>(initialFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  useEffect(() => {
    dispatch(fetchProductVariants(productId));
  }, [dispatch, productId]);

  const handleOpenDialog = (variant?: any) => {
    if (variant) {
      setFormData({
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributes: variant.attributes,
        imageUrl: variant.imageUrl,
      });
      setIsEdit(true);
      dispatch(setSelectedVariant(variant));
    } else {
      setFormData(initialFormData);
      setIsEdit(false);
      dispatch(clearSelectedVariant());
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    dispatch(clearSelectedVariant());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleAddAttribute = () => {
    if (attributeKey && attributeValue) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeKey]: attributeValue,
        },
      }));
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const handleRemoveAttribute = (key: string) => {
    setFormData((prev) => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return { ...prev, attributes: newAttributes };
    });
  };

  const handleSubmit = async () => {
    if (isEdit && selectedVariant) {
      await dispatch(updateProductVariant({ variantId: selectedVariant.id, variantData: formData }));
    } else {
      await dispatch(createProductVariant({ productId, variantData: formData }));
    }
    handleCloseDialog();
  };

  const handleDelete = async (variantId: string) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      await dispatch(deleteProductVariant(variantId));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Product Variants</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Variant
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Attributes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.name}</TableCell>
                <TableCell>{variant.sku}</TableCell>
                <TableCell align="right">${variant.price.toFixed(2)}</TableCell>
                <TableCell align="right">{variant.stock}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(variant)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(variant.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Variant Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEdit ? 'Edit Variant' : 'Add New Variant'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attributes
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Attribute Key"
                  value={attributeKey}
                  onChange={(e) => setAttributeKey(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Attribute Value"
                  value={attributeValue}
                  onChange={(e) => setAttributeValue(e.target.value)}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddAttribute}
                  disabled={!attributeKey || !attributeValue}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.entries(formData.attributes).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    onDelete={() => handleRemoveAttribute(key)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductVariants; 