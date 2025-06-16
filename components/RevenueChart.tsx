'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { DollarSign } from 'lucide-react';
import type { Payment } from '@/types';

interface RevenueChartProps {
  payments: Payment[];
}

export default function RevenueChart({ payments }: RevenueChartProps) {
  const chartData = useMemo(() => {
    if (!payments || payments.length === 0) {
      return [];
    }

    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthKey = format(monthStart, 'yyyy-MM');
      
      const monthlyPayments = payments.filter(payment => {
        if (payment.metadata.status !== 'paid') return false;
        const paymentMonth = format(parseISO(payment.metadata.payment_date), 'yyyy-MM');
        return paymentMonth === monthKey;
      });

      const revenue = monthlyPayments.reduce((sum, payment) => {
        return sum + (payment.metadata.amount || 0);
      }, 0);

      return {
        month: format(monthStart, 'MMM yyyy'),
        revenue,
        appointments: monthlyPayments.length,
      };
    });
  }, [payments]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <h3 className="text-lg font-medium">Revenue Trend</h3>
        </div>
      </div>
      <div className="card-content">
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No revenue data available for the chart.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#0ea5e9" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}