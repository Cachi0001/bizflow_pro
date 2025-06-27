import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SubscriptionTierIndicator = ({ tier = 'free', onUpgrade }) => {
  const tierConfig = {
    free: {
      name: 'Free Plan',
      color: 'text-text-secondary',
      bgColor: 'bg-gray-100',
      icon: 'User',
      features: ['5 Invoices/month', 'Basic expense tracking', 'Email support'],
      usageLimit: 5,
      currentUsage: 3,
      upgradeText: 'Upgrade to Pro'
    },
    premium: {
      name: 'Pro Plan',
      color: 'text-accent-800',
      bgColor: 'bg-accent-100',
      icon: 'Crown',
      features: ['Unlimited invoices', 'Advanced analytics', 'Priority support'],
      upgradeText: 'Manage Plan'
    }
  };

  const config = tierConfig[tier] || tierConfig.free;
  const isFree = tier === 'free';

  return (
    <div className="space-y-3">
      {/* Tier Header */}
      <div className={`flex items-center p-3 rounded-lg ${config.bgColor}`}>
        <div className="flex items-center space-x-2 flex-1">
          <Icon 
            name={config.icon} 
            size={16} 
            color={isFree ? 'var(--color-text-secondary)' : 'var(--color-accent-800)'}
          />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.name}
          </span>
        </div>
        {isFree && (
          <div className="text-xs text-text-secondary">
            {config.currentUsage}/{config.usageLimit}
          </div>
        )}
      </div>

      {/* Usage Progress (Free tier only) */}
      {isFree && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Invoices used</span>
            <span>{config.currentUsage}/{config.usageLimit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(config.currentUsage / config.usageLimit) * 100}%` }}
            />
          </div>
          {config.currentUsage >= config.usageLimit * 0.8 && (
            <div className="flex items-center space-x-1 text-xs text-warning-700">
              <Icon name="AlertTriangle" size={12} />
              <span>Approaching limit</span>
            </div>
          )}
        </div>
      )}

      {/* Features List */}
      <div className="space-y-1">
        {config.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs text-text-secondary">
            <Icon 
              name="Check" 
              size={12} 
              color="var(--color-success-500)" 
            />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Upgrade/Manage Button */}
      <Button
        variant={isFree ? "primary" : "outline"}
        size="sm"
        className="w-full"
        onClick={onUpgrade}
      >
        {isFree && (
          <Icon name="ArrowUp" size={16} className="mr-2" />
        )}
        {config.upgradeText}
      </Button>

      {/* Additional Info for Free Users */}
      {isFree && (
        <div className="text-xs text-text-secondary text-center">
          Unlock unlimited features with Pro
        </div>
      )}
    </div>
  );
};

export default SubscriptionTierIndicator;