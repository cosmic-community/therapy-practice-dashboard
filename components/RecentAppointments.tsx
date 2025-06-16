import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import type { Appointment } from '@/types';

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

export default function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <h3 className="text-lg font-medium">Recent Appointments</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="text-center py-8 text-muted-foreground">
            No recent appointments found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <h3 className="text-lg font-medium">Recent Appointments</h3>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {appointment.metadata.client_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(appointment.metadata.appointment_date, 'MMM d')} at{' '}
                  {formatTime(appointment.metadata.appointment_time)}
                </div>
                {appointment.metadata?.therapist && (
                  <div className="text-xs text-muted-foreground">
                    with {appointment.metadata.therapist.metadata?.first_name}{' '}
                    {appointment.metadata.therapist.metadata?.last_name}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`status-badge ${getStatusColor(appointment.metadata.status)}`}>
                  {appointment.metadata.status}
                </span>
                {appointment.metadata?.payment_amount && (
                  <div className="text-xs text-muted-foreground">
                    ${appointment.metadata.payment_amount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}