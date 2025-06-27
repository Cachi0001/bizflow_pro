import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceDetailPanel = ({ invoice, isOpen, onClose, onEdit, onSendEmail, onGeneratePaymentLink, onExportPDF }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!invoice) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      draft: { color: 'bg-gray-100 text-gray-600', icon: 'FileText' },
      sent: { color: 'bg-blue-100 text-blue-800', icon: 'Send' },
      paid: { color: 'bg-success-100 text-success-800', icon: 'CheckCircle' },
      overdue: { color: 'bg-error-100 text-error-800', icon: 'AlertCircle' }
    };
    return configs[status] || configs.draft;
  };

  const statusConfig = getStatusConfig(invoice.status);
  const subtotal = invoice.lineItems?.reduce((sum, item) => sum + (item.quantity * item.rate), 0) || 0;
  const taxAmount = subtotal * (invoice.taxRate || 0) / 100;
  const total = subtotal + taxAmount - (invoice.discount || 0);

  const tabs = [
    { id: 'details', label: 'Invoice Details', icon: 'FileText' },
    { id: 'payments', label: 'Payment History', icon: 'CreditCard' },
    { id: 'activity', label: 'Activity Log', icon: 'Clock' }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-1000"
          onClick={onClose}
        />
      )}

      {/* Slide-over Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-2xl bg-surface shadow-xl z-1100
        transform transition-transform duration-300 ease-smooth
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        overflow-y-auto scrollbar-thin
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-text-primary">
                {invoice.invoiceNumber}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <Icon name={statusConfig.icon} size={12} className="mr-1" />
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="touch-target"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(invoice)}
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendEmail(invoice)}
            >
              <Icon name="Mail" size={16} className="mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGeneratePaymentLink(invoice)}
            >
              <Icon name="Link" size={16} className="mr-2" />
              Payment Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportPDF(invoice)}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${activeTab === tab.id 
                    ? 'bg-primary-100 text-primary-800' :'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Invoice Preview */}
              <div className="bg-white border border-border rounded-lg p-6 print:shadow-none">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">INVOICE</h1>
                    <p className="text-text-secondary">#{invoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {formatCurrency(total)}
                    </div>
                    <p className="text-sm text-text-secondary">
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>

                {/* Business & Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">From:</h3>
                    <div className="text-sm text-text-secondary space-y-1">
                      <p className="font-medium text-text-primary">{invoice.businessName || "Your Business Name"}</p>
                      <p>{invoice.businessAddress || "Your Business Address"}</p>
                      <p>{invoice.businessPhone || "Your Phone Number"}</p>
                      <p>{invoice.businessEmail || "your@email.com"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">To:</h3>
                    <div className="text-sm text-text-secondary space-y-1">
                      <p className="font-medium text-text-primary">{invoice.clientName}</p>
                      <p>{invoice.clientAddress}</p>
                      <p>{invoice.clientPhone}</p>
                      <p>{invoice.clientEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
                  <div>
                    <p className="text-text-secondary">Invoice Date</p>
                    <p className="font-medium text-text-primary">{formatDate(invoice.createdDate)}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Due Date</p>
                    <p className="font-medium text-text-primary">{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Payment Terms</p>
                    <p className="font-medium text-text-primary">{invoice.paymentTerms || "Net 30"}</p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-sm font-medium text-text-secondary">Description</th>
                          <th className="text-right py-2 text-sm font-medium text-text-secondary">Qty</th>
                          <th className="text-right py-2 text-sm font-medium text-text-secondary">Rate</th>
                          <th className="text-right py-2 text-sm font-medium text-text-secondary">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.lineItems?.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 text-sm text-text-primary">
                              <div className="font-medium">{item.description}</div>
                              {item.details && (
                                <div className="text-text-secondary text-xs mt-1">{item.details}</div>
                              )}
                            </td>
                            <td className="py-3 text-sm text-text-primary text-right">{item.quantity}</td>
                            <td className="py-3 text-sm text-text-primary text-right">{formatCurrency(item.rate)}</td>
                            <td className="py-3 text-sm text-text-primary text-right font-medium">
                              {formatCurrency(item.quantity * item.rate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal:</span>
                      <span className="text-text-primary">{formatCurrency(subtotal)}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Discount:</span>
                        <span className="text-text-primary">-{formatCurrency(invoice.discount)}</span>
                      </div>
                    )}
                    {invoice.taxRate > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Tax ({invoice.taxRate}%):</span>
                        <span className="text-text-primary">{formatCurrency(taxAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                      <span className="text-text-primary">Total:</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-medium text-text-primary mb-2">Notes:</h4>
                    <p className="text-sm text-text-secondary">{invoice.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Payment History</h3>
              {invoice.payments?.length > 0 ? (
                <div className="space-y-3">
                  {invoice.payments.map((payment, index) => (
                    <div key={index} className="bg-background-secondary rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-text-primary">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {payment.method} • {formatDate(payment.date)}
                          </p>
                          {payment.reference && (
                            <p className="text-xs text-text-tertiary mt-1">
                              Ref: {payment.reference}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          <Icon name="CheckCircle" size={12} className="mr-1" />
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="CreditCard" size={48} color="var(--color-text-tertiary)" className="mx-auto mb-4" />
                  <p className="text-text-secondary">No payments recorded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Activity Log</h3>
              {invoice.activities?.length > 0 ? (
                <div className="space-y-3">
                  {invoice.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Icon name={activity.icon} size={16} color="var(--color-primary-600)" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{activity.description}</p>
                        <p className="text-xs text-text-secondary">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Clock" size={48} color="var(--color-text-tertiary)" className="mx-auto mb-4" />
                  <p className="text-text-secondary">No activity recorded yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailPanel;