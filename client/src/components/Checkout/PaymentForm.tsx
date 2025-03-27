import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setPaymentMethod } from '../../redux/slices/checkoutSlice';

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onNext, onBack }) => {
  const dispatch = useAppDispatch();
  const { paymentMethod } = useAppSelector((state) => state.checkout);
  const [formData, setFormData] = useState({
    cardNumber: paymentMethod?.cardNumber || '',
    expiryDate: paymentMethod?.expiryDate || '',
    cvv: paymentMethod?.cvv || '',
    nameOnCard: paymentMethod?.nameOnCard || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    // Format expiry date with slash
    else if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setPaymentMethod(formData));
    onNext();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Payment Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              inputProps={{ maxLength: 19 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="CVV"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name on Card"
              name="nameOnCard"
              value={formData.nameOnCard}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={onBack}
                size="large"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Next: Review Order
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PaymentForm; 