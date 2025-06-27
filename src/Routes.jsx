import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import ReportsAndAnalytics from "pages/reports-and-analytics";
import SubscriptionManagement from "pages/subscription-management";
import PaymentProcessing from "pages/payment-processing";
import ExpenseTracking from "pages/expense-tracking";
import InvoiceManagement from "pages/invoice-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports-and-analytics" element={<ReportsAndAnalytics />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/expense-tracking" element={<ExpenseTracking />} />
        <Route path="/invoice-management" element={<InvoiceManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;