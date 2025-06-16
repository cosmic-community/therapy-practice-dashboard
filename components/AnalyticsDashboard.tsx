'use client';

import { useState, useEffect } from 'react';
import { getAppointments, getPayments } from '@/lib/cosmic';
import { calculateStats, formatCurrency, getDateRanges } from '@/lib/utils';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { DateRange, DashboardStats, Appointment, Payment } from '@/types';

export default function AnalyticsDashboard() {
  const [currentStats, setCurrentStats] = useState<DashboardStats | null>(null);
  const [previousStats, setPreviousStats] = useState<DashboardStats | null>(null);
  const dateRanges = getDateRanges();
  const [selectedRange, setSelectedRange] = useState<DateRange>(() => {
    // Provide a safe default with proper string dates
    const defaultRange = dateRanges[2] || dateRanges[0];
    if (defaultRange && defaultRange.startDate && defaultRange.endDate) {
      return defaultRange;
    }
    // Fallback to a safe default
    return {
      label: 'Last 30 days',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        // Fetch current period data
        const [currentAppointments, currentPayments] = await Promise.all([
          getAppointments({
            dateFrom: selectedRange.startDate,
            dateTo: selectedRange.endDate,
          }),
          getPayments({
            dateFrom: selectedRange.startDate,
            dateTo: selectedRange.endDate,
          }),
        ]);

        const currentStatsData = calculateStats(
          currentAppointments as Appointment[],
          currentPayments as Payment[]
        );
        setCurrentStats(currentStatsData);

        // Calculate previous period for comparison
        const daysDiff = new Date(selectedRange.endDate).getTime() - new Date(selectedRange.startDate).getTime();
        const previousEndDate = new Date(selectedRange.startDate);
        previousEndDate.setTime(previousEndDate.getTime() - 24 * 60 * 60 * 1000); // Go back one day
        const previousStartDate = new Date(previousEndDate);
        previousStartDate.setTime(previousStartDate.getTime() - daysDiff);

        // Fetch previous period data
        const [previousAppointments, previousPayments] = await Promise.all([
          getAppointments({
            dateFrom: previousStartDate.toISOString().split('T')[0],
            dateTo: previousEndDate.toISOString().split('T')[0],
          }),
          getPayments({
            dateFrom: previousStartDate.toISOString().split('T')[0],
            dateTo: previousEndDate.toISOString().split('T')[0],
          }),
        ]);

        const previousStatsData = calculateStats(
          previousAppointments as Appointment[],
          previousPayments as Payment[]
        );
        setPreviousStats(previousStatsData);

      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [selectedRange]);

  const calculatePercentageChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentStats || !previousStats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Unable to load analytics data.
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      current: formatCurrency(currentStats.totalRevenue),
      previous: formatCurrency(previousStats.totalRevenue),
      change: calculatePercentageChange(currentStats.totalRevenue, previousStats.totalRevenue),
    },
    {
      title: 'Total Appointments',
      current: currentStats.totalAppointments.toString(),
      previous: previousStats.totalAppointments.toString(),
      change: calculatePercentageChange(currentStats.totalAppointments, previousStats.totalAppointments),
    },
    {
      title: 'Completed Sessions',
      current: currentStats.completedSessions.toString(),
      previous: previousStats.completedSessions.toString(),
      change: calculatePercentageChange(currentStats.completedSessions, previousStats.completedSessions),
    },
    {
      title: 'Active Clients',
      current: currentStats.activeClients.toString(),
      previous: previousStats.activeClients.toString(),
      change: calculatePercentageChange(currentStats.activeClients, previousStats.activeClients),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h3 className="text-lg font-medium">Analytics Period</h3>
            </div>
            <select
              className="select"
              value={selectedRange.label}
              onChange={(e) => {
                const range = dateRanges.find(r => r.label === e.target.value);
                if (range && range.startDate && range.endDate) {
                  setSelectedRange(range);
                }
              }}
            >
              {dateRanges
                .filter(range => range.startDate && range.endDate)
                .map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{metric.current}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Previous: {metric.previous}</span>
                    <div className={`flex items-center gap-1 ${
                      metric.change.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change.isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{metric.change.value.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Analysis */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Period Analysis</h3>
        </div>
        <div className="card-content">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Current Period ({selectedRange.label})</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium">{formatCurrency(currentStats.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Appointments:</span>
                  <span className="font-medium">{currentStats.totalAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate:</span>
                  <span className="font-medium">
                    {currentStats.totalAppointments > 0 
                      ? `${((currentStats.completedSessions / currentStats.totalAppointments) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Revenue per Session:</span>
                  <span className="font-medium">
                    {currentStats.completedSessions > 0
                      ? formatCurrency(currentStats.totalRevenue / currentStats.completedSessions)
                      : '$0'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Previous Period</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium">{formatCurrency(previousStats.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Appointments:</span>
                  <span className="font-medium">{previousStats.totalAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate:</span>
                  <span className="font-medium">
                    {previousStats.totalAppointments > 0 
                      ? `${((previousStats.completedSessions / previousStats.totalAppointments) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Revenue per Session:</span>
                  <span className="font-medium">
                    {previousStats.completedSessions > 0
                      ? formatCurrency(previousStats.totalRevenue / previousStats.completedSessions)
                      : '$0'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}