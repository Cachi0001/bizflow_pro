import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceCard = ({ invoice, onView, onEdit, onDuplicate, onSendReminder, onMarkPaid, onDelete }) => {
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

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const statusConfig = getStatusConfig(invoice.status);
  const isOverdue = invoice.status === 'overdue';
  const daysOverdue = isOverdue ? getDaysOverdue(invoice.dueDate) : 0;

  return (
    <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-text-primary">
              {invoice.invoiceNumber}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              <Icon name={statusConfig.icon} size={12} className="mr-1" />
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            {invoice.clientName}
          </p>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-lg text-text-primary">
            {formatCurrency(invoice.amount)}
          </p>
          {isOverdue && (
            <p className="text-xs text-error-600 font-medium">
              {daysOverdue} days overdue
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-text-secondary">Created</p>
          <p className="font-medium text-text-primary">
            {formatDate(invoice.createdDate)}
          </p>
        </div>
        <div>
          <p className="text-text-secondary">Due Date</p>
          <p className={`font-medium ${isOverdue ? 'text-error-600' : 'text-text-primary'}`}>
            {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(invoice)}
          className="flex-1 sm:flex-none"
        >
          <Icon name="Eye" size={16} className="mr-1" />
          View
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(invoice)}
        >
          <Icon name="Edit" size={16} className="mr-1" />
          Edit
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDuplicate(invoice)}
        >
          <Icon name="Copy" size={16} className="mr-1" />
          Duplicate
        </Button>
        
        {invoice.status !== 'paid' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendReminder(invoice)}
              className="text-accent-600 hover:text-accent-700"
            >
              <Icon name="Mail" size={16} className="mr-1" />
              Remind
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkPaid(invoice)}
              className="text-success-600 hover:text-success-700"
            >
              <Icon name="CheckCircle" size={16} className="mr-1" />
              Mark Paid
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
    </div>
  );
};

export default InvoiceCard;