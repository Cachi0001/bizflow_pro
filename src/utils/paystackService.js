import { usePaystackPayment } from 'react-paystack';

const paystackService = {
  // Initialize Paystack payment
  initializePayment: (config) => {
    const paystackConfig = {
      reference: config.reference || new Date().getTime().toString(),
      email: config.email,
      amount: config.amount * 100, // Paystack expects amount in kobo
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      currency: config.currency || 'NGN',
      channels: config.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      metadata: {
        ...config.metadata,
        cancel_action: 'https://your-domain.com/cancel'
      },
      onSuccess: (reference) => {
        console.log('Payment successful:', reference)
        if (config.onSuccess) {
          config.onSuccess(reference)
        }
      },
      onClose: () => {
        console.log('Payment dialog closed')
        if (config.onClose) {
          config.onClose()
        }
      }
    }

    // Return the payment hook
    return usePaystackPayment(paystackConfig)
  },

  // Verify payment on server
  verifyPayment: async (reference) => {
    try {
      const response = await fetch(`/api/paystack/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`
        }
      })

      const data = await response.json()

      if (data.status === 'success') {
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Payment verification failed' }
    }
  },

  // Create payment link
  createPaymentLink: async (paymentData) => {
    try {
      const response = await fetch('https://api.paystack.co/page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify({
          name: paymentData.name,
          description: paymentData.description,
          amount: paymentData.amount * 100,
          currency: paymentData.currency || 'NGN',
          redirect_url: paymentData.redirect_url,
          metadata: paymentData.metadata
        })
      })

      const data = await response.json()

      if (data.status) {
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Failed to create payment link' }
    }
  },

  // Format amount for display
  formatAmount: (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  },

  // Validate payment configuration
  validateConfig: (config) => {
    const required = ['email', 'amount']
    const missing = required.filter(field => !config[field])
    
    if (missing.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missing.join(', ')}`
      }
    }

    if (config.amount <= 0) {
      return {
        valid: false,
        error: 'Amount must be greater than 0'
      }
    }

    if (!config.email.includes('@')) {
      return {
        valid: false,
        error: 'Invalid email address'
      }
    }

    return { valid: true }
  }
}

export default paystackService