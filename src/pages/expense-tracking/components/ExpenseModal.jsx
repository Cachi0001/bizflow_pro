import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ExpenseModal = ({ isOpen, onClose, expense, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'other',
    paymentMethod: 'cash',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    receiptFile: null
  });

  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (expense && isOpen) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || 'other',
        paymentMethod: expense.paymentMethod || 'cash',
        vendor: expense.vendor || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expense.notes || '',
        receiptFile: null
      });
      setReceiptPreview(expense.receiptUrl || null);
    } else if (isOpen && mode === 'create') {
      setFormData({
        description: '',
        amount: '',
        category: 'other',
        paymentMethod: 'cash',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        receiptFile: null
      });
      setReceiptPreview(null);
    }
  }, [expense, isOpen, mode]);

  const categories = [
    { value: 'transport', label: 'Transport' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'office-supplies', label: 'Office Supplies' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'rent', label: 'Rent & Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'communication', label: 'Communication' },
    { value: 'other', label: 'Other' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'mobile-money', label: 'Mobile Money' },
    { value: 'card', label: 'Card Payment' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receiptFile: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: expense?.id || Date.now(),
        hasReceipt: !!receiptPreview,
        receiptUrl: receiptPreview,
        createdAt: expense?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(expenseData);
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  return (
    <div className="fixed inset-0 z-1100 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary">
              {isCreateMode ? 'Add New Expense' : isEditMode ? 'Edit Expense' : 'Expense Details'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description *
                </label>
                {isViewMode ? (
                  <p className="text-text-primary">{expense?.description}</p>
                ) : (
                  <Input
                    type="text"
                    placeholder="Enter expense description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Amount (₦) *
                </label>
                {isViewMode ? (
                  <p className="text-lg font-semibold text-text-primary">
                    {formatCurrency(expense?.amount || 0)}
                  </p>
                ) : (
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            {/* Category and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category
                </label>
                {isViewMode ? (
                  <p className="text-text-primary capitalize">
                    {expense?.category?.replace('-', ' ')}
                  </p>
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Payment Method
                </label>
                {isViewMode ? (
                  <p className="text-text-primary capitalize">
                    {expense?.paymentMethod?.replace('-', ' ')}
                  </p>
                ) : (
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Vendor and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Vendor/Supplier
                </label>
                {isViewMode ? (
                  <p className="text-text-primary">{expense?.vendor || 'Not specified'}</p>
                ) : (
                  <Input
                    type="text"
                    placeholder="Enter vendor name"
                    value={formData.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Date
                </label>
                {isViewMode ? (
                  <p className="text-text-primary">
                    {new Date(expense?.date).toLocaleDateString('en-GB')}
                  </p>
                ) : (
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Receipt
              </label>
              {receiptPreview ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <Image
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-32 h-32 object-cover rounded-lg border border-border"
                    />
                    {!isViewMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error-500 text-white hover:bg-error-600"
                        onClick={() => {
                          setReceiptPreview(null);
                          setFormData(prev => ({ ...prev, receiptFile: null }));
                        }}
                        iconName="X"
                        iconSize={12}
                      />
                    )}
                  </div>
                </div>
              ) : (
                !isViewMode && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Icon name="Upload" size={24} className="mx-auto mb-2 text-text-secondary" />
                    <p className="text-sm text-text-secondary mb-2">
                      Upload receipt image
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label
                      htmlFor="receipt-upload"
                      className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary bg-surface hover:bg-background cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Notes
              </label>
              {isViewMode ? (
                <p className="text-text-primary">{expense?.notes || 'No notes'}</p>
              ) : (
                <textarea
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isLoading}
                iconName="Save"
                iconSize={16}
              >
                {isCreateMode ? 'Add Expense' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;