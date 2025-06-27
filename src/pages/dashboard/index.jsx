import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import MetricsCard from './components/MetricsCard';
import RevenueChart from './components/RevenueChart';
import RecentTransactions from './components/RecentTransactions';
import AdSenseBanner from './components/AdSenseBanner';
import AIVoiceButton from './components/AIVoiceButton';
import QuickStats from './components/QuickStats';
import SubscriptionStatus from './components/SubscriptionStatus';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mock subscription tier - in real app, this would come from user context/API
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // 'free' or 'premium'

  // Mock data
  const metricsData = [
    {
      title: 'Total Revenue',
      value: 2450000,
      change: 12.5,
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      title: 'Monthly Expenses',
      value: 850000,
      change: -5.2,
      changeType: 'negative',
      icon: 'Receipt',
      color: 'error'
    },
    {
      title: 'Outstanding Invoices',
      value: 15,
      change: 8.3,
      changeType: 'positive',
      icon: 'FileText',
      color: 'warning'
    },
    {
      title: 'Active Clients',
      value: 42,
      change: 15.7,
      changeType: 'positive',
      icon: 'Users',
      color: 'success'
    }
  ];

  const revenueChartData = [
    { month: 'Jul', revenue: 1200000, expenses: 450000 },
    { month: 'Aug', revenue: 1450000, expenses: 520000 },
    { month: 'Sep', revenue: 1800000, expenses: 680000 },
    { month: 'Oct', revenue: 2100000, expenses: 750000 },
    { month: 'Nov', revenue: 2300000, expenses: 820000 },
    { month: 'Dec', revenue: 2450000, expenses: 850000 }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'invoice',
      description: 'Website Development - Adebayo Enterprises',
      client: 'Adebayo Enterprises',
      amount: 450000,
      date: '2024-12-15'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Office Rent - December',
      category: 'Office Expenses',
      amount: 120000,
      date: '2024-12-14'
    },
    {
      id: 3,
      type: 'payment',
      description: 'Payment received - Kemi Fashion Store',
      client: 'Kemi Fashion Store',
      amount: 280000,
      date: '2024-12-13'
    },
    {
      id: 4,
      type: 'invoice',
      description: 'Logo Design - Tunde Motors',
      client: 'Tunde Motors',
      amount: 85000,
      date: '2024-12-12'
    },
    {
      id: 5,
      type: 'expense',
      description: 'Internet & Phone Bills',
      category: 'Utilities',
      amount: 25000,
      date: '2024-12-11'
    }
  ];

  const quickStatsData = {
    todaySales: 125000,
    pendingInvoices: 8,
    overduePayments: 3,
    weeklyRevenue: 890000
  };

  const usageData = {
    invoices: 3,
    expenses: 7
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleViewAllTransactions = () => {
    navigate('/invoice-management');
  };

  const handleUpgrade = () => {
    navigate('/subscription-management');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader 
          onMenuToggle={handleSidebarToggle}
          isMenuOpen={sidebarOpen}
        />
        <NavigationSidebar 
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          subscriptionTier={subscriptionTier}
        />
        
        <main className="lg:ml-60 pt-16">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Loading Skeleton */}
            <div className="space-y-4">
              <div className="skeleton h-8 w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton h-32 rounded-lg"></div>
                ))}
              </div>
              <div className="skeleton h-80 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMenuToggle={handleSidebarToggle}
        isMenuOpen={sidebarOpen}
      />
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        subscriptionTier={subscriptionTier}
      />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
              Welcome back, John! 👋
            </h1>
            <p className="text-text-secondary">
              Here's what's happening with your business today
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStats stats={quickStatsData} />

          {/* AdSense Banner for Free Users */}
          {subscriptionTier === 'free' && (
            <AdSenseBanner position="horizontal" className="my-6" />
          )}

          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Charts and AI Voice Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart 
                data={revenueChartData} 
                subscriptionTier={subscriptionTier}
              />
            </div>
            <div className="space-y-6">
              <AIVoiceButton subscriptionTier={subscriptionTier} />
              {subscriptionTier === 'free' && (
                <AdSenseBanner position="square" />
              )}
            </div>
          </div>

          {/* Recent Transactions and Subscription Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentTransactions 
                transactions={recentTransactions}
                onViewAll={handleViewAllTransactions}
              />
            </div>
            <div>
              <SubscriptionStatus
                subscriptionTier={subscriptionTier}
                usage={usageData}
                onUpgrade={handleUpgrade}
              />
            </div>
          </div>

          {/* Bottom AdSense Banner for Free Users */}
          {subscriptionTier === 'free' && (
            <AdSenseBanner position="horizontal" className="mt-8" />
          )}

          {/* Business Insights Section */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Business Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600 mb-1">
                  ₦{new Intl.NumberFormat('en-NG').format(1600000)}
                </div>
                <div className="text-sm text-success-700">Net Profit This Month</div>
              </div>
              <div className="text-center p-4 bg-info-50 rounded-lg">
                <div className="text-2xl font-bold text-info-600 mb-1">
                  18 days
                </div>
                <div className="text-sm text-info-700">Average Payment Time</div>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-lg">
                <div className="text-2xl font-bold text-warning-600 mb-1">
                  92%
                </div>
                <div className="text-sm text-warning-700">Invoice Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuickActionButton subscriptionTier={subscriptionTier} />
    </div>
  );
};

export default Dashboard;