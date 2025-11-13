# Deployment Guide - Legal AI Lab

## ✅ Pre-Deployment Checklist

### Build Status
- ✅ No TypeScript errors
- ✅ Production build successful
- ✅ All pages compile correctly
- ✅ Tailwind CSS properly configured (v3)

### Dependencies
- ✅ Next.js 16.0.1
- ✅ React 19.2.0
- ✅ Firebase 12.5.0
- ✅ Tailwind CSS 3.4.18
- ✅ Framer Motion 12.23.24

---

## 🚀 Vercel Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Import Project to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `legal-ai-lab` (or your repo name)

### 3. Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

⚠️ **Important**: Copy these from your Firebase Console or local `.env` file

### 4. Build & Deploy Settings
Vercel will auto-detect Next.js settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

Click **Deploy** ✨

---

## 📋 Post-Deployment Tasks

### 1. Verify Firebase Configuration
- ✅ Test login functionality at `/login`
- ✅ Check dashboard access at `/dashboard`
- ✅ Verify LOI form submissions at `/loi`
- ✅ Test YCW26 admin page at `/ycw26-admin`

### 2. Update Firebase Auth Domain
In Firebase Console → Authentication → Settings → Authorized domains:
- Add your Vercel domain: `your-project.vercel.app`
- Add custom domain if applicable

### 3. Test All Features
- [ ] Home page loads correctly
- [ ] Contact form works
- [ ] Login authentication works
- [ ] Protected routes require authentication
- [ ] Dashboard displays lead data
- [ ] LOI form submits to Firestore
- [ ] YCW26 public page displays correctly
- [ ] YCW26 admin page CRUD operations work

---

## 🔧 Firestore Security Rules

Ensure your Firestore rules allow proper access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for YCW26 data
    match /metrics/{document} {
      allow read: true;
      allow write: if request.auth != null;
    }
    match /firms/{document} {
      allow read: true;
      allow write: if request.auth != null;
    }
    match /commitments/{document} {
      allow read: true;
      allow write: if request.auth != null;
    }
    match /insights/{document} {
      allow read: true;
      allow write: if request.auth != null;
    }
    match /milestones/{document} {
      allow read: true;
      allow write: if request.auth != null;
    }
    
    // Protected collections
    match /leads/{document} {
      allow read, write: if request.auth != null;
    }
    match /loi_entries/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🌐 Custom Domain (Optional)

1. In Vercel → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update Firebase authorized domains

---

## 📊 Monitoring

After deployment, monitor:
- Vercel Analytics for traffic
- Firebase Console for database usage
- Browser console for any runtime errors

---

## 🔐 Security Notes

- ✅ Firebase API keys are safe to expose (public by design)
- ✅ Firestore security rules protect data access
- ✅ Authentication handled via email/PIN (basic auth)
- ⚠️ Consider adding environment-based login credentials for production

---

## 🎉 You're Ready to Deploy!

Your Legal AI Lab application is production-ready and optimized for Vercel deployment.

**Next Step**: Push to GitHub and import to Vercel!
