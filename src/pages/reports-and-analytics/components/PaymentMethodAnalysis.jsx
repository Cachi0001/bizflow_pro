import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const PaymentMethodAnalysis = ({ data }) => {
  const COLORS = {
    'Cash': 'var(--color-success-500)',
    'Bank Transfer': 'var(--color-primary)',
    'Card Payment': 'var(--color-accent)',
    'Mobile Money': 'var(--color-info-500)',
    'Credit': 'var(--color-warning-500)'
  };

  const ICONS = {
    'Cash': 'Banknote',
    'Bank Transfer': 'Building2',
    'Card Payment': 'CreditCard',
    'Mobile Money': 'Smartphone',
    'Credit': 'Clock'
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            {formatCurrency(data.value)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Methods</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || 'var(--color-text-tertiary)'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with Details */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background-secondary">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[item.name] || 'var(--color-text-tertiary)' }}
                />
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={ICONS[item.name] || 'DollarSign'} 
                    size={16} 
                    color="var(--color-text-secondary)" 
                  />
                  <span className="text-sm font-medium text-text-primary">{item.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-text-primary">
                  {formatCurrency(item.value)}
                </div>
                <div className="text-xs text-text-secondary">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Total Payments</span>
          <span className="text-lg font-bold text-text-primary">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodAnalysis;