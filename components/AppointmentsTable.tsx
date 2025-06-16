'use client';

import { useState, useEffect } from 'react';
import { getAppointments, getTherapists } from '@/lib/cosmic';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import { Eye, Edit, Trash2, Filter } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Appointment, Therapist, AppointmentStatus } from '@/types';

export default function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    therapist: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [appointmentsData, therapistsData] = await Promise.all([
          getAppointments(filters),
          getTherapists(),
        ]);
        
        setAppointments(appointmentsData as Appointment[]);
        setTherapists(therapistsData as Therapist[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="text-lg font-medium">Filters</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="label">Status</label>
              <select
                className="select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
            
            <div>
              <label className="label">Therapist</label>
              <select
                className="select"
                value={filters.therapist}
                onChange={(e) => handleFilterChange('therapist', e.target.value)}
              >
                <option value="">All Therapists</option>
                {therapists.map((therapist) => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.metadata?.first_name} {therapist.metadata?.last_name}
                  </option>
                ))}
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

      {/* Appointments Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">
            Appointments ({appointments.length})
          </h3>
        </div>
        <div className="card-content">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Client</th>
                    <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium">Therapist</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Payment</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => {
                    const therapist = appointment.metadata?.therapist;
                    
                    return (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{appointment.metadata.client_name}</div>
                            {appointment.metadata?.client_email && (
                              <div className="text-xs text-muted-foreground">
                                {appointment.metadata.client_email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {formatDate(appointment.metadata.appointment_date, 'PPP')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(appointment.metadata.appointment_time)}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {therapist ? (
                            <div>
                              <div className="font-medium">
                                {therapist.metadata?.first_name} {therapist.metadata?.last_name}
                              </div>
                              {therapist.metadata?.specializations && (
                                <div className="text-xs text-muted-foreground">
                                  {therapist.metadata.specializations.slice(0, 2).join(', ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`status-badge ${getStatusColor(appointment.metadata.status)}`}>
                            {appointment.metadata.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className={`status-badge ${getStatusColor(appointment.metadata.payment_status)}`}>
                              {appointment.metadata.payment_status}
                            </span>
                            {appointment.metadata?.payment_amount && (
                              <div className="text-xs text-muted-foreground mt-1">
                                ${appointment.metadata.payment_amount}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="btn-ghost p-2">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="btn-ghost p-2">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="btn-ghost p-2 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}