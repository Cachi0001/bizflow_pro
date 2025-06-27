import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ClientAnalytics = ({ data, subscriptionTier }) => {
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
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-1">{label}</p>
          <p className="text-sm text-primary-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-text-secondary">
            Invoices: {payload[0].payload.invoiceCount}
          </p>
        </div>
      );
    }
    return null;
  };

  const isPremiumFeature = subscriptionTier === 'free';

  if (isPremiumFeature) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Client Analytics</h3>
            <div className="flex items-center space-x-1 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
              <Icon name="Crown" size={12} />
              <span>Pro</span>
            </div>
          </div>
          <div className="text-center py-8 space-y-3">
            <Icon name="BarChart3" size={48} color="var(--color-text-tertiary)" />
            <p className="text-text-secondary">
              Unlock detailed client analytics with Pro plan
            </p>
            <p className="text-sm text-text-tertiary">
              Track client profitability, payment patterns, and relationship metrics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Top Clients by Revenue</h3>
        <div className="flex items-center space-x-1 text-xs text-text-secondary">
          <Icon name="Users" size={14} />
          <span>{data.length} clients</span>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientAnalytics;