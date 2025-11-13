# Quick Start Guide - B2B Sales Funnel Dashboard

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Copy `.env.example` to `.env.local`
4. Fill in your Firebase credentials in `.env.local`

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Dashboards

- **Private Dashboard**: http://localhost:3000/dashboard
- **Public YC View**: http://localhost:3000/ycw26
- **Home Page**: http://localhost:3000

### 5. Seed Sample Data

1. Go to `/dashboard`
2. Click "Seed Sample Data" button
3. Wait for 8 sample leads to be created

## 📁 Project Structure

```
app/
├── dashboard/        # Private founder dashboard (full CRUD)
├── ycw26/           # Public YC view (read-only)
├── layout.tsx       # Root layout with Navigation
└── page.tsx         # Home page

components/
├── ActivityLog.tsx           # Real-time activity feed
├── FunnelVisualization.tsx  # Recharts funnel chart
├── LeadModal.tsx            # Create/Edit lead form
├── LeadsTable.tsx           # Filterable leads table
├── Navigation.tsx           # Top nav bar
├── SeedDataButton.tsx       # Sample data seeder
└── WeeklySummary.tsx        # Weekly stats card

lib/
├── firebase-config.ts  # Firebase initialization
├── firestore.ts        # Firestore CRUD functions
└── types.ts           # TypeScript interfaces
```

## 🎯 Key Features

### Dashboard (`/dashboard`)
- ✅ Full CRUD for leads
- ✅ Real-time Firestore sync
- ✅ Funnel chart visualization
- ✅ Activity log (last 20 events)
- ✅ Weekly summary with metrics
- ✅ Searchable/filterable table
- ✅ Stage transition tracking

### Public View (`/ycw26`)
- ✅ Read-only mirror
- ✅ Auto-syncs from Firestore
- ✅ Professional public design
- ✅ Key metrics display

## 🔧 Common Tasks

### Add a New Lead
1. Click "Add Lead" in dashboard
2. Fill in firm name, contact, email (required)
3. Select stage
4. Add notes (optional)
5. Click "Create Lead"

### Change Lead Stage
1. Click edit icon on any lead
2. Change stage dropdown
3. Add stage change note (optional)
4. Click "Update Lead"

### Filter Leads
- Use search bar for firm/contact/email
- Use stage dropdown to filter by stage
- Combine both for precise filtering

## 🎨 Customization

### Change Color Theme
Edit `app/layout.tsx` Tailwind config:
```javascript
colors: {
  teal: { /* your colors */ },
  navy: { /* your colors */ }
}
```

### Modify Stages
Edit `lib/types.ts`:
```typescript
export type LeadStage = 'Suspect' | 'Prospect' | 'Opportunity' | 'Customer';
```

## 🐛 Troubleshooting

### "Firebase not configured" error
- Check `.env.local` exists and has correct values
- Restart dev server after changing env vars

### "Permission denied" in Firestore
- Enable Firestore in Firebase Console
- Set security rules to allow read/write (development only):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

### No data showing
- Check Firebase Console > Firestore
- Use "Seed Sample Data" button
- Check browser console for errors

## 📦 Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Build for Production
```bash
npm run build
npm run start
```

## 🔒 Security for Production

Before deploying to production:

1. **Add Authentication**
   - Implement Firebase Auth
   - Protect `/dashboard` route
   - Keep `/ycw26` public

2. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leads/{lead} {
         allow read: if true;  // Public read
         allow write: if request.auth != null;  // Auth required
       }
       match /activity_log/{activity} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Environment Variables**
   - Never commit `.env.local`
   - Use platform-specific secrets management

## 📊 Analytics Integration

To track usage, add to `app/layout.tsx`:
- Google Analytics
- PostHog
- Mixpanel

## 💡 Tips & Best Practices

1. **Regular Backups**: Export Firestore data weekly
2. **Stage Notes**: Always add notes when changing stages
3. **Weekly Reviews**: Check weekly summary for insights
4. **Clean Data**: Delete test leads before going live
5. **Mobile Testing**: Dashboard is fully responsive

## 🆘 Support

- Check `DASHBOARD_README.md` for detailed documentation
- Review Firestore rules in Firebase Console
- Check browser DevTools console for errors

---

🎉 You're ready to track your B2B sales funnel!
