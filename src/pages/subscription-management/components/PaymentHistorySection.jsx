import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentHistorySection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const paymentHistory = [
    {
      id: 'pay_001',
      date: new Date('2024-01-15'),
      amount: '₦1,200',
      plan: 'Silver Plan',
      period: 'Weekly',
      status: 'completed',
      method: 'Card ending in 4532',
      receiptUrl: '#receipt-001'
    },
    {
      id: 'pay_002',
      date: new Date('2024-01-08'),
      amount: '₦1,200',
      plan: 'Silver Plan',
      period: 'Weekly',
      status: 'completed',
      method: 'Bank Transfer',
      receiptUrl: '#receipt-002'
    },
    {
      id: 'pay_003',
      date: new Date('2024-01-01'),
      amount: '₦1,200',
      plan: 'Silver Plan',
      period: 'Weekly',
      status: 'completed',
      method: 'Card ending in 4532',
      receiptUrl: '#receipt-003'
    },
    {
      id: 'pay_004',
      date: new Date('2023-12-25'),
      amount: '₦4,500',
      plan: 'Silver Plan',
      period: 'Monthly',
      status: 'completed',
      method: 'Card ending in 4532',
      receiptUrl: '#receipt-004'
    },
    {
      id: 'pay_005',
      date: new Date('2023-12-18'),
      amount: '₦1,200',
      plan: 'Silver Plan',
      period: 'Weekly',
      status: 'failed',
      method: 'Card ending in 4532',
      receiptUrl: null,
      failureReason: 'Insufficient funds'
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        color: 'text-success-600',
        bgColor: 'bg-success-100',
        icon: 'CheckCircle',
        label: 'Completed'
      },
      failed: {
        color: 'text-error-600',
        bgColor: 'bg-error-100',
        icon: 'XCircle',
        label: 'Failed'
      },
      pending: {
        color: 'text-warning-600',
        bgColor: 'bg-warning-100',
        icon: 'Clock',
        label: 'Pending'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleDownloadReceipt = (receiptUrl, paymentId) => {
    console.log(`Downloading receipt for payment: ${paymentId}`);
    // In real implementation, this would download the receipt
  };

  const handleRetryPayment = (paymentId) => {
    console.log(`Retrying payment: ${paymentId}`);
    // In real implementation, this would retry the failed payment
  };

  const filteredHistory = paymentHistory.filter(payment => {
    if (selectedPeriod === 'all') return true;
    if (selectedPeriod === 'completed') return payment.status === 'completed';
    if (selectedPeriod === 'failed') return payment.status === 'failed';
    return true;
  });

  const totalPaid = paymentHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseInt(p.amount.replace('₦', '').replace(',', '')), 0);

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Payment History</h3>
          <p className="text-sm text-text-secondary">
            Total paid: <span className="font-medium text-success-600">₦{totalPaid.toLocaleString()}</span>
          </p>
        </div>
        
        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-text-secondary">Filter:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payment History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Receipt" size={48} color="var(--color-text-tertiary)" className="mx-auto mb-4" />
            <p className="text-text-secondary">No payment history found</p>
          </div>
        ) : (
          filteredHistory.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            
            return (
              <div key={payment.id} className="card p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full ${statusConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={statusConfig.icon} size={20} color={statusConfig.color.replace('text-', 'var(--color-').replace('-600', '-500)')} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-text-primary">{payment.amount}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-text-secondary">
                          {payment.plan} • {payment.period}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {formatDate(payment.date)} • {payment.method}
                        </p>
                        {payment.failureReason && (
                          <p className="text-sm text-error-600">
                            Reason: {payment.failureReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {payment.status === 'completed' && payment.receiptUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment.receiptUrl, payment.id)}
                        iconName="Download"
                      >
                        Receipt
                      </Button>
                    )}
                    
                    {payment.status === 'failed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRetryPayment(payment.id)}
                        iconName="RefreshCw"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Next Payment Info */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Calendar" size={20} color="var(--color-primary-600)" className="mt-0.5" />
          <div>
            <h4 className="font-medium text-primary-800 mb-1">Next Payment</h4>
            <p className="text-sm text-primary-700">
              Your next payment of ₦1,200 is scheduled for January 22, 2024. 
              We'll send you a reminder 2 days before.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistorySection;