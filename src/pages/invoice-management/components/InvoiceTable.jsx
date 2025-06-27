import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceTable = ({ 
  invoices, 
  onView, 
  onEdit, 
  onDuplicate, 
  onSendReminder, 
  onMarkPaid, 
  onDelete,
  onBulkAction,
  selectedInvoices,
  onSelectInvoice,
  onSelectAll
}) => {
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusConfig = (status) => {
    const configs = {
      draft: { color: 'bg-gray-100 text-gray-600', icon: 'FileText' },
      sent: { color: 'bg-blue-100 text-blue-800', icon: 'Send' },
      paid: { color: 'bg-success-100 text-success-800', icon: 'CheckCircle' },
      overdue: { color: 'bg-error-100 text-error-800', icon: 'AlertCircle' }
    };
    return configs[status] || configs.draft;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (sortField.includes('Date')) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            color={sortField === field && sortDirection === 'asc' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            color={sortField === field && sortDirection === 'desc' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
          />
        </div>
      </div>
    </th>
  );

  const allSelected = selectedInvoices.length === invoices.length && invoices.length > 0;
  const someSelected = selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedInvoices.length > 0 && (
        <div className="bg-primary-50 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-800">
              {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBulkAction('sendReminder', selectedInvoices)}
                className="text-accent-600 hover:text-accent-700"
              >
                <Icon name="Mail" size={16} className="mr-1" />
                Send Reminders
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBulkAction('markPaid', selectedInvoices)}
                className="text-success-600 hover:text-success-700"
              >
                <Icon name="CheckCircle" size={16} className="mr-1" />
                Mark Paid
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBulkAction('delete', selectedInvoices)}
                className="text-error-600 hover:text-error-700"
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={onSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <SortableHeader field="invoiceNumber">Invoice #</SortableHeader>
              <SortableHeader field="clientName">Client</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <SortableHeader field="createdDate">Created</SortableHeader>
              <SortableHeader field="dueDate">Due Date</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {sortedInvoices.map((invoice) => {
              const statusConfig = getStatusConfig(invoice.status);
              const isSelected = selectedInvoices.includes(invoice.id);
              const isOverdue = invoice.status === 'overdue';

              return (
                <tr 
                  key={invoice.id} 
                  className={`hover:bg-gray-50 transition-colors duration-200 ${isSelected ? 'bg-primary-25' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectInvoice(invoice.id)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">
                      {invoice.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary">
                      {invoice.clientName}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {invoice.clientEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-text-primary">
                      {formatCurrency(invoice.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <Icon name={statusConfig.icon} size={12} className="mr-1" />
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {formatDate(invoice.createdDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isOverdue ? 'text-error-600 font-medium' : 'text-text-secondary'}`}>
                      {formatDate(invoice.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(invoice)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(invoice)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        <Icon name="Copy" size={16} />
                      </Button>
                      {invoice.status !== 'paid' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSendReminder(invoice)}
                            className="text-accent-600 hover:text-accent-700"
                          >
                            <Icon name="Mail" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkPaid(invoice)}
                            className="text-success-600 hover:text-success-700"
                          >
                            <Icon name="CheckCircle" size={16} />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(invoice)}
                        className="text-error-600 hover:text-error-700"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} color="var(--color-text-tertiary)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No invoices found</h3>
          <p className="text-text-secondary">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;