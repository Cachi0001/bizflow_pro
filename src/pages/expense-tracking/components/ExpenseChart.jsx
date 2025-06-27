import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpenseChart = ({ expenses, subscriptionTier = 'free' }) => {
  const [chartType, setChartType] = useState('monthly');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthlyData = () => {
    const monthlyTotals = {};
    const last6Months = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      last6Months.push({ key: monthKey, name: monthName });
      monthlyTotals[monthKey] = 0;
    }

    // Calculate totals
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyTotals.hasOwnProperty(monthKey)) {
        monthlyTotals[monthKey] += expense.amount;
      }
    });

    return last6Months.map(month => ({
      name: month.name,
      amount: monthlyTotals[month.key]
    }));
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      const category = expense.category.replace('-', ' ');
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const getWeeklyData = () => {
    const weeklyTotals = {};
    const last4Weeks = [];
    
    // Get last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      const weekName = `Week ${4 - i}`;
      last4Weeks.push({ key: weekKey, name: weekName });
      weeklyTotals[weekKey] = 0;
    }

    // Calculate totals
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const weekStart = new Date(expenseDate);
      weekStart.setDate(expenseDate.getDate() - expenseDate.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (weeklyTotals.hasOwnProperty(weekKey)) {
        weeklyTotals[weekKey] += expense.amount;
      }
    });

    return last4Weeks.map(week => ({
      name: week.name,
      amount: weeklyTotals[week.key]
    }));
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const weeklyData = getWeeklyData();

  const COLORS = [
    '#4CAF50', '#FF9800', '#2196F3', '#9C27B0', 
    '#F44336', '#00BCD4', '#FFEB3B', '#795548'
  ];

  const chartTypes = [
    { key: 'monthly', label: 'Monthly Trend', icon: 'BarChart3' },
    { key: 'category', label: 'By Category', icon: 'PieChart' },
    { key: 'weekly', label: 'Weekly Trend', icon: 'TrendingUp' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="var(--color-primary-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'category':
        return (
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-2">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-text-primary">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrency(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--color-primary-500)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary-500)', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: 'var(--color-primary-500)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (subscriptionTier === 'free') {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent-100 rounded-full flex items-center justify-center">
            <Icon name="Crown" size={32} className="text-accent-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Advanced Charts & Analytics
            </h3>
            <p className="text-text-secondary mb-4">
              Visualize your spending patterns with interactive charts, category breakdowns, and trend analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                Monthly Trends
              </span>
              <span className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                Category Analysis
              </span>
              <span className="px-3 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Budget Tracking
              </span>
            </div>
            <Button
              variant="primary"
              iconName="ArrowUp"
              iconSize={16}
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Expense Analytics
        </h3>
        <div className="flex items-center space-x-2">
          {chartTypes.map(type => (
            <Button
              key={type.key}
              variant={chartType === type.key ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartType(type.key)}
              iconName={type.icon}
              iconSize={16}
            >
              <span className="hidden sm:inline">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full">
        {renderChart()}
      </div>

      {/* Chart Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {expenses.length}
            </div>
            <div className="text-sm text-text-secondary">
              Total Expenses
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </div>
            <div className="text-sm text-text-secondary">
              Total Amount
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {categoryData.length}
            </div>
            <div className="text-sm text-text-secondary">
              Categories Used
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;