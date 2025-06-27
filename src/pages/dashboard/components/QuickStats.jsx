import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const quickStatsData = [
    {
      label: 'Today\'s Sales',
      value: formatCurrency(stats.todaySales || 0),
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoices || 0,
      icon: 'Clock',
      color: 'warning'
    },
    {
      label: 'Overdue Payments',
      value: stats.overduePayments || 0,
      icon: 'AlertTriangle',
      color: 'error'
    },
    {
      label: 'This Week',
      value: formatCurrency(stats.weeklyRevenue || 0),
      icon: 'Calendar',
      color: 'info'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStatsData.map((stat, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
              <Icon 
                name={stat.icon} 
                size={20} 
                color={`var(--color-${stat.color}-600)`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-text-primary truncate">
                {stat.value}
              </p>
              <p className="text-xs text-text-secondary">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;