# Legal AI Lab - YC Traction Microsite

A Next.js 15 + Firebase + TypeScript microsite designed to demonstrate traction and demand for your Legal AI Factory startup's Y Combinator application.

## 🎯 Purpose

This is **not a product MVP** — it's a proof-of-traction tool that shows:
1. **Proof of Need** - Waitlist with scarcity ("7/10 slots filled")
2. **Proof of Execution** - Live dashboard with real funnel data
3. **Proof of Movement** - Letter of Intent (LOI) submissions from law firms

## 📁 Project Structure

```
legal-ai-lab/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Hero landing page (/)
│   │   ├── layout.tsx            # Root layout with toast notifications
│   │   ├── globals.css           # Global styles + Tailwind
│   │   ├── loi/
│   │   │   └── page.tsx          # LOI/Waitlist page (/loi)
│   │   └── dashboard/
│   │       └── page.tsx          # Traction dashboard (/dashboard)
│   ├── components/
│   │   ├── Hero.tsx              # Hero section with animated slots
│   │   ├── Features.tsx          # 3-column feature grid
│   │   ├── Momentum.tsx          # Cohort stats + "Why firms join"
│   │   ├── Footer.tsx            # Footer with links
│   │   ├── LOIForm.tsx           # Firebase-connected form
│   │   └── FunnelDashboard.tsx   # Live funnel with Firestore data
│   └── lib/
│       └── firebase.ts           # Firebase config & initialization
├── .env.local                    # Your Firebase credentials (NOT committed)
├── .env.example                  # Template for environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Quick Setup

### 1. Create Next.js Project

```bash
npx create-next-app@latest legal-ai-lab
# Select: TypeScript ✅, ESLint ✅, Tailwind ✅, src/ directory ✅, App Router ✅
```

### 2. Install Dependencies

```bash
cd legal-ai-lab
npm install firebase react-hot-toast framer-motion
```

### 3. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project: "Legal AI Lab"
3. Enable **Firestore Database** (production mode)
4. Register web app and copy config

### 4. Add Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Configure Firestore Rules

In Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /loi_entries/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

⚠️ **For production**: Add proper authentication and rate limiting.

### 6. Copy All Files

Place the downloaded files into your project following the structure above:

- `firebase-config.ts` → `src/lib/firebase.ts`
- `layout-root.tsx` → `src/app/layout.tsx`
- `page-home.tsx` → `src/app/page.tsx`
- `page-loi.tsx` → `src/app/loi/page.tsx`
- `page-dashboard.tsx` → `src/app/dashboard/page.tsx`
- All `*-component.tsx` files → `src/components/`
- `globals.css` → `src/app/globals.css`

### 7. Run Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 📄 Pages Overview

### `/` - Hero Landing Page
- Headline: "We're co-building Legal AI Factories with 10 visionary law firms"
- Animated slot indicator (7/10 filled)
- Feature blurbs (Summarization, Clause Intelligence, Factory Engine)
- Momentum section with stats
- CTAs: "Join Waitlist" and "View Dashboard"

### `/loi` - Waitlist & LOI Page
- **Option 1**: Typeform embed (replace URL with your Typeform)
- **Option 2**: Firebase-connected fallback form
- Captures: Firm name, contact, email, pilot focus, message
- Data saved to Firestore collection `loi_entries`
- Toast confirmation on submission
- "Why firms join" trust section

### `/dashboard` - Traction Dashboard
- Fetches live data from Firestore
- Displays funnel stages:
  - Leads → Prospects → Opportunities → Customers
- Shows count + conversion percentage
- Visual progress bars
- Falls back to mock data if Firestore is empty
- Perfect for sharing with YC partners

## 🔥 Firebase Data Structure

### Collection: `loi_entries`

```json
{
  "firmName": "Patel & Associates",
  "contactName": "Raj Patel",
  "email": "raj@patellegal.com",
  "pilotFocus": "Contracts",
  "message": "We process 200+ contracts monthly",
  "stage": "opportunity",
  "timestamp": "2025-11-07T10:00:00Z",
  "source": "web_form"
}
```

**Stage values:**
- `lead` - Initial contact
- `prospect` - Responded/interested
- `opportunity` - Signed LOI or confirmed
- `customer` - Active pilot partner

## 🎨 Design System

- **Primary Navy**: `#0A0A23` (navy-900)
- **Accent Teal**: `#14b8a6` (teal-500)
- **Font**: Inter (Google Fonts)
- **Style**: Clean, minimal, B2B-focused (YC aesthetic)
- **Animations**: Framer Motion (subtle, professional)

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment variables in Vercel:**
1. Go to Vercel dashboard → Settings → Environment Variables
2. Add all `NEXT_PUBLIC_FIREBASE_*` variables
3. Redeploy

## 📊 Adding Mock Data (Optional)

To test dashboard without real submissions, manually add documents to Firestore:

**Collection**: `loi_entries`

```json
[
  {
    "firmName": "Shah Legal Partners",
    "contactName": "Arjun Shah",
    "email": "arjun@shahlegal.in",
    "pilotFocus": "Compliance Docs",
    "stage": "customer",
    "timestamp": "2025-11-05T10:00:00Z"
  },
  {
    "firmName": "Desai & Co",
    "contactName": "Priya Desai",
    "email": "priya@desaico.com",
    "pilotFocus": "Contracts",
    "stage": "opportunity",
    "timestamp": "2025-11-06T14:00:00Z"
  }
]
```

## 🎯 YC Application Strategy

### How to Use This Microsite

1. **Outreach**: Email 30+ law firms with personalized invites
2. **Collect LOIs**: Get 5-10 firms to submit via `/loi` form
3. **Show Dashboard**: Share `/dashboard` link in YC application
4. **Record Demo**: 2-min video showing form submission → dashboard update
5. **Application Narrative**: "In 2 weeks, we got 7 confirmed pilot partners"

### YC Application Ammo

- ✅ Live waitlist with submissions
- ✅ Public dashboard showing funnel
- ✅ Signed LOIs (even non-binding counts!)
- ✅ Scarcity narrative ("limited slots")
- ✅ Co-building narrative (not selling)

## 🔧 Customization

### Replace Typeform URL

Edit `src/app/loi/page.tsx`:

```tsx
<iframe
  src="https://form.typeform.com/to/YOUR_FORM_ID"
  className="w-full h-[600px] rounded-lg"
/>
```

### Update Cohort Stats

Edit `src/components/Hero.tsx` and `src/components/Momentum.tsx` to change slot numbers.

### Adjust Colors

Edit `tailwind.config.ts` to customize navy/teal palette.

## 🐛 Troubleshooting

**Firebase connection error?**
- Verify `.env.local` has all `NEXT_PUBLIC_` prefixed variables
- Restart dev server after changing env vars

**Firestore permission denied?**
- Check Firestore Rules allow read/write for `loi_entries`

**Build errors?**
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## 📝 License

MIT - Use freely for your YC application!

## 💡 Tips for YC

1. **Update numbers daily** - Keep dashboard fresh
2. **Screenshot everything** - Capture each LOI submission
3. **Video demo** - Show form → dashboard flow
4. **Public link** - Make dashboard public, share in application
5. **Narrative** - "We validated demand before building product"

---

**Built for founders applying to Y Combinator Winter 2026 batch.**

Good luck with your application! 🚀
