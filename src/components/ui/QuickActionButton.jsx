import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionButton = ({ subscriptionTier = 'free' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'New Invoice',
      icon: 'FileText',
      action: () => handleAction('/invoice-management', 'create-invoice'),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      subscriptionTier: 'free'
    },
    {
      label: 'Add Expense',
      icon: 'Receipt',
      action: () => handleAction('/expense-tracking', 'add-expense'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      subscriptionTier: 'free'
    },
    {
      label: 'Record Payment',
      icon: 'CreditCard',
      action: () => handleAction('/payment-processing', 'record-payment'),
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      subscriptionTier: 'premium'
    },
    {
      label: 'Generate Report',
      icon: 'BarChart3',
      action: () => handleAction('/reports-and-analytics', 'generate-report'),
      color: 'text-info-600',
      bgColor: 'bg-info-50',
      subscriptionTier: 'premium'
    }
  ];

  const handleAction = (path, actionType) => {
    console.log(`Quick action: ${actionType}`);
    navigate(path);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const accessibleActions = quickActions.filter(action => 
    action.subscriptionTier === 'free' || subscriptionTier === 'premium'
  );

  const getContextualAction = () => {
    const path = location.pathname;
    switch (path) {
      case '/invoice-management':
        return quickActions[0]; // New Invoice
      case '/expense-tracking':
        return quickActions[1]; // Add Expense
      case '/payment-processing':
        return quickActions[2]; // Record Payment
      case '/reports-and-analytics':
        return quickActions[3]; // Generate Report
      default:
        return quickActions[0]; // Default to New Invoice
    }
  };

  const primaryAction = getContextualAction();
  const isAccessible = primaryAction.subscriptionTier === 'free' || subscriptionTier === 'premium';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-1000"
          onClick={handleClose}
        />
      )}

      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-1100 space-y-2 animate-fade-in">
          {accessibleActions.slice().reverse().map((action, index) => (
            <div
              key={action.label}
              className="flex items-center space-x-3 animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-sm font-medium text-text-primary bg-surface px-3 py-2 rounded-lg shadow-md border border-border whitespace-nowrap">
                {action.label}
              </span>
              <Button
                variant="ghost"
                size="md"
                className={`
                  w-12 h-12 rounded-full shadow-lg border border-border
                  ${action.bgColor} ${action.color}
                  hover:scale-105 transition-all duration-200
                  touch-target
                `}
                onClick={action.action}
                aria-label={action.label}
              >
                <Icon name={action.icon} size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <div className="fixed bottom-4 right-4 z-1100">
        <Button
          variant="primary"
          size="lg"
          className={`
            w-14 h-14 rounded-full shadow-lg
            btn-hover-scale
            touch-target
            ${!isAccessible ? 'opacity-60' : ''}
          `}
          onClick={isAccessible ? handleToggle : () => navigate('/subscription-management')}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
        >
          <Icon 
            name={isOpen ? "X" : "Plus"} 
            size={24}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
        </Button>

        {/* Premium Badge for Restricted Actions */}
        {!isAccessible && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Crown" size={12} color="white" />
          </div>
        )}
      </div>

      {/* Quick Action Hint */}
      {!isOpen && isAccessible && (
        <div className="fixed bottom-20 right-4 z-1000 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-text-primary text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {primaryAction.label}
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActionButton;