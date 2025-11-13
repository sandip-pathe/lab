# B2B Founder Sales Funnel Dashboard

A comprehensive sales pipeline management system for the Legal AI Lab YCW26 initiative.

## 🎯 Overview

This dashboard provides real-time tracking and management of B2B sales leads through a four-stage funnel:

1. **Suspect** - Initial contacts/firms identified
2. **Prospect** - Responded/showed interest
3. **Opportunity** - Signed LOIs/confirmed pilot interest
4. **Customer** - Active pilot partners

## 🚀 Features

### Private Founder Dashboard (`/dashboard`)

The comprehensive management interface with full CRUD capabilities:

- **Lead Management**
  - ✅ Create, Read, Update, Delete leads
  - ✅ Track firm name, contact, email, phone, stage, and notes
  - ✅ Stage transition tracking with timestamps
  - ✅ Stage change notes for context

- **Visualizations**
  - ✅ Interactive Recharts funnel chart
  - ✅ Real-time stats cards (Total Firms, Responses, In Pilots, Customers)
  - ✅ Conversion rate metrics
  - ✅ Progress indicators

- **Weekly Summary**
  - ✅ New leads per stage this week
  - ✅ Total stage movements count
  - ✅ Top 5 recent progressions with stage transitions

- **Activity Log**
  - ✅ Real-time activity feed (last 20 events)
  - ✅ Create, update, and stage change tracking
  - ✅ Timestamps with "time ago" formatting
  - ✅ Color-coded activity types

- **Leads Table**
  - ✅ Sortable and filterable table view
  - ✅ Search by firm name, contact, or email
  - ✅ Filter by stage
  - ✅ Quick edit and delete actions

### Public YC View (`/ycw26`)

Read-only mirror for public viewing:

- ✅ Auto-syncs from Firestore (real-time)
- ✅ Funnel visualization
- ✅ Key metrics and conversion rates
- ✅ Professional public-facing design
- ✅ No CRUD operations (read-only)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS 4 with dark theme
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📦 Data Structure

### Lead Schema
```typescript
interface Lead {
  id: string;
  firmName: string;
  contactName: string;
  email: string;
  phone?: string;
  stage: 'Suspect' | 'Prospect' | 'Opportunity' | 'Customer';
  notes: string;
  createdAt: Date;
  lastUpdated: Date;
  stageHistory: StageTransition[];
}
```

### Stage Transition Schema
```typescript
interface StageTransition {
  from: LeadStage | null;
  to: LeadStage;
  timestamp: Date;
  note?: string;
}
```

## 🗄️ Firestore Collections

1. **`leads`** - Main lead data with embedded stage history
2. **`activity_log`** - Activity tracking for the feed

## 🎨 Design Features

- **Dark Theme**: Modern dark UI optimized for extended use
- **Responsive**: Fully responsive across mobile, tablet, and desktop
- **Real-time**: Firestore listeners for instant updates
- **Animations**: Smooth transitions and loading states
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Dashboards**
   - Private Dashboard: http://localhost:3000/dashboard
   - Public View: http://localhost:3000/ycw26

## 📊 Key Metrics Tracked

- **Total Firms**: All leads in system
- **Responses**: Leads beyond Suspect stage
- **In Pilots**: Opportunity stage leads
- **Customers**: Active pilot partners
- **Conversion Rates**: Stage-to-stage and overall
- **Weekly Activity**: New leads and stage movements

## 🔒 Security Considerations

For production deployment, consider adding:
- Firebase Authentication for private dashboard access
- Firestore Security Rules to protect write operations
- Environment-based access controls
- Rate limiting on public endpoints

## 📈 Analytics Capabilities

The stage history tracking enables:
- Average time in each stage
- Conversion velocity analysis
- Lead source effectiveness
- Bottleneck identification
- Win/loss analysis

## 🎯 Future Enhancements

Potential additions:
- [ ] Email integration for automated outreach
- [ ] Calendar integration for meeting scheduling
- [ ] Export to CSV/Excel
- [ ] Advanced filtering and saved views
- [ ] Custom fields per lead
- [ ] File attachments (contracts, LOIs)
- [ ] Team collaboration features
- [ ] Automated stage transitions based on criteria

## 📝 Usage Tips

1. **Adding Leads**: Click "Add Lead" button in dashboard header
2. **Editing Leads**: Click edit icon in leads table
3. **Changing Stages**: Edit lead and select new stage (prompts for note)
4. **Filtering**: Use search bar and stage dropdown to filter leads
5. **Monitoring**: Check weekly summary and activity log for insights

## 🌐 Public Sharing

The `/ycw26` route is designed for public sharing with investors, partners, or stakeholders. It shows progress without exposing sensitive lead details.

---

Built with ❤️ for Legal AI Lab • YC W26
