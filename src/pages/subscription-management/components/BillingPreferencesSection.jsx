import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BillingPreferencesSection = ({ currentPlan }) => {
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [billingEmail, setBillingEmail] = useState('john@business.com');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isEditing, setIsEditing] = useState(false);

  const paymentMethods = [
    {
      id: 'card_4532',
      type: 'card',
      name: 'Visa ending in 4532',
      icon: 'CreditCard',
      isDefault: true,
      expiryDate: '12/26'
    },
    {
      id: 'bank_gtb',
      type: 'bank',
      name: 'GTBank - 0123456789',
      icon: 'Building',
      isDefault: false
    }
  ];

  const billingCycles = [
    { id: 'weekly', name: 'Weekly', description: 'Perfect for cash flow management' },
    { id: 'monthly', name: 'Monthly', description: 'Save ₦300 compared to weekly' },
    { id: 'yearly', name: 'Yearly', description: 'Best value - Save ₦14,400 per year' }
  ];

  const handleSavePreferences = () => {
    console.log('Saving billing preferences:', {
      autoRenewal,
      billingEmail,
      paymentMethod
    });
    setIsEditing(false);
  };

  const handleAddPaymentMethod = () => {
    console.log('Adding new payment method');
    // In real implementation, this would open Paystack payment method setup
  };

  const handleRemovePaymentMethod = (methodId) => {
    console.log('Removing payment method:', methodId);
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    console.log('Setting default payment method:', methodId);
    setPaymentMethod(methodId);
  };

  return (
    <div className="space-y-6">
      {/* Auto-Renewal Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Auto-Renewal</h3>
            <p className="text-sm text-text-secondary">
              Automatically renew your subscription to avoid service interruption
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRenewal}
              onChange={(e) => setAutoRenewal(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {autoRenewal && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} color="var(--color-success-600)" className="mt-0.5" />
              <div>
                <h4 className="font-medium text-success-800 mb-1">Auto-Renewal Active</h4>
                <p className="text-sm text-success-700">
                  Your subscription will automatically renew on January 22, 2024. 
                  We'll send you a reminder 2 days before.
                </p>
              </div>
            </div>
          </div>
        )}

        {!autoRenewal && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning-600)" className="mt-0.5" />
              <div>
                <h4 className="font-medium text-warning-800 mb-1">Manual Renewal Required</h4>
                <p className="text-sm text-warning-700">
                  You'll need to manually renew your subscription before it expires. 
                  We'll send you reminders via email.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Billing Email */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Billing Email</h3>
            <p className="text-sm text-text-secondary">
              Where we send invoices and billing notifications
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            iconName={isEditing ? "X" : "Edit"}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="Enter billing email"
              className="w-full"
            />
            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleSavePreferences}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Icon name="Mail" size={20} color="var(--color-text-secondary)" />
            <span className="text-text-primary">{billingEmail}</span>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Payment Methods</h3>
            <p className="text-sm text-text-secondary">
              Manage your payment methods for subscription billing
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPaymentMethod}
            iconName="Plus"
          >
            Add Method
          </Button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors duration-200 ${
                method.isDefault 
                  ? 'border-primary-200 bg-primary-50' :'border-border hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  method.isDefault ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <Icon 
                    name={method.icon} 
                    size={20} 
                    color={method.isDefault ? 'var(--color-primary-600)' : 'var(--color-text-secondary)'} 
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary">{method.name}</h4>
                  {method.expiryDate && (
                    <p className="text-sm text-text-secondary">Expires {method.expiryDate}</p>
                  )}
                  {method.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                      Default
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefaultPaymentMethod(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePaymentMethod(method.id)}
                  iconName="Trash2"
                  className="text-error-600 hover:bg-error-50"
                >
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Cycle Preferences */}
      {currentPlan !== 'free' && (
        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Billing Cycle</h3>
            <p className="text-sm text-text-secondary">
              Choose how often you want to be billed
            </p>
          </div>

          <div className="space-y-3">
            {billingCycles.map((cycle) => (
              <label
                key={cycle.id}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <input
                  type="radio"
                  name="billingCycle"
                  value={cycle.id}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <div className="ml-3">
                  <div className="font-medium text-text-primary">{cycle.name}</div>
                  <div className="text-sm text-text-secondary">{cycle.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Billing Information */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-info-600)" className="mt-0.5" />
          <div>
            <h4 className="font-medium text-info-800 mb-1">Billing Information</h4>
            <ul className="text-sm text-info-700 space-y-1">
              <li>• All payments are processed securely through Paystack</li>
              <li>• You can change your billing preferences anytime</li>
              <li>• Invoices are sent to your billing email address</li>
              <li>• Failed payments will be retried automatically for 3 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPreferencesSection;