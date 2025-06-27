import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentList = ({ payments = [], onViewPayment, onEditPayment, onDeletePayment }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterMethod, setFilterMethod] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPaymentMethodConfig = (method) => {
    const configs = {
      cash: {
        name: 'Cash',
        icon: 'Banknote',
        color: 'text-success-600',
        bgColor: 'bg-success-100'
      },
      bank_transfer: {
        name: 'Bank Transfer',
        icon: 'Building2',
        color: 'text-primary-600',
        bgColor: 'bg-primary-100'
      },
      paystack: {
        name: 'Card Payment',
        icon: 'CreditCard',
        color: 'text-accent-600',
        bgColor: 'bg-accent-100'
      },
      credit: {
        name: 'Credit',
        icon: 'Clock',
        color: 'text-warning-600',
        bgColor: 'bg-warning-100'
      }
    };
    return configs[method] || configs.cash;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        name: 'Completed',
        color: 'text-success-600',
        bgColor: 'bg-success-100'
      },
      pending: {
        name: 'Pending',
        color: 'text-warning-600',
        bgColor: 'bg-warning-100'
      },
      failed: {
        name: 'Failed',
        color: 'text-error-600',
        bgColor: 'bg-error-100'
      }
    };
    return configs[status] || configs.completed;
  };

  const filteredAndSortedPayments = payments
    .filter(payment => filterMethod === 'all' || payment.paymentMethod === filterMethod)
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'customer':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'method':
          aValue = a.paymentMethod;
          bValue = b.paymentMethod;
          break;
        default:
          aValue = new Date(a.paymentDate || a.timestamp);
          bValue = new Date(b.paymentDate || b.timestamp);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (payments.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-8 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Receipt" size={32} color="var(--color-primary-600)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Payments Yet</h3>
        <p className="text-text-secondary mb-4">
          Start recording payments to track your business cash flow
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paystack">Card Payment</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('date')}
              className="text-sm"
            >
              Date
              {sortBy === 'date' && (
                <Icon 
                  name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                  className="ml-1" 
                />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('amount')}
              className="text-sm"
            >
              Amount
              {sortBy === 'amount' && (
                <Icon 
                  name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                  className="ml-1" 
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="space-y-3">
        {filteredAndSortedPayments.map((payment) => {
          const methodConfig = getPaymentMethodConfig(payment.paymentMethod);
          const statusConfig = getStatusConfig(payment.status || 'completed');
          
          return (
            <div
              key={payment.id}
              className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${methodConfig.bgColor}`}>
                      <Icon 
                        name={methodConfig.icon} 
                        size={16} 
                        color={`var(--color-${methodConfig.color.split('-')[0]}-600)`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary truncate">
                        {payment.customerName}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <span>{methodConfig.name}</span>
                        <span>•</span>
                        <span>{formatDate(payment.paymentDate || payment.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-text-primary">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        {statusConfig.name}
                      </span>
                    </div>
                  </div>
                  
                  {payment.description && (
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {payment.description}
                    </p>
                  )}
                  
                  {payment.referenceNumber && (
                    <p className="text-xs text-text-secondary mt-1">
                      Ref: {payment.referenceNumber}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPayment(payment)}
                    iconName="Eye"
                    className="touch-target"
                    aria-label="View payment"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPayment(payment)}
                    iconName="Edit"
                    className="touch-target"
                    aria-label="Edit payment"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePayment(payment)}
                    iconName="Trash2"
                    className="touch-target text-error-600 hover:text-error-700"
                    aria-label="Delete payment"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentList;