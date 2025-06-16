import { getAppointments, getPayments } from '@/lib/cosmic';
import { calculateStats, formatCurrency } from '@/lib/utils';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import RecentAppointments from '@/components/RecentAppointments';
import RevenueChart from '@/components/RevenueChart';

export default async function DashboardOverview() {
  const [appointments, payments] = await Promise.all([
    getAppointments(),
    getPayments(),
  ]);

  const stats = calculateStats(appointments, payments);

  const statsData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todaysAppointments.toString(),
      icon: Calendar,
      change: '+3',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Clients',
      value: stats.activeClients.toString(),
      icon: Users,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Completed Sessions',
      value: stats.completedSessions.toString(),
      icon: Clock,
      change: '+8%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart payments={payments} />
        </div>
        <div className="col-span-3">
          <RecentAppointments appointments={appointments.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}