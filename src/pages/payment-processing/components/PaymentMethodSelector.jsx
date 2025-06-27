import React from 'react';
import Icon from '../../../components/AppIcon';


const PaymentMethodSelector = ({ selectedMethod, onMethodSelect, subscriptionTier = 'free' }) => {
  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: 'Banknote',
      description: 'Record cash payments from customers',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      available: true
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: 'Building2',
      description: 'Bank transfer with reference number',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      available: true
    },
    {
      id: 'paystack',
      name: 'Card Payment',
      icon: 'CreditCard',
      description: 'Secure card processing via Paystack',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
      available: subscriptionTier !== 'free'
    },
    {
      id: 'credit',
      name: 'Credit Payment',
      icon: 'Clock',
      description: 'Payment on credit terms',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      available: true
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Select Payment Method</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="relative">
            <button
              onClick={() => method.available && onMethodSelect(method.id)}
              disabled={!method.available}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${selectedMethod === method.id 
                  ? `${method.borderColor} ${method.bgColor}` 
                  : 'border-border bg-surface hover:border-primary-200'
                }
                ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                touch-target
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg ${method.bgColor}
                  ${!method.available ? 'opacity-50' : ''}
                `}>
                  <Icon 
                    name={method.icon} 
                    size={20} 
                    color={method.available ? `var(--color-${method.color.split('-')[0]}-600)` : 'var(--color-text-disabled)'}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${method.available ? 'text-text-primary' : 'text-text-disabled'}`}>
                      {method.name}
                    </h4>
                    {selectedMethod === method.id && (
                      <Icon name="Check" size={16} color="var(--color-success-600)" />
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${method.available ? 'text-text-secondary' : 'text-text-disabled'}`}>
                    {method.description}
                  </p>
                </div>
              </div>
            </button>

            {/* Premium Badge */}
            {!method.available && (
              <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1">
                <Icon name="Crown" size={12} color="white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {subscriptionTier === 'free' && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Crown" size={20} color="var(--color-accent-600)" />
            <div>
              <h4 className="font-medium text-accent-800">Upgrade for More Payment Options</h4>
              <p className="text-sm text-accent-700 mt-1">
                Get access to card payments via Paystack and advanced payment features with Silver tier.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;