<!-- README_START -->
# Therapy Practice Dashboard

A comprehensive admin dashboard for therapy practice management, built with Next.js 15 and [Cosmic](https://www.cosmicjs.com). This dashboard enables therapists and practice administrators to efficiently manage appointments, track payments, and monitor practice analytics with date range comparisons.

## ✨ Features

- **📅 Appointment Management**: View, schedule, and manage therapy appointments
- **💰 Payment Tracking**: Monitor payment status and financial analytics  
- **📊 Analytics Dashboard**: Compare performance across different date ranges
- **📈 Revenue Insights**: Track income trends and payment patterns
- **🔍 Advanced Filtering**: Filter appointments by status, therapist, and date ranges
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🔐 Admin Authentication**: Secure access for authorized users only
- **⚡ Real-time Updates**: Live data synchronization with Cosmic CMS

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=my-ai-dashboard-project-production)

## 🛠 Technologies Used

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom dashboard components
- **Backend**: [Cosmic](https://www.cosmicjs.com) for content management and data storage
- **Charts**: Chart.js for analytics visualizations
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket
- Environment variables configured

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

5. Run the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Examples

### Fetching Appointments
```typescript
import { cosmic } from '@/lib/cosmic';

// Get appointments with therapist details
const appointments = await cosmic.objects
  .find({ type: 'appointments' })
  .props(['id', 'title', 'metadata'])
  .depth(1);
```

### Creating New Appointment
```typescript
const newAppointment = await cosmic.objects.insertOne({
  type: 'appointments',
  title: `${clientName} - ${appointmentDate}`,
  metadata: {
    client_name: 'John Doe',
    therapist: therapistId,
    appointment_date: '2024-01-15T10:00:00Z',
    status: 'scheduled',
    session_type: 'individual',
    payment_status: 'pending'
  }
});
```

## 🎯 Cosmic CMS Integration

This dashboard integrates with [Cosmic](https://www.cosmicjs.com) to manage:

- **Appointments**: Client sessions with scheduling and status tracking
- **Therapists**: Practice staff with credentials and specializations  
- **Payments**: Financial transactions and billing information
- **Clients**: Patient information and therapy history

For detailed API documentation, visit the [Cosmic Docs](https://www.cosmicjs.com/docs).

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `out` or `.next`
4. Configure environment variables

### Environment Variables for Production
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY` 
- `COSMIC_WRITE_KEY`
<!-- README_END -->