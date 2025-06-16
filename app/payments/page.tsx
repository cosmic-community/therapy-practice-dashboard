import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PaymentsTable from '@/components/PaymentsTable';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">
              Track payment status and financial analytics
            </p>
          </div>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <PaymentsTable />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}