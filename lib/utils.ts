import { format, parseISO, startOfDay, endOfDay, subDays, subWeeks, subMonths } from 'date-fns';
import type { DateRange, DashboardStats, Appointment, Payment } from '@/types';

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date, pattern: string = 'PPP'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern);
  } catch (error) {
    return 'Invalid date';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatTime(time: string): string {
  try {
    // Check if time is valid before processing
    if (!time || typeof time !== 'string') {
      return time || '';
    }
    
    // Assuming time is in HH:mm format
    const timeParts = time.split(':');
    if (timeParts.length < 2) {
      return time;
    }
    
    const hours = timeParts[0];
    const minutes = timeParts[1];
    
    if (!hours || !minutes) {
      return time;
    }
    
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return format(date, 'h:mm a');
  } catch (error) {
    return time;
  }
}

export function getDateRanges(): DateRange[] {
  const today = new Date();
  
  return [
    {
      label: 'Today',
      startDate: format(startOfDay(today), 'yyyy-MM-dd'),
      endDate: format(endOfDay(today), 'yyyy-MM-dd'),
    },
    {
      label: 'Last 7 days',
      startDate: format(startOfDay(subDays(today, 6)), 'yyyy-MM-dd'),
      endDate: format(endOfDay(today), 'yyyy-MM-dd'),
    },
    {
      label: 'Last 30 days',
      startDate: format(startOfDay(subDays(today, 29)), 'yyyy-MM-dd'),
      endDate: format(endOfDay(today), 'yyyy-MM-dd'),
    },
    {
      label: 'Last 3 months',
      startDate: format(startOfDay(subMonths(today, 3)), 'yyyy-MM-dd'),
      endDate: format(endOfDay(today), 'yyyy-MM-dd'),
    },
  ];
}

export function calculateStats(appointments: Appointment[], payments: Payment[]): DashboardStats {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return {
    totalAppointments: appointments.length,
    totalRevenue: payments
      .filter(p => p.metadata.status === 'paid')
      .reduce((sum, p) => sum + (p.metadata.amount || 0), 0),
    completedSessions: appointments.filter(a => a.metadata.status === 'completed').length,
    pendingPayments: payments.filter(p => p.metadata.status === 'pending').length,
    activeClients: new Set(appointments.map(a => a.metadata.client_name)).size,
    todaysAppointments: appointments.filter(a => 
      a.metadata.appointment_date.startsWith(today)
    ).length,
  };
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Appointment statuses
    'scheduled': 'bg-blue-100 text-blue-800',
    'confirmed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'no-show': 'bg-gray-100 text-gray-800',
    
    // Payment statuses
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
}

export function generateAppointmentTitle(clientName: string, date: string, time: string): string {
  const formattedDate = formatDate(date, 'MMM d');
  const formattedTime = formatTime(time);
  return `${clientName} - ${formattedDate} at ${formattedTime}`;
}