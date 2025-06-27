import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import PaymentForm from './components/PaymentForm';
import PaymentList from './components/PaymentList';
import PaymentStats from './components/PaymentStats';
import PaymentFilters from './components/PaymentFilters';

import Button from '../../components/ui/Button';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list', 'new', 'stats'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filters, setFilters] = useState({});

  // Mock subscription tier - in real app, get from context/state
  const subscriptionTier = 'free'; // 'free' or 'premium'

  // Mock data for payments
  const [payments, setPayments] = useState([
    {
      id: 1,
      customerName: "Adebayo Enterprises",
      amount: 125000,
      paymentMethod: "bank_transfer",
      referenceNumber: "TXN123456789",
      description: "Payment for Invoice #INV-001",
      paymentDate: "2024-01-15",
      status: "completed",
      timestamp: "2024-01-15T10:30:00Z",
      invoiceId: "INV-001",
      notes: "Payment received on time"
    },
    {
      id: 2,
      customerName: "Chioma Fashion Store",
      amount: 75000,
      paymentMethod: "cash",
      description: "Cash payment for bulk order",
      paymentDate: "2024-01-14",
      status: "completed",
      timestamp: "2024-01-14T14:20:00Z",
      notes: "Cash collected by sales rep"
    },
    {
      id: 3,
      customerName: "Lagos Tech Hub",
      amount: 250000,
      paymentMethod: "paystack",
      description: "Card payment for consulting services",
      paymentDate: "2024-01-13",
      status: "completed",
      timestamp: "2024-01-13T09:15:00Z",
      invoiceId: "INV-003"
    },
    {
      id: 4,
      customerName: "Kano Trading Co.",
      amount: 180000,
      paymentMethod: "credit",
      creditTerms: "30_days",
      description: "Credit payment - 30 days terms",
      paymentDate: "2024-01-12",
      status: "pending",
      timestamp: "2024-01-12T16:45:00Z",
      notes: "Payment due February 12, 2024"
    },
    {
      id: 5,
      customerName: "Port Harcourt Motors",
      amount: 95000,
      paymentMethod: "bank_transfer",
      referenceNumber: "TXN987654321",
      description: "Parts payment",
      paymentDate: "2024-01-11",
      status: "completed",
      timestamp: "2024-01-11T11:30:00Z"
    }
  ]);

  // Mock invoices for linking
  const mockInvoices = [
    {
      id: "INV-001",
      number: "INV-001",
      customerName: "Adebayo Enterprises",
      amount: 125000
    },
    {
      id: "INV-002",
      number: "INV-002",
      customerName: "Chioma Fashion Store",
      amount: 85000
    },
    {
      id: "INV-003",
      number: "INV-003",
      customerName: "Lagos Tech Hub",
      amount: 250000
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewPayment = () => {
    setActiveView('new');
    setSelectedPaymentMethod(null);
    setShowPaymentForm(false);
    setEditingPayment(null);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPayment = {
        id: payments.length + 1,
        ...paymentData,
        status: paymentData.paymentMethod === 'paystack' ? 'pending' : 'completed',
        timestamp: new Date().toISOString()
      };

      setPayments(prev => [newPayment, ...prev]);
      setActiveView('list');
      setShowPaymentForm(false);
      setSelectedPaymentMethod(null);
      
      console.log('Payment recorded successfully:', newPayment);
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handlePaymentFormCancel = () => {
    setShowPaymentForm(false);
    setSelectedPaymentMethod(null);
    setEditingPayment(null);
    setActiveView('list');
  };

  const handleViewPayment = (payment) => {
    console.log('View payment:', payment);
    // In real app, open payment details modal or navigate to detail page
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setSelectedPaymentMethod(payment.paymentMethod);
    setShowPaymentForm(true);
    setActiveView('new');
  };

  const handleDeletePayment = (payment) => {
    if (window.confirm(`Are you sure you want to delete the payment from ${payment.customerName}?`)) {
      setPayments(prev => prev.filter(p => p.id !== payment.id));
      console.log('Payment deleted:', payment);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (paymentsList) => {
    let filtered = [...paymentsList];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.customerName.toLowerCase().includes(searchTerm) ||
        payment.description?.toLowerCase().includes(searchTerm) ||
        payment.referenceNumber?.toLowerCase().includes(searchTerm)
      );
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const filterDate = (payment) => {
        const paymentDate = new Date(payment.paymentDate || payment.timestamp);
        
        switch (filters.dateRange) {
          case 'today':
            return paymentDate.toDateString() === today.toDateString();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return paymentDate.toDateString() === yesterday.toDateString();
          case 'this_week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return paymentDate >= weekStart;
          case 'this_month':
            return paymentDate.getMonth() === today.getMonth() && 
                   paymentDate.getFullYear() === today.getFullYear();
          case 'custom':
            if (filters.customDateFrom && filters.customDateTo) {
              const fromDate = new Date(filters.customDateFrom);
              const toDate = new Date(filters.customDateTo);
              return paymentDate >= fromDate && paymentDate <= toDate;
            }
            return true;
          default:
            return true;
        }
      };
      filtered = filtered.filter(filterDate);
    }

    // Amount range filter
    if (filters.amountRange && filters.amountRange !== 'all') {
      const filterAmount = (payment) => {
        const amount = payment.amount;
        
        switch (filters.amountRange) {
          case '0-1000':
            return amount >= 0 && amount <= 1000;
          case '1000-5000':
            return amount > 1000 && amount <= 5000;
          case '5000-10000':
            return amount > 5000 && amount <= 10000;
          case '10000-50000':
            return amount > 10000 && amount <= 50000;
          case '50000-100000':
            return amount > 50000 && amount <= 100000;
          case '100000+':
            return amount > 100000;
          case 'custom':
            const min = parseFloat(filters.customAmountMin) || 0;
            const max = parseFloat(filters.customAmountMax) || Infinity;
            return amount >= min && amount <= max;
          default:
            return true;
        }
      };
      filtered = filtered.filter(filterAmount);
    }

    return filtered;
  };

  const filteredPayments = applyFilters(payments);

  // Close sidebar on route change or screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationHeader 
        onMenuToggle={handleSidebarToggle}
        isMenuOpen={sidebarOpen}
      />
      
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subscriptionTier={subscriptionTier}
      />

      {/* Main Content */}
      <main className="lg:ml-60 pt-16">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
                  Payment Processing
                </h1>
                <p className="text-text-secondary mt-1">
                  Record and manage customer payments with Nigerian business practices
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant={activeView === 'stats' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('stats')}
                  iconName="BarChart3"
                  className="touch-target"
                >
                  <span className="hidden sm:inline">Stats</span>
                </Button>
                <Button
                  variant={activeView === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('list')}
                  iconName="List"
                  className="touch-target"
                >
                  <span className="hidden sm:inline">Payments</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNewPayment}
                  iconName="Plus"
                  className="touch-target"
                >
                  New Payment
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* New Payment Flow */}
            {activeView === 'new' && (
              <div className="space-y-6">
                {!showPaymentForm ? (
                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onMethodSelect={handlePaymentMethodSelect}
                    subscriptionTier={subscriptionTier}
                  />
                ) : (
                  <PaymentForm
                    paymentMethod={selectedPaymentMethod}
                    onSubmit={handlePaymentSubmit}
                    onCancel={handlePaymentFormCancel}
                    invoices={mockInvoices}
                  />
                )}
              </div>
            )}

            {/* Payment Stats */}
            {activeView === 'stats' && (
              <PaymentStats 
                payments={payments}
                subscriptionTier={subscriptionTier}
              />
            )}

            {/* Payment List */}
            {activeView === 'list' && (
              <div className="space-y-6">
                <PaymentFilters
                  onFiltersChange={handleFiltersChange}
                  totalPayments={filteredPayments.length}
                />
                
                <PaymentList
                  payments={filteredPayments}
                  onViewPayment={handleViewPayment}
                  onEditPayment={handleEditPayment}
                  onDeletePayment={handleDeletePayment}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Action Button */}
      <QuickActionButton subscriptionTier={subscriptionTier} />
    </div>
  );
};

export default PaymentProcessing;