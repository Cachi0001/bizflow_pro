import React from 'react';
import Icon from '../../../components/AppIcon';

const ExpenseStats = ({ expenses, subscriptionTier = 'free' }) => {
  const calculateStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    });

    const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalLastMonth = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyChange = lastMonthExpenses.length > 0 
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 
      : 0;

    // Category breakdown
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryTotals).reduce((max, [category, amount]) => 
      amount > max.amount ? { category, amount } : max, 
      { category: 'none', amount: 0 }
    );

    return {
      totalThisMonth,
      totalLastMonth,
      monthlyChange,
      totalExpenses: expenses.length,
      currentMonthCount: currentMonthExpenses.length,
      topCategory,
      averageExpense: expenses.length > 0 ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-error-600';
    if (value < 0) return 'text-success-600';
    return 'text-text-secondary';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return 'TrendingUp';
    if (value < 0) return 'TrendingDown';
    return 'Minus';
  };

  const statCards = [
    {
      title: 'This Month',
      value: formatCurrency(stats.totalThisMonth),
      change: formatPercentage(stats.monthlyChange),
      changeColor: getChangeColor(stats.monthlyChange),
      icon: 'Calendar',
      iconColor: 'text-primary-600',
      iconBg: 'bg-primary-50'
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses.toString(),
      subtitle: `${stats.currentMonthCount} this month`,
      icon: 'Receipt',
      iconColor: 'text-secondary-600',
      iconBg: 'bg-secondary-50'
    },
    {
      title: 'Top Category',
      value: stats.topCategory.category.replace('-', ' '),
      subtitle: formatCurrency(stats.topCategory.amount),
      icon: 'BarChart3',
      iconColor: 'text-accent-600',
      iconBg: 'bg-accent-50'
    },
    {
      title: 'Average Expense',
      value: formatCurrency(stats.averageExpense),
      subtitle: 'Per transaction',
      icon: 'Calculator',
      iconColor: 'text-info-600',
      iconBg: 'bg-info-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
              <Icon 
                name={stat.icon} 
                size={20} 
                className={stat.iconColor}
              />
            </div>
            {stat.change && (
              <div className={`flex items-center space-x-1 ${stat.changeColor}`}>
                <Icon 
                  name={getChangeIcon(stats.monthlyChange)} 
                  size={16} 
                />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">
              {stat.title}
            </h3>
            <p className="text-xl font-semibold text-text-primary capitalize">
              {stat.value}
            </p>
            {stat.subtitle && (
              <p className="text-sm text-text-secondary mt-1">
                {stat.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Premium Feature Teaser */}
      {subscriptionTier === 'free' && (
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg border border-accent-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <Icon name="Crown" size={20} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">
                    Advanced Analytics
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Get detailed spending insights, budget tracking, and trend analysis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-accent-600">
                  Pro Feature
                </div>
                <div className="text-xs text-text-secondary">
                  Upgrade to unlock
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseStats;