import React from 'react';
import Icon from '../../../components/AppIcon';

const BusinessInsights = ({ insights, subscriptionTier }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getInsightIcon = (type) => {
    const icons = {
      'growth': 'TrendingUp',
      'warning': 'AlertTriangle',
      'opportunity': 'Target',
      'achievement': 'Award',
      'recommendation': 'Lightbulb'
    };
    return icons[type] || 'Info';
  };

  const getInsightColor = (type) => {
    const colors = {
      'growth': 'text-success-600 bg-success-50',
      'warning': 'text-warning-600 bg-warning-50',
      'opportunity': 'text-info-600 bg-info-50',
      'achievement': 'text-accent-600 bg-accent-50',
      'recommendation': 'text-primary-600 bg-primary-50'
    };
    return colors[type] || 'text-text-secondary bg-background-secondary';
  };

  const isPremiumFeature = subscriptionTier === 'free';

  if (isPremiumFeature) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Business Insights</h3>
            <div className="flex items-center space-x-1 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
              <Icon name="Crown" size={12} />
              <span>Pro</span>
            </div>
          </div>
          <div className="text-center py-8 space-y-3">
            <Icon name="Lightbulb" size={48} color="var(--color-text-tertiary)" />
            <p className="text-text-secondary">
              Get AI-powered business insights with Pro plan
            </p>
            <p className="text-sm text-text-tertiary">
              Discover growth opportunities, identify trends, and get actionable recommendations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Business Insights</h3>
        <div className="flex items-center space-x-1 text-xs text-text-secondary">
          <Icon name="Brain" size={14} />
          <span>AI Powered</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-background-secondary">
            <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
              <Icon name={getInsightIcon(insight.type)} size={16} />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold text-text-primary">
                {insight.title}
              </h4>
              <p className="text-sm text-text-secondary">
                {insight.description}
              </p>
              {insight.value && (
                <div className="text-sm font-medium text-primary-600">
                  {typeof insight.value === 'number' ? formatCurrency(insight.value) : insight.value}
                </div>
              )}
              {insight.action && (
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  {insight.action} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success-600">
              {insights.filter(i => i.type === 'growth').length}
            </div>
            <div className="text-xs text-text-secondary">Growth Areas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning-600">
              {insights.filter(i => i.type === 'warning').length}
            </div>
            <div className="text-xs text-text-secondary">Attention Needed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-info-600">
              {insights.filter(i => i.type === 'opportunity').length}
            </div>
            <div className="text-xs text-text-secondary">Opportunities</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;