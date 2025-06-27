import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentPlanCard = ({ currentPlan, usage, onUpgrade }) => {
  const planConfig = {
    free: {
      name: 'Free Plan',
      price: '₦0',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: 'User'
    },
    silver: {
      name: 'Silver Plan',
      price: '₦1,200/week',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      icon: 'Star'
    },
    gold: {
      name: 'Gold Plan',
      price: '₦2,500/week',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
      icon: 'Crown'
    }
  };

  const config = planConfig[currentPlan] || planConfig.free;
  const isFree = currentPlan === 'free';

  return (
    <div className={`card p-6 ${config.bgColor} ${config.borderColor} border-2`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}>
            <Icon name={config.icon} size={24} color={`var(--color-${currentPlan === 'free' ? 'text-secondary' : currentPlan === 'silver' ? 'primary-600' : 'accent-600'})`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${config.color}`}>{config.name}</h3>
            <p className="text-sm text-text-secondary">Current Plan</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${config.color}`}>{config.price}</div>
          {!isFree && (
            <div className="text-sm text-text-secondary">Auto-renews weekly</div>
          )}
        </div>
      </div>

      {/* Usage Statistics for Free Plan */}
      {isFree && (
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-primary">Invoices Used</span>
              <span className="font-medium">{usage.invoices}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(usage.invoices / 5) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-primary">Expenses Tracked</span>
              <span className="font-medium">{usage.expenses}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(usage.expenses / 10) * 100}%` }}
              />
            </div>
          </div>

          {(usage.invoices >= 4 || usage.expenses >= 8) && (
            <div className="flex items-center space-x-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning-600)" />
              <span className="text-sm text-warning-700">
                You're approaching your monthly limit. Consider upgrading!
              </span>
            </div>
          )}
        </div>
      )}

      {/* Unlimited Features for Paid Plans */}
      {!isFree && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="Check" size={16} />
            <span>Unlimited Invoices</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="Check" size={16} />
            <span>Unlimited Expense Tracking</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <Icon name="Check" size={16} />
            <span>Advanced Reporting</span>
          </div>
          {currentPlan === 'gold' && (
            <div className="flex items-center space-x-2 text-sm text-success-600">
              <Icon name="Check" size={16} />
              <span>AI Voice Commands</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {isFree && (
          <Button 
            variant="primary" 
            className="flex-1"
            onClick={() => onUpgrade('silver')}
            iconName="ArrowUp"
          >
            Upgrade Now
          </Button>
        )}
        <Button 
          variant="outline" 
          className={isFree ? "flex-1" : "w-full"}
          onClick={() => console.log('Manage plan')}
        >
          Manage Plan
        </Button>
      </div>
    </div>
  );
};

export default CurrentPlanCard;