import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import QRPayment from '@/components/QRPayment';

const QRPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Get order data from URL parameters
  const orderId = searchParams.get('orderId');
  const packageName = searchParams.get('packageName');
  const price = searchParams.get('price');
  const customerName = searchParams.get('customerName');
  const customerPhone = searchParams.get('customerPhone');
  const templateName = searchParams.get('templateName');

  // If required parameters are missing, redirect to home
  if (!orderId || !packageName || !price || !customerName || !customerPhone || !templateName) {
    return <Navigate to="/" replace />;
  }

  const orderData = {
    orderId,
    packageName,
    price,
    customerName,
    customerPhone,
    templateName,
  };

  const handlePaymentComplete = () => {
    // Could add additional logic here if needed
    console.log('Payment completed for order:', orderId);
  };

  return (
    <QRPayment 
      orderData={orderData} 
      onPaymentComplete={handlePaymentComplete}
    />
  );
};

export default QRPaymentPage;