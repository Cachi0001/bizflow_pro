import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import SubscriptionTierIndicator from './SubscriptionTierIndicator';

const NavigationSidebar = ({ isOpen, onClose, subscriptionTier = 'free' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      subscriptionTier: 'free'
    },
    {
      label: 'Invoices',
      path: '/invoice-management',
      icon: 'FileText',
      subscriptionTier: 'free'
    },
    {
      label: 'Expenses',
      path: '/expense-tracking',
      icon: 'Receipt',
      subscriptionTier: 'free'
    },
    {
      label: 'Payments',
      path: '/payment-processing',
      icon: 'CreditCard',
      subscriptionTier: 'premium'
    },
    {
      label: 'Reports',
      path: '/reports-and-analytics',
      icon: 'BarChart3',
      subscriptionTier: 'premium'
    },
    {
      label: 'Subscription',
      path: '/subscription-management',
      icon: 'Crown',
      subscriptionTier: 'free'
    }
  ];

  const handleNavigation = (path, requiredTier) => {
    if (requiredTier === 'premium' && subscriptionTier === 'free') {
      // Handle premium feature access
      console.log('Premium feature - redirect to upgrade');
      navigate('/subscription-management');
      return;
    }
    
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAccessible = (requiredTier) => {
    return requiredTier === 'free' || subscriptionTier === 'premium';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-1000 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 bottom-0 w-60 bg-surface border-r border-border z-1100
          transform transition-transform duration-300 ease-smooth
          lg:translate-x-0 lg:z-1000
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          scrollbar-thin overflow-y-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              const accessible = isAccessible(item.subscriptionTier);
              
              return (
                <div key={item.path} className="relative">
                  <button
                    onClick={() => handleNavigation(item.path, item.subscriptionTier)}
                    className={`
                      nav-item w-full text-left
                      ${active ? 'active' : ''}
                      ${!accessible ? 'opacity-60' : ''}
                      touch-target
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className="mr-3 flex-shrink-0"
                      color={active ? 'var(--color-primary-800)' : 'var(--color-text-secondary)'}
                    />
                    <span className="flex-1">{item.label}</span>
                    
                    {/* Premium Badge */}
                    {item.subscriptionTier === 'premium' && subscriptionTier === 'free' && (
                      <div className="ml-2 px-2 py-1 bg-accent-100 text-accent-800 text-xs font-medium rounded-full">
                        Pro
                      </div>
                    )}
                    
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Subscription Tier Indicator */}
          <div className="p-4 border-t border-border">
            <SubscriptionTierIndicator 
              tier={subscriptionTier}
              onUpgrade={() => navigate('/subscription-management')}
            />
          </div>

          {/* Help & Support */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start touch-target"
              onClick={() => console.log('Help clicked')}
            >
              <Icon name="HelpCircle" size={20} className="mr-3" />
              Help & Support
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;