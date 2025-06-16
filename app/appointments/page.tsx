import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AppointmentsTable from '@/components/AppointmentsTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
            <p className="text-muted-foreground">
              Manage and track therapy appointments
            </p>
          </div>
          <Link href="/appointments/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <AppointmentsTable />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}