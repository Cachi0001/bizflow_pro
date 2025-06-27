import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReportFilters = ({ onFilterChange, onExport, subscriptionTier }) => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    client: '',
    reportType: 'overview'
  });

  const [showCustomDate, setShowCustomDate] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'thisyear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Business Overview' },
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'expenses', label: 'Expense Report' },
    { value: 'clients', label: 'Client Analytics', premium: true },
    { value: 'payments', label: 'Payment Analysis' },
    { value: 'trends', label: 'Growth Trends', premium: true }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'dateRange') {
      setShowCustomDate(value === 'custom');
    }
    
    onFilterChange(newFilters);
  };

  const handleExport = (format) => {
    onExport(format, filters);
  };

  const isAccessible = (premium) => {
    return !premium || subscriptionTier === 'premium';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Report Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="FileSpreadsheet"
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Report Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Report Type
          </label>
          <select
            value={filters.reportType}
            onChange={(e) => handleFilterChange('reportType', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {reportTypes.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={!isAccessible(option.premium)}
              >
                {option.label} {option.premium && subscriptionTier === 'free' ? '(Pro)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Client Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Client
          </label>
          <Input
            type="text"
            placeholder="Filter by client..."
            value={filters.client}
            onChange={(e) => handleFilterChange('client', e.target.value)}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Quick Actions
          </label>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Filter"
              onClick={() => console.log('Advanced filters')}
            >
              More
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustomDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Start Date
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              End Date
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Filter Summary */}
      <div className="flex items-center space-x-4 text-sm text-text-secondary pt-2 border-t border-border">
        <div className="flex items-center space-x-1">
          <Icon name="Calendar" size={14} />
          <span>
            {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="BarChart3" size={14} />
          <span>
            {reportTypes.find(opt => opt.value === filters.reportType)?.label}
          </span>
        </div>
        {filters.client && (
          <div className="flex items-center space-x-1">
            <Icon name="User" size={14} />
            <span>Client: {filters.client}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;