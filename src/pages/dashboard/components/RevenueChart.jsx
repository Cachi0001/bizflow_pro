import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, subscriptionTier }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-sm text-primary-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-secondary-600">
            Expenses: {formatCurrency(payload[1]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (subscriptionTier === 'free') {
    return (
      <div className="card p-6 relative">
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="var(--color-accent-600)"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Advanced Analytics
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Upgrade to Silver to unlock detailed revenue trends and insights
            </p>
            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
        
        <div className="blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Revenue Trends</h3>
            <div className="text-sm text-text-secondary">Last 6 months</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-primary-600)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary-600)', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="var(--color-secondary-600)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-secondary-600)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Revenue Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <span className="text-sm text-text-secondary">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
            <span className="text-sm text-text-secondary">Expenses</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--color-primary-600)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary-600)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'var(--color-primary-600)' }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="var(--color-secondary-600)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-secondary-600)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'var(--color-secondary-600)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;