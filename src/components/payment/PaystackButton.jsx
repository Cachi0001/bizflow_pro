import React from 'react';
import { usePaystackPayment } from 'react-paystack';
 import Button from'../ui/Button';
 import paystackService from'../../utils/paystackService';

const PaystackButton = ({ 
  amount, 
  email, 
  reference, 
  onSuccess, 
  onClose, 
  metadata = {},
  currency = 'NGN',
  channels,
  className = '',
  children,
  disabled = false,
  ...props 
}) => {
  const config = {
    reference: reference || new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency,
    channels: channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: "Invoice Reference",
          variable_name: "invoice_reference",
          value: reference || metadata.invoice_reference || ''
        }
      ]
    }
  }

  // Validate configuration
  const validation = paystackService.validateConfig({ email, amount })
  
  const initializePayment = usePaystackPayment(config)

  const handlePayment = () => {
    if (!validation.valid) {
      console.error('Paystack config error:', validation.error)
      return
    }

    initializePayment(
      (reference) => {
        console.log('Payment successful:', reference)
        if (onSuccess) {
          onSuccess(reference)
        }
      },
      () => {
        console.log('Payment closed')
        if (onClose) {
          onClose()
        }
      }
    )
  }

  if (!validation.valid) {
    return (
      <Button
        disabled
        className={`bg-red-500 text-white ${className}`}
        {...props}
      >
        Configuration Error
      </Button>
    )
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      {...props}
    >
      {children || `Pay ${paystackService.formatAmount(amount, currency)}`}
    </Button>
  )
}

export default PaystackButton