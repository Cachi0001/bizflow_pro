import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = ({ transactions, onViewAll }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-NG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'invoice':
        return 'FileText';
      case 'expense':
        return 'Receipt';
      case 'payment':
        return 'CreditCard';
      default:
        return 'DollarSign';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'invoice':
        return 'text-primary-600';
      case 'expense':
        return 'text-error-600';
      case 'payment':
        return 'text-success-600';
      default:
        return 'text-text-secondary';
    }
  };

  const getAmountDisplay = (transaction) => {
    const amount = formatCurrency(Math.abs(transaction.amount));
    if (transaction.type === 'expense') {
      return `-${amount}`;
    }
    return `+${amount}`;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Recent Transactions</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Receipt" size={24} color="var(--color-text-secondary)" />
            </div>
            <p className="text-text-secondary">No transactions yet</p>
            <p className="text-sm text-text-secondary mt-1">
              Create your first invoice or record an expense to get started
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4 p-3 hover:bg-background-secondary rounded-lg transition-colors duration-200">
              <div className={`p-2 rounded-lg bg-gray-100`}>
                <Icon 
                  name={getTransactionIcon(transaction.type)} 
                  size={20} 
                  color="var(--color-text-secondary)"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {transaction.description}
                  </p>
                  <span className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                    {getAmountDisplay(transaction)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-text-secondary">
                    {transaction.client || transaction.category}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
              className="w-full"
              onClick={() => console.log('Create invoice')}
            >
              New Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Receipt"
              iconPosition="left"
              className="w-full"
              onClick={() => console.log('Add expense')}
            >
              Add Expense
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;