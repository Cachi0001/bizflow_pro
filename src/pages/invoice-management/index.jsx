import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceCard from './components/InvoiceCard';
import InvoiceTable from './components/InvoiceTable';
import InvoiceDetailPanel from './components/InvoiceDetailPanel';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InvoiceManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    client: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [subscriptionTier] = useState('free'); // Mock subscription tier

  // Mock invoice data
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      clientName: 'Adebayo Enterprises',
      clientEmail: 'adebayo@enterprises.ng',
      clientPhone: '+234 803 123 4567',
      clientAddress: '15 Victoria Island, Lagos, Nigeria',
      amount: 250000,
      status: 'sent',
      createdDate: '2024-01-15',
      dueDate: '2024-02-15',
      businessName: 'BizFlow Pro Solutions',
      businessAddress: '123 Business District, Abuja, Nigeria',
      businessPhone: '+234 901 234 5678',
      businessEmail: 'hello@bizflowpro.ng',
      paymentTerms: 'Net 30',
      taxRate: 7.5,
      discount: 0,
      notes: 'Payment should be made via bank transfer. Please include invoice number in payment reference.',
      lineItems: [
        {
          description: 'Website Development',
          details: 'Complete e-commerce website with payment integration',
          quantity: 1,
          rate: 200000
        },
        {
          description: 'SEO Optimization',
          details: '3 months of search engine optimization',
          quantity: 3,
          rate: 15000
        },
        {
          description: 'Hosting Setup',
          details: 'Annual hosting and domain setup',
          quantity: 1,
          rate: 35000
        }
      ],
      payments: [
        {
          amount: 100000,
          method: 'Bank Transfer',
          date: '2024-01-20',
          reference: 'TXN-20240120-001'
        }
      ],
      activities: [
        {
          description: 'Invoice created',
          timestamp: '2024-01-15',
          icon: 'FileText'
        },
        {
          description: 'Invoice sent to client',
          timestamp: '2024-01-15',
          icon: 'Send'
        },
        {
          description: 'Partial payment received',
          timestamp: '2024-01-20',
          icon: 'CreditCard'
        }
      ]
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      clientName: 'Kemi Fashion House',
      clientEmail: 'kemi@fashionhouse.ng',
      clientPhone: '+234 805 987 6543',
      clientAddress: '45 Allen Avenue, Ikeja, Lagos, Nigeria',
      amount: 85000,
      status: 'paid',
      createdDate: '2024-01-10',
      dueDate: '2024-01-25',
      businessName: 'BizFlow Pro Solutions',
      businessAddress: '123 Business District, Abuja, Nigeria',
      businessPhone: '+234 901 234 5678',
      businessEmail: 'hello@bizflowpro.ng',
      paymentTerms: 'Net 15',
      taxRate: 7.5,
      discount: 5000,
      notes: 'Thank you for your business! Early payment discount applied.',
      lineItems: [
        {
          description: 'Brand Identity Design',
          details: 'Logo design and brand guidelines',
          quantity: 1,
          rate: 50000
        },
        {
          description: 'Business Cards',
          details: '500 premium business cards',
          quantity: 1,
          rate: 25000
        },
        {
          description: 'Social Media Templates',
          details: 'Instagram and Facebook post templates',
          quantity: 1,
          rate: 15000
        }
      ],
      payments: [
        {
          amount: 85000,
          method: 'Paystack',
          date: '2024-01-22',
          reference: 'ps_txn_20240122_001'
        }
      ],
      activities: [
        {
          description: 'Invoice created',
          timestamp: '2024-01-10',
          icon: 'FileText'
        },
        {
          description: 'Invoice sent to client',
          timestamp: '2024-01-10',
          icon: 'Send'
        },
        {
          description: 'Payment received in full',
          timestamp: '2024-01-22',
          icon: 'CheckCircle'
        }
      ]
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      clientName: 'Chinedu Tech Solutions',
      clientEmail: 'chinedu@techsolutions.ng',
      clientPhone: '+234 807 456 7890',
      clientAddress: '78 Independence Layout, Enugu, Nigeria',
      amount: 180000,
      status: 'overdue',
      createdDate: '2023-12-20',
      dueDate: '2024-01-05',
      businessName: 'BizFlow Pro Solutions',
      businessAddress: '123 Business District, Abuja, Nigeria',
      businessPhone: '+234 901 234 5678',
      businessEmail: 'hello@bizflowpro.ng',
      paymentTerms: 'Net 15',
      taxRate: 7.5,
      discount: 0,
      notes: 'Please settle this invoice as soon as possible to avoid late fees.',
      lineItems: [
        {
          description: 'Mobile App Development',
          details: 'iOS and Android app development',
          quantity: 1,
          rate: 150000
        },
        {
          description: 'App Store Deployment',
          details: 'Deployment to App Store and Play Store',
          quantity: 1,
          rate: 30000
        }
      ],
      payments: [],
      activities: [
        {
          description: 'Invoice created',
          timestamp: '2023-12-20',
          icon: 'FileText'
        },
        {
          description: 'Invoice sent to client',
          timestamp: '2023-12-20',
          icon: 'Send'
        },
        {
          description: 'First reminder sent',
          timestamp: '2024-01-06',
          icon: 'Mail'
        },
        {
          description: 'Second reminder sent',
          timestamp: '2024-01-15',
          icon: 'Mail'
        }
      ]
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-004',
      clientName: 'Fatima Catering Services',
      clientEmail: 'fatima@catering.ng',
      clientPhone: '+234 809 123 4567',
      clientAddress: '23 Ahmadu Bello Way, Kaduna, Nigeria',
      amount: 120000,
      status: 'draft',
      createdDate: '2024-01-25',
      dueDate: '2024-02-25',
      businessName: 'BizFlow Pro Solutions',
      businessAddress: '123 Business District, Abuja, Nigeria',
      businessPhone: '+234 901 234 5678',
      businessEmail: 'hello@bizflowpro.ng',
      paymentTerms: 'Net 30',
      taxRate: 7.5,
      discount: 0,
      notes: 'Draft invoice - please review before sending.',
      lineItems: [
        {
          description: 'Event Management System',
          details: 'Custom booking and management platform',
          quantity: 1,
          rate: 100000
        },
        {
          description: 'Training and Support',
          details: '2 days of staff training',
          quantity: 2,
          rate: 10000
        }
      ],
      payments: [],
      activities: [
        {
          description: 'Invoice created as draft',
          timestamp: '2024-01-25',
          icon: 'FileText'
        }
      ]
    }
  ]);

  // Filter and search invoices
  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        invoice.clientName.toLowerCase().includes(searchLower) ||
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.clientEmail.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && invoice.status !== filters.status) {
      return false;
    }

    // Client filter
    if (filters.client && !invoice.clientName.toLowerCase().includes(filters.client.toLowerCase())) {
      return false;
    }

    // Amount filter
    if (filters.minAmount && invoice.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && invoice.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const invoiceDate = new Date(invoice.createdDate);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (invoiceDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (invoiceDate < weekAgo) return false;
          break;
        case 'month':
          if (invoiceDate.getMonth() !== today.getMonth() || invoiceDate.getFullYear() !== today.getFullYear()) return false;
          break;
        case 'quarter':
          const currentQuarter = Math.floor(today.getMonth() / 3);
          const invoiceQuarter = Math.floor(invoiceDate.getMonth() / 3);
          if (invoiceQuarter !== currentQuarter || invoiceDate.getFullYear() !== today.getFullYear()) return false;
          break;
        case 'year':
          if (invoiceDate.getFullYear() !== today.getFullYear()) return false;
          break;
      }
    }

    return true;
  });

  // Invoice actions
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailPanelOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setCreateModalOpen(true);
  };

  const handleDuplicateInvoice = (invoice) => {
    const duplicatedInvoice = {
      ...invoice,
      id: Date.now(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      payments: [],
      activities: [
        {
          description: 'Invoice duplicated',
          timestamp: new Date().toISOString(),
          icon: 'Copy'
        }
      ]
    };
    
    setInvoices(prev => [duplicatedInvoice, ...prev]);
    console.log('Invoice duplicated:', duplicatedInvoice.invoiceNumber);
  };

  const handleSendReminder = (invoice) => {
    console.log('Sending reminder for invoice:', invoice.invoiceNumber);
    // Mock SendGrid integration
    alert(`Reminder sent to ${invoice.clientEmail} for invoice ${invoice.invoiceNumber}`);
  };

  const handleMarkPaid = (invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { 
            ...inv, 
            status: 'paid',
            payments: [
              ...inv.payments,
              {
                amount: inv.amount,
                method: 'Manual Entry',
                date: new Date().toISOString().split('T')[0],
                reference: `MAN-${Date.now()}`
              }
            ],
            activities: [
              ...inv.activities,
              {
                description: 'Invoice marked as paid',
                timestamp: new Date().toISOString(),
                icon: 'CheckCircle'
              }
            ]
          }
        : inv
    ));
    console.log('Invoice marked as paid:', invoice.invoiceNumber);
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
      console.log('Invoice deleted:', invoice.invoiceNumber);
    }
  };

  const handleBulkAction = (action, invoiceIds) => {
    switch (action) {
      case 'sendReminder':
        invoiceIds.forEach(id => {
          const invoice = invoices.find(inv => inv.id === id);
          if (invoice) handleSendReminder(invoice);
        });
        break;
      case 'markPaid':
        setInvoices(prev => prev.map(inv => 
          invoiceIds.includes(inv.id) && inv.status !== 'paid'
            ? { 
                ...inv, 
                status: 'paid',
                payments: [
                  ...inv.payments,
                  {
                    amount: inv.amount,
                    method: 'Bulk Update',
                    date: new Date().toISOString().split('T')[0],
                    reference: `BULK-${Date.now()}`
                  }
                ]
              }
            : inv
        ));
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${invoiceIds.length} invoice(s)?`)) {
          setInvoices(prev => prev.filter(inv => !invoiceIds.includes(inv.id)));
        }
        break;
    }
    setSelectedInvoices([]);
  };

  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };

  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(inv => 
        inv.id === editingInvoice.id 
          ? { 
              ...invoiceData,
              activities: [
                ...inv.activities,
                {
                  description: 'Invoice updated',
                  timestamp: new Date().toISOString(),
                  icon: 'Edit'
                }
              ]
            }
          : inv
      ));
    } else {
      // Create new invoice
      const newInvoice = {
        ...invoiceData,
        activities: [
          {
            description: 'Invoice created',
            timestamp: new Date().toISOString(),
            icon: 'FileText'
          }
        ]
      };
      setInvoices(prev => [newInvoice, ...prev]);
    }
    
    setEditingInvoice(null);
    console.log('Invoice saved:', invoiceData.invoiceNumber);
  };

  // Detail panel actions
  const handleSendEmail = (invoice) => {
    console.log('Sending email for invoice:', invoice.invoiceNumber);
    // Mock SendGrid integration
    alert(`Invoice ${invoice.invoiceNumber} sent to ${invoice.clientEmail}`);
  };

  const handleGeneratePaymentLink = (invoice) => {
    console.log('Generating payment link for invoice:', invoice.invoiceNumber);
    // Mock Paystack integration
    const paymentLink = `https://paystack.com/pay/invoice-${invoice.id}`;
    navigator.clipboard.writeText(paymentLink);
    alert(`Payment link copied to clipboard: ${paymentLink}`);
  };

  const handleExportPDF = (invoice) => {
    console.log('Exporting PDF for invoice:', invoice.invoiceNumber);
    alert(`PDF export for invoice ${invoice.invoiceNumber} will be downloaded`);
  };

  // Statistics
  const stats = {
    total: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMenuOpen={sidebarOpen}
      />
      
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subscriptionTier={subscriptionTier}
      />

      {/* Main Content */}
      <div className="lg:ml-60 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Invoice Management</h1>
              <p className="text-text-secondary">
                Create, manage, and track your invoices
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setCreateModalOpen(true)}
              className="sm:w-auto"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Create Invoice
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total Invoices</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} color="var(--color-primary-600)" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Paid</p>
                  <p className="text-2xl font-bold text-success-600">{stats.paid}</p>
                </div>
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} color="var(--color-success-600)" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Overdue</p>
                  <p className="text-2xl font-bold text-error-600">{stats.overdue}</p>
                </div>
                <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} color="var(--color-error-600)" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total Value</p>
                  <p className="text-lg font-bold text-text-primary">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} color="var(--color-accent-600)" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <InvoiceFilters
            filters={filters}
            onFilterChange={setFilters}
            onSearch={setSearchTerm}
          />

          {/* View Toggle and Results */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {filteredInvoices.length} of {invoices.length} invoices
              </span>
              {selectedInvoices.length > 0 && (
                <span className="text-sm text-primary-600 font-medium">
                  ({selectedInvoices.length} selected)
                </span>
              )}
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant={viewMode === 'card' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('card')}
              >
                <Icon name="Grid3X3" size={16} className="mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Icon name="List" size={16} className="mr-2" />
                Table
              </Button>
            </div>
          </div>

          {/* Invoice List */}
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onView={handleViewInvoice}
                  onEdit={handleEditInvoice}
                  onDuplicate={handleDuplicateInvoice}
                  onSendReminder={handleSendReminder}
                  onMarkPaid={handleMarkPaid}
                  onDelete={handleDeleteInvoice}
                />
              ))}
            </div>
          ) : (
            <InvoiceTable
              invoices={filteredInvoices}
              onView={handleViewInvoice}
              onEdit={handleEditInvoice}
              onDuplicate={handleDuplicateInvoice}
              onSendReminder={handleSendReminder}
              onMarkPaid={handleMarkPaid}
              onDelete={handleDeleteInvoice}
              onBulkAction={handleBulkAction}
              selectedInvoices={selectedInvoices}
              onSelectInvoice={handleSelectInvoice}
              onSelectAll={handleSelectAll}
            />
          )}

          {/* Empty State */}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={64} color="var(--color-text-tertiary)" className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}
              </h3>
              <p className="text-text-secondary mb-6">
                {invoices.length === 0 
                  ? 'Create your first invoice to get started with billing your clients' :'Try adjusting your search or filter criteria'
                }
              </p>
              {invoices.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Create Your First Invoice
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Panel */}
      <InvoiceDetailPanel
        invoice={selectedInvoice}
        isOpen={detailPanelOpen}
        onClose={() => {
          setDetailPanelOpen(false);
          setSelectedInvoice(null);
        }}
        onEdit={handleEditInvoice}
        onSendEmail={handleSendEmail}
        onGeneratePaymentLink={handleGeneratePaymentLink}
        onExportPDF={handleExportPDF}
      />

      {/* Create/Edit Invoice Modal */}
      <CreateInvoiceModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingInvoice(null);
        }}
        onSave={handleSaveInvoice}
        editingInvoice={editingInvoice}
      />

      {/* Quick Action Button */}
      <QuickActionButton subscriptionTier={subscriptionTier} />
    </div>
  );
};

export default InvoiceManagement;