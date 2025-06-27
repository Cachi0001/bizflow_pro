import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanComparisonCards from './components/PlanComparisonCards';
import PaymentHistorySection from './components/PaymentHistorySection';
import ReferralSystemSection from './components/ReferralSystemSection';
import BillingPreferencesSection from './components/BillingPreferencesSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SubscriptionManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPlan, setCurrentPlan] = useState('silver'); // free, silver, gold
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState(null);

  // Mock usage data for current user
  const usageData = {
    invoices: 3,
    expenses: 7,
    clients: 15,
    payments: 12
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'plans', label: 'Plans & Pricing', icon: 'CreditCard' },
    { id: 'billing', label: 'Billing', icon: 'Receipt' },
    { id: 'referrals', label: 'Referrals', icon: 'Users' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePlanUpgrade = (planId) => {
    console.log(`Upgrading to plan: ${planId}`);
    setSelectedUpgradePlan(planId);
    setShowUpgradeModal(true);
  };

  const handlePlanSelection = (planId, billingCycle) => {
    console.log(`Selected plan: ${planId}, billing: ${billingCycle}`);
    if (planId !== currentPlan) {
      setSelectedUpgradePlan({ planId, billingCycle });
      setShowUpgradeModal(true);
    }
  };

  const handleConfirmUpgrade = () => {
    console.log('Confirming upgrade:', selectedUpgradePlan);
    // In real implementation, this would process the payment
    setCurrentPlan(selectedUpgradePlan.planId || selectedUpgradePlan);
    setShowUpgradeModal(false);
    setSelectedUpgradePlan(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <CurrentPlanCard 
              currentPlan={currentPlan}
              usage={usageData}
              onUpgrade={handlePlanUpgrade}
            />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <Icon name="FileText" size={24} color="var(--color-primary-600)" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-primary">{usageData.invoices}</div>
                <div className="text-sm text-text-secondary">Invoices This Month</div>
              </div>
              <div className="card p-4 text-center">
                <Icon name="Receipt" size={24} color="var(--color-secondary-600)" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-primary">{usageData.expenses}</div>
                <div className="text-sm text-text-secondary">Expenses Tracked</div>
              </div>
              <div className="card p-4 text-center">
                <Icon name="Users" size={24} color="var(--color-accent-600)" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-primary">{usageData.clients}</div>
                <div className="text-sm text-text-secondary">Active Clients</div>
              </div>
              <div className="card p-4 text-center">
                <Icon name="CreditCard" size={24} color="var(--color-info-600)" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-primary">{usageData.payments}</div>
                <div className="text-sm text-text-secondary">Payments Recorded</div>
              </div>
            </div>

            {/* Upgrade Recommendation */}
            {currentPlan === 'free' && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="TrendingUp" size={24} color="var(--color-primary-600)" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">
                      Ready to Grow Your Business?
                    </h3>
                    <p className="text-primary-700 mb-4">
                      You're using {usageData.invoices}/5 invoices and {usageData.expenses}/10 expenses. 
                      Upgrade to Silver for unlimited access and advanced features.
                    </p>
                    <Button 
                      variant="primary" 
                      onClick={() => handlePlanUpgrade('silver')}
                      iconName="ArrowUp"
                    >
                      Upgrade to Silver - ₦1,200/week
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'plans':
        return (
          <PlanComparisonCards 
            currentPlan={currentPlan}
            onSelectPlan={handlePlanSelection}
          />
        );

      case 'billing':
        return <PaymentHistorySection />;

      case 'referrals':
        return <ReferralSystemSection />;

      case 'preferences':
        return <BillingPreferencesSection currentPlan={currentPlan} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Subscription Management - BizFlow Pro</title>
        <meta name="description" content="Manage your BizFlow Pro subscription, billing, and referrals. Flexible payment options designed for Nigerian SMEs." />
      </Helmet>

      <NavigationHeader 
        onMenuToggle={handleSidebarToggle}
        isMenuOpen={sidebarOpen}
      />

      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subscriptionTier={currentPlan}
      />

      <main className="lg:ml-60 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Crown" size={28} color="var(--color-primary-600)" />
              <h1 className="text-2xl font-bold text-text-primary">
                Subscription Management
              </h1>
            </div>
            <p className="text-text-secondary">
              Manage your subscription, billing preferences, and referral rewards
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      transition-colors duration-200
                      ${activeTab === tab.id
                        ? 'border-primary text-primary-600' :'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1200 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Crown" size={32} color="var(--color-primary-600)" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Confirm Plan Upgrade
              </h3>
              <p className="text-text-secondary">
                You're about to upgrade to the {selectedUpgradePlan?.planId || selectedUpgradePlan} plan. 
                Your new features will be available immediately.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirmUpgrade}
              >
                Confirm Upgrade
              </Button>
            </div>
          </div>
        </div>
      )}

      <QuickActionButton subscriptionTier={currentPlan} />
    </div>
  );
};

export default SubscriptionManagement;