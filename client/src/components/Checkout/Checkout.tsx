import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Container } from '@mui/material';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderReview from './OrderReview';

const steps = ['Shipping Information', 'Payment Details', 'Review Order'];

const Checkout: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ShippingForm onNext={handleNext} />;
      case 1:
        return <PaymentForm onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <OrderReview onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {getStepContent(activeStep)}
    </Container>
  );
};

export default Checkout; 