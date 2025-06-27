import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparisonCards = ({ currentPlan, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState('weekly');

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      description: 'Perfect for getting started',
      icon: 'User',
      color: 'gray',
      pricing: {
        weekly: '₦0',
        monthly: '₦0',
        yearly: '₦0'
      },
      features: [
        '5 Invoices per month',
        '10 Expenses per month',
        'Basic client management',
        'Email support',
        'Mobile responsive'
      ],
      limitations: [
        'Limited invoice templates',
        'Basic reporting only',
        'No team collaboration'
      ]
    },
    {
      id: 'silver',
      name: 'Silver Plan',
      description: 'Best for growing businesses',
      icon: 'Star',
      color: 'primary',
      popular: true,
      pricing: {
        weekly: '₦1,200',
        monthly: '₦4,500',
        yearly: '₦48,000'
      },
      savings: {
        monthly: '₦300',
        yearly: '₦14,400'
      },
      features: [
        'Unlimited invoices',
        'Unlimited expenses',
        'Advanced reporting',
        'Custom invoice templates',
        'Team collaboration',
        'Priority support',
        'Data export',
        'Payment tracking'
      ],
      limitations: []
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      description: 'Enterprise features coming soon',
      icon: 'Crown',
      color: 'accent',
      comingSoon: true,
      pricing: {
        weekly: '₦2,500',
        monthly: '₦9,000',
        yearly: '₦96,000'
      },
      savings: {
        monthly: '₦1,000',
        yearly: '₦24,000'
      },
      features: [
        'Everything in Silver',
        'AI Voice Commands',
        'Advanced Analytics',
        'Multi-location support',
        'API Access',
        'White-label options',
        'Dedicated support'
      ],
      limitations: []
    }
  ];

  const getColorClasses = (color, variant = 'default') => {
    const colorMap = {
      gray: {
        default: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        button: 'primary'
      },
      primary: {
        default: 'text-primary-600',
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        button: 'primary'
      },
      accent: {
        default: 'text-accent-600',
        bg: 'bg-accent-50',
        border: 'border-accent-200',
        button: 'warning'
      }
    };
    return colorMap[color]?.[variant] || colorMap.gray[variant];
  };

  const formatPrice = (price) => {
    if (price === '₦0') return 'Free';
    return price;
  };

  return (
    <div className="space-y-6">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-surface border border-border rounded-lg p-1 flex">
          {['weekly', 'monthly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                billingCycle === cycle
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              {cycle === 'yearly' && (
                <span className="ml-1 text-xs bg-success-100 text-success-800 px-1 rounded">
                  Save 20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative card p-6 transition-all duration-200 hover:shadow-lg
              ${plan.popular ? 'ring-2 ring-primary' : ''}
              ${plan.comingSoon ? 'opacity-75' : ''}
              ${currentPlan === plan.id ? getColorClasses(plan.color, 'bg') + ' ' + getColorClasses(plan.color, 'border') + ' border-2' : ''}
            `}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            {/* Coming Soon Badge */}
            {plan.comingSoon && (
              <div className="absolute -top-3 right-4">
                <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getColorClasses(plan.color, 'bg')} flex items-center justify-center`}>
                <Icon 
                  name={plan.icon} 
                  size={32} 
                  color={`var(--color-${plan.color === 'gray' ? 'text-secondary' : plan.color + '-600'})`} 
                />
              </div>
              <h3 className={`text-xl font-bold ${getColorClasses(plan.color)}`}>
                {plan.name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {plan.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="text-center mb-6">
              <div className={`text-3xl font-bold ${getColorClasses(plan.color)}`}>
                {formatPrice(plan.pricing[billingCycle])}
              </div>
              {plan.pricing[billingCycle] !== '₦0' && (
                <div className="text-sm text-text-secondary">
                  per {billingCycle.slice(0, -2)}
                </div>
              )}
              {plan.savings?.[billingCycle] && billingCycle !== 'weekly' && (
                <div className="text-sm text-success-600 font-medium mt-1">
                  Save {plan.savings[billingCycle]} per year
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon 
                    name="Check" 
                    size={16} 
                    color="var(--color-success-500)" 
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-text-primary">{feature}</span>
                </div>
              ))}
              
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon 
                    name="X" 
                    size={16} 
                    color="var(--color-text-tertiary)" 
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-text-tertiary">{limitation}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              {currentPlan === plan.id ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : plan.comingSoon ? (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              ) : (
                <Button 
                  variant={getColorClasses(plan.color, 'button')}
                  className="w-full"
                  onClick={() => onSelectPlan(plan.id, billingCycle)}
                >
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade'} to {plan.name}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods Info */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-info-600)" className="mt-0.5" />
          <div>
            <h4 className="font-medium text-info-800 mb-1">Payment Information</h4>
            <p className="text-sm text-info-700">
              We accept all major Nigerian payment methods through Paystack. 
              Weekly billing helps manage cash flow for growing businesses. 
              Cancel anytime with no hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparisonCards;