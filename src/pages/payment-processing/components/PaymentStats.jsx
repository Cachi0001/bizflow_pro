import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStats = ({ payments = [], subscriptionTier = 'free' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const calculateStats = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const completedPayments = payments.filter(p => p.status !== 'failed');
    const thisMonthPayments = completedPayments.filter(p => 
      new Date(p.paymentDate || p.timestamp) >= thisMonth
    );
    const lastMonthPayments = completedPayments.filter(p => {
      const date = new Date(p.paymentDate || p.timestamp);
      return date >= lastMonth && date <= lastMonthEnd;
    });

    const totalAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonthAmount = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const lastMonthAmount = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0);

    const monthlyGrowth = lastMonthAmount > 0 
      ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
      : 0;

    // Payment method breakdown
    const methodBreakdown = completedPayments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, {});

    return {
      totalAmount,
      totalCount: completedPayments.length,
      thisMonthAmount,
      thisMonthCount: thisMonthPayments.length,
      monthlyGrowth,
      methodBreakdown,
      averagePayment: completedPayments.length > 0 ? totalAmount / completedPayments.length : 0
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Payments',
      value: formatCurrency(stats.totalAmount),
      subtitle: `${stats.totalCount} transactions`,
      icon: 'TrendingUp',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: null
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.thisMonthAmount),
      subtitle: `${stats.thisMonthCount} payments`,
      icon: 'Calendar',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: stats.monthlyGrowth
    },
    {
      title: 'Average Payment',
      value: formatCurrency(stats.averagePayment),
      subtitle: 'Per transaction',
      icon: 'BarChart3',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      change: null
    }
  ];

  const getMethodConfig = (method) => {
    const configs = {
      cash: { name: 'Cash', icon: 'Banknote', color: 'text-success-600' },
      bank_transfer: { name: 'Bank Transfer', icon: 'Building2', color: 'text-primary-600' },
      paystack: { name: 'Card Payment', icon: 'CreditCard', color: 'text-accent-600' },
      credit: { name: 'Credit', icon: 'Clock', color: 'text-warning-600' }
    };
    return configs[method] || { name: method, icon: 'Receipt', color: 'text-text-secondary' };
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-text-secondary">
                  {stat.subtitle}
                </p>
                
                {stat.change !== null && (
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.change >= 0 ? 'text-success-600' : 'text-error-600'
                  }`}>
                    <Icon 
                      name={stat.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                      size={16} 
                      className="mr-1" 
                    />
                    <span>
                      {Math.abs(stat.change).toFixed(1)}% vs last month
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon 
                  name={stat.icon} 
                  size={24} 
                  color={`var(--color-${stat.color.split('-')[0]}-600)`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method Breakdown */}
      {Object.keys(stats.methodBreakdown).length > 0 && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Payment Methods Breakdown
          </h3>
          
          <div className="space-y-3">
            {Object.entries(stats.methodBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([method, amount]) => {
                const config = getMethodConfig(method);
                const percentage = (amount / stats.totalAmount) * 100;
                
                return (
                  <div key={method} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <Icon 
                        name={config.icon} 
                        size={16} 
                        color={`var(--color-${config.color.split('-')[0]}-600)`}
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {config.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary min-w-0">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-xs text-text-secondary min-w-0">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Premium Features Teaser */}
      {subscriptionTier === 'free' && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Icon name="Crown" size={24} color="var(--color-accent-600)" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-accent-800 mb-2">
                Unlock Advanced Payment Analytics
              </h4>
              <p className="text-sm text-accent-700 mb-3">
                Get detailed payment trends, customer payment patterns, and automated payment reminders with Silver tier.
              </p>
              <ul className="text-sm text-accent-700 space-y-1">
                <li>• Payment trend analysis</li>
                <li>• Customer payment behavior insights</li>
                <li>• Automated payment reminders</li>
                <li>• Export payment reports</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStats;