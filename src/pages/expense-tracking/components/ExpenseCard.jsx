import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const ExpenseCard = ({ expense, onEdit, onView, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'transport': 'Car',
      'utilities': 'Zap',
      'inventory': 'Package',
      'marketing': 'Megaphone',
      'professional-services': 'Briefcase',
      'office-supplies': 'Paperclip',
      'meals': 'Coffee',
      'fuel': 'Fuel',
      'rent': 'Home',
      'insurance': 'Shield',
      'maintenance': 'Wrench',
      'communication': 'Phone',
      'other': 'MoreHorizontal'
    };
    return iconMap[category] || 'MoreHorizontal';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'transport': 'text-blue-600 bg-blue-50',
      'utilities': 'text-yellow-600 bg-yellow-50',
      'inventory': 'text-purple-600 bg-purple-50',
      'marketing': 'text-pink-600 bg-pink-50',
      'professional-services': 'text-indigo-600 bg-indigo-50',
      'office-supplies': 'text-gray-600 bg-gray-50',
      'meals': 'text-orange-600 bg-orange-50',
      'fuel': 'text-red-600 bg-red-50',
      'rent': 'text-green-600 bg-green-50',
      'insurance': 'text-cyan-600 bg-cyan-50',
      'maintenance': 'text-amber-600 bg-amber-50',
      'communication': 'text-teal-600 bg-teal-50',
      'other': 'text-gray-600 bg-gray-50'
    };
    return colorMap[category] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(expense.category)}`}>
            <Icon 
              name={getCategoryIcon(expense.category)} 
              size={20}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary truncate">
              {expense.description}
            </h3>
            <p className="text-sm text-text-secondary capitalize">
              {expense.category.replace('-', ' ')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-text-primary">
            {formatCurrency(expense.amount)}
          </div>
          <div className="text-sm text-text-secondary">
            {formatDate(expense.date)}
          </div>
        </div>
      </div>

      {/* Receipt Indicator */}
      {expense.hasReceipt && (
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Paperclip" size={16} color="var(--color-text-secondary)" />
          <span className="text-sm text-text-secondary">Receipt attached</span>
        </div>
      )}

      {/* Payment Method */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={expense.paymentMethod === 'cash' ? 'Banknote' : expense.paymentMethod === 'bank-transfer' ? 'CreditCard' : 'Smartphone'} 
            size={16} 
            color="var(--color-text-secondary)" 
          />
          <span className="text-sm text-text-secondary capitalize">
            {expense.paymentMethod.replace('-', ' ')}
          </span>
        </div>
        {expense.vendor && (
          <span className="text-sm text-text-secondary">
            {expense.vendor}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(expense)}
          iconName="Eye"
          iconSize={16}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(expense)}
          iconName="Edit"
          iconSize={16}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(expense)}
          iconName="Trash2"
          iconSize={16}
          className="text-error-600 hover:text-error-700 hover:bg-error-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ExpenseCard;