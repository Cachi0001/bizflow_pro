import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success-600';
    if (changeType === 'negative') return 'text-error-600';
    return 'text-text-secondary';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  const displayValue = typeof value === 'number' && title.toLowerCase().includes('revenue') || title.toLowerCase().includes('expense') 
    ? formatCurrency(value) 
    : formatNumber(value);

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon 
            name={icon} 
            size={24} 
            color={`var(--color-${color}-600)`}
          />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-text-primary">
          {displayValue}
        </h3>
        <p className="text-sm text-text-secondary">
          {title}
        </p>
      </div>
      
      {change !== undefined && (
        <div className="mt-3 text-xs text-text-secondary">
          <span className={getChangeColor()}>
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{Math.abs(change)}%
          </span>
          {' '}from last month
        </div>
      )}
    </div>
  );
};

export default MetricsCard;