import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Rating,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchProductReviews,
  createProductReview,
  deleteProductReview,
  setSelectedReview,
  clearSelectedReview,
  fetchReviewStats,
} from '../../redux/slices/productReviewSlice';

interface ProductReviewsProps {
  productId: string;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
}

const initialFormData: ReviewFormData = {
  rating: 0,
  comment: '',
  status: 'pending',
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { reviews, loading, error, selectedReview } = useAppSelector((state) => state.productReviews);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    dispatch(fetchProductReviews(productId));
    const fetchStats = async () => {
      const result = await dispatch(fetchReviewStats(productId));
      if (fetchReviewStats.fulfilled.match(result)) {
        setStats(result.payload);
      }
    };
    fetchStats();
  }, [dispatch, productId]);

  const handleOpenDialog = (review?: any) => {
    if (review) {
      setFormData({
        rating: review.rating,
        comment: review.comment,
        status: review.status,
      });
      setIsEdit(true);
      dispatch(setSelectedReview(review));
    } else {
      setFormData(initialFormData);
      setIsEdit(false);
      dispatch(clearSelectedReview());
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    dispatch(clearSelectedReview());
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isEdit && selectedReview) {
      await dispatch(createProductReview({ productId, reviewData: formData }));
    }
    handleCloseDialog();
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await dispatch(deleteProductReview(reviewId));
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
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
      <Typography variant="h6" gutterBottom>
        Product Reviews
      </Typography>

      {/* Review Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{stats.averageRating.toFixed(1)}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Average Rating
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{stats.totalReviews}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Total Reviews
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{stats.approvedReviews}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Approved Reviews
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{stats.pendingReviews}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Pending Reviews
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.userName}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly />
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>
                  <Chip
                    label={review.status}
                    color={getStatusColor(review.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(review)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(review.id)}
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

      {/* Review Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEdit ? 'Edit Review' : 'Add New Review'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Rating
                value={formData.rating}
                onChange={(_, value) => setFormData((prev) => ({ ...prev, rating: value || 0 }))}
                precision={0.5}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleTextInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReviews; 