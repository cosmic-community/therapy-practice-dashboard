import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardOverview from '@/components/DashboardOverview';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardOverview />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}