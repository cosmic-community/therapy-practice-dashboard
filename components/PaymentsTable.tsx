'use client';

import { useState, useEffect } from 'react';
import { getPayments } from '@/lib/cosmic';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { Filter } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Payment, PaymentStatus } from '@/types';

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const paymentsData = await getPayments(filters);
        setPayments(paymentsData as Payment[]);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const totalRevenue = payments
    .filter(p => p.metadata.status === 'paid')
    .reduce((sum, p) => sum + (p.metadata.amount || 0), 0);

  const pendingRevenue = payments
    .filter(p => p.metadata.status === 'pending')
    .reduce((sum, p) => sum + (p.metadata.amount || 0), 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="card-content">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Total Paid</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(pendingRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Pending Payments</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-2xl font-bold">
              {payments.length}
            </div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="text-lg font-medium">Filters</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Status</label>
              <select
                className="select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="label">From Date</label>
              <input
                type="date"
                className="input"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div>
              <label className="label">To Date</label>
              <input
                type="date"
                className="input"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">
            Payment Transactions ({payments.length})
          </h3>
        </div>
        <div className="card-content">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Client</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Method</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{payment.metadata.client_name}</div>
                        {payment.metadata?.appointment && (
                          <div className="text-xs text-muted-foreground">
                            Appointment: {payment.metadata.appointment.title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {formatCurrency(payment.metadata.amount)}
                        </div>
                        {payment.metadata?.refund_amount && (
                          <div className="text-xs text-red-600">
                            Refund: {formatCurrency(payment.metadata.refund_amount)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize">
                          {payment.metadata.payment_method.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {formatDate(payment.metadata.payment_date, 'PPP')}
                        </div>
                        {payment.metadata?.refund_date && (
                          <div className="text-xs text-muted-foreground">
                            Refunded: {formatDate(payment.metadata.refund_date, 'PPP')}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`status-badge ${getStatusColor(payment.metadata.status)}`}>
                          {payment.metadata.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs font-mono text-muted-foreground">
                          {payment.metadata?.transaction_id || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}