import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InvoiceFilters = ({ onFilterChange, onSearch, filters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-600' },
    { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
    { value: 'paid', label: 'Paid', color: 'bg-success-100 text-success-800' },
    { value: 'overdue', label: 'Overdue', color: 'bg-error-100 text-error-800' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusFilter = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handleDateRangeFilter = (dateRange) => {
    onFilterChange({ ...filters, dateRange });
  };

  const handleAmountFilter = (minAmount, maxAmount) => {
    onFilterChange({ ...filters, minAmount, maxAmount });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onSearch('');
    onFilterChange({
      status: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
      client: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== ''
  ).length;

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={20} color="var(--color-text-secondary)" />
        </div>
        <Input
          type="search"
          placeholder="Search invoices by client name, invoice number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4"
        />
      </div>

      {/* Quick Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusFilter(status.value)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${filters.status === status.value 
                ? `${status.color} ring-2 ring-primary-200` 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary"
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="mr-2" 
          />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-error-600 hover:text-error-700"
          >
            <Icon name="X" size={16} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Date Range
            </label>
            <select
              value={filters.dateRange || 'all'}
              onChange={(e) => handleDateRangeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Range Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Amount Range (₦)
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minAmount || ''}
                onChange={(e) => handleAmountFilter(e.target.value, filters.maxAmount)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxAmount || ''}
                onChange={(e) => handleAmountFilter(filters.minAmount, e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Client Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Client
            </label>
            <Input
              type="text"
              placeholder="Filter by client name"
              value={filters.client || ''}
              onChange={(e) => onFilterChange({ ...filters, client: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;