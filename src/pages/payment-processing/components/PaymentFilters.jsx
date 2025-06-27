import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentFilters = ({ onFiltersChange, totalPayments = 0 }) => {
  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: 'all',
    status: 'all',
    dateRange: 'all',
    amountRange: 'all',
    customDateFrom: '',
    customDateTo: '',
    customAmountMin: '',
    customAmountMax: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      paymentMethod: 'all',
      status: 'all',
      dateRange: 'all',
      amountRange: 'all',
      customDateFrom: '',
      customDateTo: '',
      customAmountMin: '',
      customAmountMax: ''
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.paymentMethod !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.amountRange !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-text-primary)" />
          <h3 className="font-medium text-text-primary">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">
            {totalPayments} payments
          </span>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="form-group">
          <Input
            type="search"
            placeholder="Search customers..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paystack">Card Payment</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        {/* Status */}
        <div className="form-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="form-group">
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          className="text-sm"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">From Date</label>
                <Input
                  type="date"
                  value={filters.customDateFrom}
                  onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <Input
                  type="date"
                  value={filters.customDateTo}
                  onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Amount Range */}
          <div className="form-group">
            <label className="form-label">Amount Range</label>
            <select
              value={filters.amountRange}
              onChange={(e) => handleFilterChange('amountRange', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Amounts</option>
              <option value="0-1000">₦0 - ₦1,000</option>
              <option value="1000-5000">₦1,000 - ₦5,000</option>
              <option value="5000-10000">₦5,000 - ₦10,000</option>
              <option value="10000-50000">₦10,000 - ₦50,000</option>
              <option value="50000-100000">₦50,000 - ₦100,000</option>
              <option value="100000+">₦100,000+</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Amount Range */}
          {filters.amountRange === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Minimum Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">₦</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.customAmountMin}
                    onChange={(e) => handleFilterChange('customAmountMin', e.target.value)}
                    className="pl-8"
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">₦</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.customAmountMax}
                    onChange={(e) => handleFilterChange('customAmountMax', e.target.value)}
                    className="pl-8"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;