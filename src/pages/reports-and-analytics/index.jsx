import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import ExpenseBreakdown from './components/ExpenseBreakdown';
import ClientAnalytics from './components/ClientAnalytics';
import PaymentMethodAnalysis from './components/PaymentMethodAnalysis';
import ReportFilters from './components/ReportFilters';
import BusinessInsights from './components/BusinessInsights';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ReportsAndAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // 'free' or 'premium'
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    reportType: 'overview',
    client: ''
  });

  // Mock data for KPIs
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₦2,450,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Total Expenses',
      value: '₦890,000',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'Receipt',
      color: 'warning'
    },
    {
      title: 'Net Profit',
      value: '₦1,560,000',
      change: '+18.3%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      title: 'Active Clients',
      value: '47',
      change: '+3',
      changeType: 'positive',
      icon: 'Users',
      color: 'info'
    }
  ];

  // Mock data for revenue chart
  const revenueData = [
    { period: 'Jan', revenue: 1800000, expenses: 650000 },
    { period: 'Feb', revenue: 2100000, expenses: 720000 },
    { period: 'Mar', revenue: 1950000, expenses: 680000 },
    { period: 'Apr', revenue: 2300000, expenses: 780000 },
    { period: 'May', revenue: 2150000, expenses: 750000 },
    { period: 'Jun', revenue: 2450000, expenses: 890000 }
  ];

  // Mock data for expense breakdown
  const expenseData = [
    { name: 'Office Rent', value: 250000, percentage: 28.1 },
    { name: 'Staff Salaries', value: 320000, percentage: 36.0 },
    { name: 'Utilities', value: 85000, percentage: 9.6 },
    { name: 'Marketing', value: 120000, percentage: 13.5 },
    { name: 'Equipment', value: 65000, percentage: 7.3 },
    { name: 'Others', value: 50000, percentage: 5.6 }
  ];

  // Mock data for client analytics
  const clientData = [
    { name: 'Adebayo Ltd', revenue: 450000, invoiceCount: 12 },
    { name: 'Lagos Corp', revenue: 380000, invoiceCount: 8 },
    { name: 'Kano Trading', revenue: 320000, invoiceCount: 15 },
    { name: 'Ibadan Stores', revenue: 280000, invoiceCount: 6 },
    { name: 'Abuja Ventures', revenue: 250000, invoiceCount: 9 }
  ];

  // Mock data for payment methods
  const paymentMethodData = [
    { name: 'Bank Transfer', value: 1200000, percentage: 49.0 },
    { name: 'Cash', value: 750000, percentage: 30.6 },
    { name: 'Card Payment', value: 350000, percentage: 14.3 },
    { name: 'Mobile Money', value: 100000, percentage: 4.1 },
    { name: 'Credit', value: 50000, percentage: 2.0 }
  ];

  // Mock business insights
  const businessInsights = [
    {
      type: 'growth',
      title: 'Revenue Growth Acceleration',
      description: 'Your revenue has grown 18.3% this month, outpacing the previous quarter average of 12%.',
      value: 450000,
      action: 'View growth drivers'
    },
    {
      type: 'opportunity',
      title: 'Client Retention Opportunity',
      description: 'Three high-value clients haven\'t made purchases in 45 days. Consider reaching out.',
      action: 'Contact clients'
    },
    {
      type: 'warning',
      title: 'Expense Category Alert',
      description: 'Marketing expenses increased 35% this month. Review campaign effectiveness.',
      value: 120000,
      action: 'Review expenses'
    },
    {
      type: 'achievement',
      title: 'Payment Collection Improved',
      description: 'Average payment collection time reduced from 21 to 14 days this quarter.',
      action: 'See payment trends'
    },
    {
      type: 'recommendation',
      title: 'Optimize Payment Methods',
      description: 'Consider promoting digital payments to reduce cash handling costs by up to ₦25,000/month.',
      value: 25000,
      action: 'Learn more'
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const handleExport = (format, exportFilters) => {
    console.log(`Exporting ${format} with filters:`, exportFilters);
    // Implement export logic here
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMenuToggle={handleSidebarToggle}
        isMenuOpen={sidebarOpen}
      />
      
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subscriptionTier={subscriptionTier}
      />

      <main className="lg:ml-60 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Reports & Analytics</h1>
              <p className="text-text-secondary mt-1">
                Track your business performance and get insights to grow your SME
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {subscriptionTier === 'free' && (
                <div className="flex items-center space-x-2 bg-accent-50 text-accent-800 px-3 py-2 rounded-lg text-sm">
                  <Icon name="Crown" size={16} />
                  <span>Upgrade for advanced analytics</span>
                </div>
              )}
              <Button
                variant="primary"
                iconName="Download"
                onClick={() => handleExport('pdf', filters)}
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Report Filters */}
          <ReportFilters
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            subscriptionTier={subscriptionTier}
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RevenueChart data={revenueData} timeframe="monthly" />
            <ExpenseBreakdown data={expenseData} />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ClientAnalytics data={clientData} subscriptionTier={subscriptionTier} />
            <PaymentMethodAnalysis data={paymentMethodData} />
          </div>

          {/* Business Insights */}
          <BusinessInsights insights={businessInsights} subscriptionTier={subscriptionTier} />

          {/* Quick Stats Summary */}
          <div className="bg-surface rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {formatCurrency(2450000)}
                </div>
                <div className="text-sm text-text-secondary">Monthly Revenue</div>
                <div className="text-xs text-success-600 mt-1">↗ +12.5% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600 mb-1">47</div>
                <div className="text-sm text-text-secondary">Active Clients</div>
                <div className="text-xs text-success-600 mt-1">↗ +3 new this month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-info-600 mb-1">156</div>
                <div className="text-sm text-text-secondary">Invoices Sent</div>
                <div className="text-xs text-text-secondary mt-1">89% collection rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 mb-1">14</div>
                <div className="text-sm text-text-secondary">Avg. Payment Days</div>
                <div className="text-xs text-success-600 mt-1">↗ 7 days improvement</div>
              </div>
            </div>
          </div>

          {/* Nigerian Business Context */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary rounded-lg">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Nigerian SME Growth Insights
                </h3>
                <p className="text-text-secondary mb-3">
                  Your business is performing well compared to similar Nigerian SMEs. 
                  Consider these local market opportunities:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success-500)" />
                    <span>Digital payment adoption growing 25% yearly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success-500)" />
                    <span>Mobile commerce expanding in Lagos/Abuja</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success-500)" />
                    <span>B2B credit terms averaging 30-45 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success-500)" />
                    <span>SME lending rates improving quarterly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuickActionButton subscriptionTier={subscriptionTier} />
    </div>
  );
};

export default ReportsAndAnalytics;