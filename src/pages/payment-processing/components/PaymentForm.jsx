import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentForm = ({ paymentMethod, onSubmit, onCancel, invoices = [] }) => {
  const [formData, setFormData] = useState({
    amount: '',
    customerName: '',
    description: '',
    invoiceId: '',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    creditTerms: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        paymentMethod,
        amount: parseFloat(formData.amount),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Payment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getMethodConfig = () => {
    const configs = {
      cash: {
        title: 'Record Cash Payment',
        icon: 'Banknote',
        color: 'text-success-600',
        fields: ['amount', 'customerName', 'description', 'invoiceId', 'paymentDate', 'notes']
      },
      bank_transfer: {
        title: 'Record Bank Transfer',
        icon: 'Building2',
        color: 'text-primary-600',
        fields: ['amount', 'customerName', 'referenceNumber', 'description', 'invoiceId', 'paymentDate', 'notes']
      },
      paystack: {
        title: 'Process Card Payment',
        icon: 'CreditCard',
        color: 'text-accent-600',
        fields: ['amount', 'customerName', 'description', 'invoiceId']
      },
      credit: {
        title: 'Record Credit Payment',
        icon: 'Clock',
        color: 'text-warning-600',
        fields: ['amount', 'customerName', 'creditTerms', 'description', 'invoiceId', 'paymentDate', 'notes']
      }
    };
    return configs[paymentMethod] || configs.cash;
  };

  const config = getMethodConfig();

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon name={config.icon} size={20} color="var(--color-primary-600)" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">{config.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          iconName="X"
          className="touch-target"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Field */}
        {config.fields.includes('amount') && (
          <div className="form-group">
            <label className="form-label">
              Amount <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">₦</span>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="pl-8"
                required
                min="0"
                step="0.01"
              />
            </div>
            {formData.amount && (
              <p className="text-sm text-text-secondary mt-1">
                {formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            )}
          </div>
        )}

        {/* Customer Name */}
        {config.fields.includes('customerName') && (
          <div className="form-group">
            <label className="form-label">
              Customer Name <span className="text-error-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              required
            />
          </div>
        )}

        {/* Invoice Selection */}
        {config.fields.includes('invoiceId') && (
          <div className="form-group">
            <label className="form-label">Link to Invoice (Optional)</label>
            <select
              value={formData.invoiceId}
              onChange={(e) => handleInputChange('invoiceId', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select an invoice</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  #{invoice.number} - {invoice.customerName} ({formatCurrency(invoice.amount)})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reference Number */}
        {config.fields.includes('referenceNumber') && (
          <div className="form-group">
            <label className="form-label">
              Reference Number <span className="text-error-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter bank reference number"
              value={formData.referenceNumber}
              onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
              required
            />
          </div>
        )}

        {/* Credit Terms */}
        {config.fields.includes('creditTerms') && (
          <div className="form-group">
            <label className="form-label">Credit Terms</label>
            <select
              value={formData.creditTerms}
              onChange={(e) => handleInputChange('creditTerms', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select credit terms</option>
              <option value="7_days">7 Days</option>
              <option value="14_days">14 Days</option>
              <option value="30_days">30 Days</option>
              <option value="60_days">60 Days</option>
              <option value="90_days">90 Days</option>
              <option value="custom">Custom Terms</option>
            </select>
          </div>
        )}

        {/* Payment Date */}
        {config.fields.includes('paymentDate') && (
          <div className="form-group">
            <label className="form-label">Payment Date</label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleInputChange('paymentDate', e.target.value)}
            />
          </div>
        )}

        {/* Description */}
        {config.fields.includes('description') && (
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Enter payment description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              rows="3"
            />
          </div>
        )}

        {/* Notes */}
        {config.fields.includes('notes') && (
          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              rows="2"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!formData.amount || !formData.customerName}
            className="flex-1"
          >
            {paymentMethod === 'paystack' ? 'Process Payment' : 'Record Payment'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;