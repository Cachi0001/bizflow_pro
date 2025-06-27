import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionStatus = ({ subscriptionTier, usage, onUpgrade }) => {
  const tierConfig = {
    free: {
      name: 'Free Plan',
      color: 'text-text-secondary',
      bgColor: 'bg-gray-100',
      icon: 'User',
      limits: {
        invoices: 5,
        expenses: 10
      }
    },
    premium: {
      name: 'Silver Plan',
      color: 'text-accent-800',
      bgColor: 'bg-accent-100',
      icon: 'Crown',
      limits: {
        invoices: 'Unlimited',
        expenses: 'Unlimited'
      }
    }
  };

  const config = tierConfig[subscriptionTier] || tierConfig.free;
  const isFree = subscriptionTier === 'free';

  const getUsagePercentage = (used, limit) => {
    if (limit === 'Unlimited') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-error-500';
    if (percentage >= 70) return 'bg-warning-500';
    return 'bg-primary-500';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon 
              name={config.icon} 
              size={20} 
              color={isFree ? 'var(--color-text-secondary)' : 'var(--color-accent-800)'}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {config.name}
            </h3>
            <p className="text-sm text-text-secondary">
              Current subscription
            </p>
          </div>
        </div>
        
        {isFree && (
          <Button
            variant="primary"
            size="sm"
            onClick={onUpgrade}
            iconName="ArrowUp"
            iconPosition="left"
          >
            Upgrade
          </Button>
        )}
      </div>

      {isFree && (
        <div className="space-y-4">
          {/* Invoice Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Invoices</span>
              <span className="text-text-primary font-medium">
                {usage.invoices}/{config.limits.invoices}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usage.invoices, config.limits.invoices))}`}
                style={{ width: `${getUsagePercentage(usage.invoices, config.limits.invoices)}%` }}
              />
            </div>
            {usage.invoices >= config.limits.invoices * 0.8 && (
              <div className="flex items-center space-x-1 text-xs text-warning-700">
                <Icon name="AlertTriangle" size={12} />
                <span>Approaching limit</span>
              </div>
            )}
          </div>

          {/* Expense Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Expenses</span>
              <span className="text-text-primary font-medium">
                {usage.expenses}/{config.limits.expenses}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usage.expenses, config.limits.expenses))}`}
                style={{ width: `${getUsagePercentage(usage.expenses, config.limits.expenses)}%` }}
              />
            </div>
            {usage.expenses >= config.limits.expenses * 0.8 && (
              <div className="flex items-center space-x-1 text-xs text-warning-700">
                <Icon name="AlertTriangle" size={12} />
                <span>Approaching limit</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-secondary text-center">
              Upgrade to Silver for unlimited invoices and advanced features
            </p>
          </div>
        </div>
      )}

      {!isFree && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="CheckCircle" size={16} />
            <span>Unlimited invoices & expenses</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="CheckCircle" size={16} />
            <span>Advanced analytics & reports</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="CheckCircle" size={16} />
            <span>AI voice commands</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="CheckCircle" size={16} />
            <span>Priority support</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;