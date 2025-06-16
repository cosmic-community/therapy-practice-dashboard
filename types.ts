// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type_slug: string;
  created_at: string;
  modified_at: string;
}

// Appointment interface
export interface Appointment extends CosmicObject {
  type_slug: 'appointments';
  metadata: {
    client_name: string;
    client_email?: string;
    client_phone?: string;
    therapist?: Therapist;
    appointment_date: string;
    appointment_time: string;
    duration?: number; // in minutes
    status: AppointmentStatus;
    session_type: SessionType;
    payment_status: PaymentStatus;
    payment_amount?: number;
    notes?: string;
    recurring?: boolean;
    cancellation_reason?: string;
  };
}

// Therapist interface
export interface Therapist extends CosmicObject {
  type_slug: 'therapists';
  metadata: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    license_number?: string;
    specializations?: string[];
    bio?: string;
    rate_per_session?: number;
    avatar?: {
      url: string;
      imgix_url: string;
    };
    status: TherapistStatus;
  };
}

// Payment interface
export interface Payment extends CosmicObject {
  type_slug: 'payments';
  metadata: {
    appointment?: Appointment;
    client_name: string;
    amount: number;
    payment_method: PaymentMethod;
    payment_date: string;
    status: PaymentStatus;
    transaction_id?: string;
    notes?: string;
    refund_amount?: number;
    refund_date?: string;
  };
}

// Client interface
export interface Client extends CosmicObject {
  type_slug: 'clients';
  metadata: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    emergency_contact?: string;
    emergency_phone?: string;
    insurance_provider?: string;
    insurance_id?: string;
    preferred_therapist?: Therapist;
    notes?: string;
    status: ClientStatus;
  };
}

// Type literals for select-dropdown values
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type SessionType = 'individual' | 'couple' | 'family' | 'group';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'refunded' | 'cancelled';
export type PaymentMethod = 'cash' | 'credit-card' | 'insurance' | 'bank-transfer' | 'check';
export type TherapistStatus = 'active' | 'inactive' | 'on-leave';
export type ClientStatus = 'active' | 'inactive' | 'archived';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Dashboard analytics types
export interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  completedSessions: number;
  pendingPayments: number;
  activeClients: number;
  todaysAppointments: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  appointments: number;
}

export interface AppointmentsByStatus {
  status: AppointmentStatus;
  count: number;
  percentage: number;
}

// Date range for analytics
export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

// Form data types
export interface CreateAppointmentData {
  client_name: string;
  client_email?: string;
  client_phone?: string;
  therapist?: string; // therapist ID
  appointment_date: string;
  appointment_time: string;
  duration?: number;
  session_type: SessionType;
  payment_amount?: number;
  notes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  status?: AppointmentStatus;
  payment_status?: PaymentStatus;
  cancellation_reason?: string;
}

// Type guards
export function isAppointment(obj: CosmicObject): obj is Appointment {
  return obj.type_slug === 'appointments';
}

export function isTherapist(obj: CosmicObject): obj is Therapist {
  return obj.type_slug === 'therapists';
}

export function isPayment(obj: CosmicObject): obj is Payment {
  return obj.type_slug === 'payments';
}

export function isClient(obj: CosmicObject): obj is Client {
  return obj.type_slug === 'clients';
}

// Utility types
export type CreateAppointment = Omit<Appointment, 'id' | 'created_at' | 'modified_at'>;
export type UpdateAppointment = Partial<Appointment['metadata']>;