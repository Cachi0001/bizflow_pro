import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ExpenseCard from './components/ExpenseCard';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseModal from './components/ExpenseModal';
import ExpenseStats from './components/ExpenseStats';
import ExpenseChart from './components/ExpenseChart';

const ExpenseTracking = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // 'free' or 'premium'

  // Mock data for expenses
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: "Fuel for delivery van",
      amount: 15000,
      category: "fuel",
      paymentMethod: "cash",
      vendor: "Total Filling Station",
      date: "2024-01-15",
      notes: "Monthly fuel expense for deliveries",
      hasReceipt: true,
      receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      description: "Office internet subscription",
      amount: 25000,
      category: "utilities",
      paymentMethod: "bank-transfer",
      vendor: "MTN Nigeria",
      date: "2024-01-14",
      notes: "Monthly internet bill for office",
      hasReceipt: false,
      receiptUrl: null,
      createdAt: "2024-01-14T14:20:00Z",
      updatedAt: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      description: "Marketing flyers printing",
      amount: 8500,
      category: "marketing",
      paymentMethod: "cash",
      vendor: "Quick Print Solutions",
      date: "2024-01-13",
      notes: "Promotional materials for new product launch",
      hasReceipt: true,
      receiptUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      description: "Raw materials purchase",
      amount: 45000,
      category: "inventory",
      paymentMethod: "bank-transfer",
      vendor: "Lagos Suppliers Ltd",
      date: "2024-01-12",
      notes: "Monthly inventory restocking",
      hasReceipt: true,
      receiptUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      createdAt: "2024-01-12T16:45:00Z",
      updatedAt: "2024-01-12T16:45:00Z"
    },
    {
      id: 5,
      description: "Transport fare for business meeting",
      amount: 3500,
      category: "transport",
      paymentMethod: "cash",
      vendor: "Uber Nigeria",
      date: "2024-01-11",
      notes: "Client meeting in Victoria Island",
      hasReceipt: false,
      receiptUrl: null,
      createdAt: "2024-01-11T11:30:00Z",
      updatedAt: "2024-01-11T11:30:00Z"
    },
    {
      id: 6,
      description: "Legal consultation fee",
      amount: 50000,
      category: "professional-services",
      paymentMethod: "bank-transfer",
      vendor: "Adebayo & Associates",
      date: "2024-01-10",
      notes: "Business registration and compliance review",
      hasReceipt: true,
      receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      createdAt: "2024-01-10T13:20:00Z",
      updatedAt: "2024-01-10T13:20:00Z"
    }
  ]);

  const [filters, setFilters] = useState({
    category: 'all',
    paymentMethod: 'all',
    hasReceipt: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });

  // Filter and search expenses
  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    if (searchQuery && !expense.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !expense.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && expense.category !== filters.category) {
      return false;
    }

    // Payment method filter
    if (filters.paymentMethod !== 'all' && expense.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Receipt filter
    if (filters.hasReceipt !== 'all') {
      const hasReceipt = filters.hasReceipt === 'true';
      if (expense.hasReceipt !== hasReceipt) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateFrom && new Date(expense.date) < new Date(filters.dateFrom)) {
      return false;
    }
    if (filters.dateTo && new Date(expense.date) > new Date(filters.dateTo)) {
      return false;
    }

    // Amount range filter
    if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    return true;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.description}"?`)) {
      setExpenses(prev => prev.filter(e => e.id !== expense.id));
    }
  };

  const handleSaveExpense = (expenseData) => {
    if (modalMode === 'create') {
      setExpenses(prev => [expenseData, ...prev]);
    } else if (modalMode === 'edit') {
      setExpenses(prev => prev.map(e => e.id === expenseData.id ? expenseData : e));
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      paymentMethod: 'all',
      hasReceipt: 'all',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const handleBulkDelete = () => {
    if (selectedExpenses.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedExpenses.length} selected expenses?`)) {
      setExpenses(prev => prev.filter(e => !selectedExpenses.includes(e.id)));
      setSelectedExpenses([]);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Vendor'].join(','),
      ...sortedExpenses.map(expense => [
        expense.date,
        expense.description,
        expense.category,
        expense.amount,
        expense.paymentMethod,
        expense.vendor || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationHeader 
        onMenuToggle={handleSidebarToggle}
        isMenuOpen={isSidebarOpen}
      />
      
      <NavigationSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        subscriptionTier={subscriptionTier}
      />

      {/* Main Content */}
      <main className="lg:ml-60 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Expense Tracking
              </h1>
              <p className="text-text-secondary mt-1">
                Monitor your business spending and maintain financial control
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleExport}
                iconName="Download"
                iconSize={16}
              >
                Export
              </Button>
              <Button
                variant="primary"
                onClick={handleAddExpense}
                iconName="Plus"
                iconSize={16}
              >
                Add Expense
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <ExpenseStats 
            expenses={expenses} 
            subscriptionTier={subscriptionTier}
          />

          {/* Charts Section */}
          <ExpenseChart 
            expenses={expenses} 
            subscriptionTier={subscriptionTier}
          />

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                />
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-surface border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  iconName="Grid3X3"
                  iconSize={16}
                />
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  iconName="List"
                  iconSize={16}
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="category">By Category</option>
              </select>

              {/* Bulk Actions */}
              {selectedExpenses.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  iconName="Trash2"
                  iconSize={16}
                >
                  Delete ({selectedExpenses.length})
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <ExpenseFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Showing {sortedExpenses.length} of {expenses.length} expenses
            </span>
            <span>
              Total: {formatCurrency(sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </span>
          </div>

          {/* Expenses List */}
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="Receipt" size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No expenses found
              </h3>
              <p className="text-text-secondary mb-4">
                {searchQuery || Object.values(filters).some(f => f && f !== 'all') 
                  ? 'Try adjusting your search or filters' :'Start tracking your business expenses by adding your first expense'
                }
              </p>
              <Button
                variant="primary"
                onClick={handleAddExpense}
                iconName="Plus"
                iconSize={16}
              >
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'cards' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" :"bg-surface rounded-lg border border-border overflow-hidden"
            }>
              {viewMode === 'cards' ? (
                sortedExpenses.map(expense => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onView={handleViewExpense}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                  />
                ))
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-medium text-text-primary">Date</th>
                        <th className="text-left p-4 font-medium text-text-primary">Description</th>
                        <th className="text-left p-4 font-medium text-text-primary">Category</th>
                        <th className="text-left p-4 font-medium text-text-primary">Amount</th>
                        <th className="text-left p-4 font-medium text-text-primary">Method</th>
                        <th className="text-left p-4 font-medium text-text-primary">Receipt</th>
                        <th className="text-left p-4 font-medium text-text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExpenses.map(expense => (
                        <tr key={expense.id} className="border-b border-border hover:bg-background">
                          <td className="p-4 text-sm text-text-primary">
                            {new Date(expense.date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-text-primary">
                                {expense.description}
                              </div>
                              {expense.vendor && (
                                <div className="text-sm text-text-secondary">
                                  {expense.vendor}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-text-primary capitalize">
                            {expense.category.replace('-', ' ')}
                          </td>
                          <td className="p-4 font-semibold text-text-primary">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="p-4 text-sm text-text-primary capitalize">
                            {expense.paymentMethod.replace('-', ' ')}
                          </td>
                          <td className="p-4">
                            {expense.hasReceipt ? (
                              <Icon name="Paperclip" size={16} className="text-success-600" />
                            ) : (
                              <Icon name="X" size={16} className="text-error-600" />
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewExpense(expense)}
                                iconName="Eye"
                                iconSize={14}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExpense(expense)}
                                iconName="Edit"
                                iconSize={14}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExpense(expense)}
                                iconName="Trash2"
                                iconSize={14}
                                className="text-error-600 hover:text-error-700"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={selectedExpense}
        onSave={handleSaveExpense}
        mode={modalMode}
      />

      {/* Quick Action Button */}
      <QuickActionButton subscriptionTier={subscriptionTier} />
    </div>
  );
};

export default ExpenseTracking;