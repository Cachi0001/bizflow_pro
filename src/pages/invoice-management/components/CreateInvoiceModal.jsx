import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateInvoiceModal = ({ isOpen, onClose, onSave, editingInvoice = null }) => {
  const [formData, setFormData] = useState({
    clientName: editingInvoice?.clientName || '',
    clientEmail: editingInvoice?.clientEmail || '',
    clientPhone: editingInvoice?.clientPhone || '',
    clientAddress: editingInvoice?.clientAddress || '',
    dueDate: editingInvoice?.dueDate || '',
    paymentTerms: editingInvoice?.paymentTerms || 'Net 30',
    taxRate: editingInvoice?.taxRate || 7.5,
    discount: editingInvoice?.discount || 0,
    notes: editingInvoice?.notes || '',
    lineItems: editingInvoice?.lineItems || [
      { description: '', quantity: 1, rate: 0, details: '' }
    ]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...formData.lineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, rate: 0, details: '' }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const updatedItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lineItems: updatedItems
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    // Validate line items
    const hasValidLineItem = formData.lineItems.some(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    );

    if (!hasValidLineItem) {
      newErrors.lineItems = 'At least one line item with description, quantity, and rate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate totals
      const subtotal = formData.lineItems.reduce((sum, item) => 
        sum + (item.quantity * item.rate), 0
      );
      const taxAmount = subtotal * (formData.taxRate / 100);
      const total = subtotal + taxAmount - formData.discount;

      const invoiceData = {
        ...formData,
        invoiceNumber: editingInvoice?.invoiceNumber || `INV-${Date.now()}`,
        status: editingInvoice?.status || 'draft',
        createdDate: editingInvoice?.createdDate || new Date().toISOString(),
        amount: total,
        subtotal,
        taxAmount,
        id: editingInvoice?.id || Date.now()
      };

      await onSave(invoiceData);
      onClose();
      
      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        dueDate: '',
        paymentTerms: 'Net 30',
        taxRate: 7.5,
        discount: 0,
        notes: '',
        lineItems: [{ description: '', quantity: 1, rate: 0, details: '' }]
      });
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const subtotal = formData.lineItems.reduce((sum, item) => 
    sum + (item.quantity * item.rate), 0
  );
  const taxAmount = subtotal * (formData.taxRate / 100);
  const total = subtotal + taxAmount - formData.discount;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-1000" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-1100 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                  {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="touch-target"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Client Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Enter client name"
                      className={errors.clientName ? 'border-error-500' : ''}
                    />
                    {errors.clientName && (
                      <p className="text-error-600 text-sm mt-1">{errors.clientName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="client@example.com"
                      className={errors.clientEmail ? 'border-error-500' : ''}
                    />
                    {errors.clientEmail && (
                      <p className="text-error-600 text-sm mt-1">{errors.clientEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Address
                    </label>
                    <Input
                      type="text"
                      value={formData.clientAddress}
                      onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                      placeholder="Client address"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Due Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className={errors.dueDate ? 'border-error-500' : ''}
                    />
                    {errors.dueDate && (
                      <p className="text-error-600 text-sm mt-1">{errors.dueDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Tax Rate (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                      placeholder="7.5"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary">Line Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLineItem}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Item
                  </Button>
                </div>

                {errors.lineItems && (
                  <p className="text-error-600 text-sm">{errors.lineItems}</p>
                )}

                <div className="space-y-3">
                  {formData.lineItems.map((item, index) => (
                    <div key={index} className="bg-background-secondary rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        <div className="md:col-span-5">
                          <Input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                          <Input
                            type="text"
                            value={item.details}
                            onChange={(e) => handleLineItemChange(index, 'details', e.target.value)}
                            placeholder="Additional details (optional)"
                            className="mt-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            placeholder="Qty"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            placeholder="Rate"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-center">
                          <span className="text-sm font-medium text-text-primary">
                            {formatCurrency(item.quantity * item.rate)}
                          </span>
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          {formData.lineItems.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(index)}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals and Additional Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Discount (₦)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  
                  <label className="block text-sm font-medium text-text-primary mb-1 mt-4">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes or payment instructions..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary resize-none"
                  />
                </div>

                <div className="bg-background-secondary rounded-lg p-4">
                  <h4 className="font-medium text-text-primary mb-3">Invoice Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal:</span>
                      <span className="text-text-primary">{formatCurrency(subtotal)}</span>
                    </div>
                    {formData.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Discount:</span>
                        <span className="text-text-primary">-{formatCurrency(formData.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tax ({formData.taxRate}%):</span>
                      <span className="text-text-primary">{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                      <span className="text-text-primary">Total:</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="sm:order-2"
                >
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInvoiceModal;