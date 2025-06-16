import { createBucketClient } from '@cosmicjs/sdk';

if (!process.env.COSMIC_BUCKET_SLUG) {
  throw new Error('COSMIC_BUCKET_SLUG is required');
}

if (!process.env.COSMIC_READ_KEY) {
  throw new Error('COSMIC_READ_KEY is required');
}

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// API functions with proper error handling
export async function getAppointments(filters?: {
  status?: string;
  therapist?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  try {
    let query: Record<string, any> = { type: 'appointments' };
    
    if (filters?.status) {
      query['metadata.status'] = filters.status;
    }
    
    if (filters?.therapist) {
      query['metadata.therapist'] = filters.therapist;
    }
    
    if (filters?.dateFrom && filters?.dateTo) {
      query['metadata.appointment_date'] = {
        $gte: filters.dateFrom,
        $lte: filters.dateTo,
      };
    }

    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-metadata.appointment_date');

    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch appointments');
  }
}

export async function getTherapists() {
  try {
    const response = await cosmic.objects
      .find({ type: 'therapists' })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('metadata.first_name');

    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch therapists');
  }
}

export async function getPayments(filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  try {
    let query: Record<string, any> = { type: 'payments' };
    
    if (filters?.status) {
      query['metadata.status'] = filters.status;
    }
    
    if (filters?.dateFrom && filters?.dateTo) {
      query['metadata.payment_date'] = {
        $gte: filters.dateFrom,
        $lte: filters.dateTo,
      };
    }

    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-metadata.payment_date');

    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch payments');
  }
}

export async function createAppointment(data: {
  title: string;
  metadata: Record<string, any>;
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'appointments',
      title: data.title,
      metadata: {
        status: 'scheduled',
        payment_status: 'pending',
        duration: 60,
        ...data.metadata,
      },
    });

    return response.object;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment');
  }
}

export async function updateAppointment(id: string, data: {
  title?: string;
  metadata: Record<string, any>;
}) {
  try {
    const response = await cosmic.objects.updateOne(id, {
      title: data.title,
      metadata: data.metadata,
    });

    return response.object;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Failed to update appointment');
  }
}

export async function deleteAppointment(id: string) {
  try {
    await cosmic.objects.deleteOne(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw new Error('Failed to delete appointment');
  }
}