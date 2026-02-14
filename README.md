<div align="center">

# ⚡ Snaplinq

**Your Links. Organized. Everywhere.**

A universal bookmark manager built with React Native & Expo — one codebase for **iOS**, **Android**, and **Web**.

[![React Native](https://img.shields.io/badge/React_Native-0.81-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3fcf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.2-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://nativewind.dev)

</div>

---

## 📸 Preview

| Login | Dashboard | Add Link |
|:---:|:---:|:---:|
| Dark themed login with Google & Email auth | Responsive grid organized by category | Auto-fill from URL with smart categorization |

---

## ✨ Features

- 🔗 **Save & Organize** — Bookmark any URL with auto-categorization
- 🎨 **Smart Favicons** — Automatically fetches website icons
- 🏷️ **Categories** — Coding, AI Tools, Design, Social, News, Travel, Music + custom
- 🔍 **Instant Search** — Filter links by title or URL in real-time
- 🌙 **Dark/Light Mode** — System-aware with manual toggle
- 🔐 **Google Sign-In** — Native SDK on mobile, OAuth on web
- 📱 **Responsive Grid** — 2 cols (phone) → 4 cols (tablet) → 6 cols (desktop)
- ☁️ **Cloud Sync** — Same data on mobile and web via Supabase
- 🚀 **Deployable as Web App** — Static export to Vercel/Netlify

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Expo](https://expo.dev) (React Native) |
| **Language** | TypeScript |
| **Styling** | [NativeWind](https://nativewind.dev) (TailwindCSS for RN) |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) |
| **Backend** | [Supabase](https://supabase.com) (Auth + PostgreSQL) |
| **Auth** | Google Sign-In + Email/Password |
| **Icons** | [Lucide](https://lucide.dev) |
| **State** | React Context API |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) (v20+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Xcode) or Android Emulator (Android Studio)

### Installation

```bash
# Clone the repository
git clone https://github.com/arqummalik1/snaplinq.git
cd snaplinq

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run

```bash
# Start the development server
npx expo start

# Platform-specific
npx expo start --ios      # iOS Simulator
npx expo start --android  # Android Emulator
npx expo start --web      # Web Browser
```

---

## 📁 Project Structure

```
snaplinq/
├── app/                          # Routes (Expo Router)
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Dashboard screen
│   ├── login.tsx                 # Login screen
│   └── add-link.tsx              # Add link (modal)
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable primitives
│   │   │   ├── Button.tsx        # Variant button
│   │   │   ├── Input.tsx         # Styled input
│   │   │   └── Modal.tsx         # Bottom sheet modal
│   │   └── dashboard/            # Feature components
│   │       ├── LinkItem.tsx      # Link card
│   │       ├── LinkGrid.tsx      # Responsive grid
│   │       └── AddLinkModal.tsx  # Add/Edit form
│   ├── context/                  # State management
│   │   ├── AuthContext.tsx       # Auth (Google + Email)
│   │   ├── LinkContext.tsx       # CRUD for links
│   │   └── ThemeContext.tsx      # Dark/Light mode
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # cn() class merger
│   └── utils/
│       ├── categorize.ts        # URL categorization
│       └── metadata.ts          # Favicon & title extraction
│
├── assets/                       # App icons & images
├── app.json                      # Expo config
├── babel.config.js               # Babel (NativeWind)
├── metro.config.js               # Metro (withNativeWind)
├── tailwind.config.js            # Tailwind theme
├── vercel.json                   # Vercel deployment
└── package.json
```

---

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `emerald-500` | `#10b981` | Primary buttons, accents |
| `emerald-400` | `#34d399` | Gradient start, light accent |
| `cyan-500` | `#06b6d4` | Gradient end |
| `slate-900` | `#0f172a` | Dark mode background |
| `slate-800` | `#1e293b` | Dark mode cards |
| `slate-50` | `#f8fafc` | Light mode background |
| `red-500` | `#ef4444` | Danger/delete actions |

### Icons (Lucide)

`Search` · `Sun` · `Moon` · `Plus` · `LogOut` · `MoreVertical` · `Trash2` · `Edit2` · `ExternalLink`

---

## 🔐 Authentication

### Web
Uses Supabase OAuth redirect flow — no additional setup needed.

### Mobile (iOS/Android)
Requires Google Cloud Console setup:

1. Create OAuth Client IDs for iOS and Android
2. Download `GoogleService-Info.plist` (iOS) and `google-services.json` (Android)
3. Place in project root
4. Update `webClientId` in `src/context/AuthContext.tsx`

> **Note:** Google Sign-In requires a [custom development build](https://docs.expo.dev/develop/development-builds/introduction/) (not Expo Go).

---

## 🌐 Deploy to Vercel

```bash
# Build for web
npx expo export --platform web

# Deploy
npx vercel --prod
```

Or connect your GitHub repo to Vercel:

| Setting | Value |
|---|---|
| **Build Command** | `npx expo export --platform web` |
| **Output Directory** | `dist` |
| **Framework** | Other |
| **Env Variables** | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` |

---

## 📱 Build Native Apps

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🗄️ Database

Uses Supabase PostgreSQL with Row Level Security (RLS).

**Table: `links`**

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `url` | `text` | Bookmark URL |
| `title` | `text` | Display title |
| `icon` | `text` | Favicon URL |
| `category` | `text` | Category name |
| `created_at` | `timestamp` | Creation time |
| `user_id` | `uuid` | Owner (auth.users FK) |

---

## 📄 License

This project is private and proprietary.

---

<div align="center">

**Built with ❤️ by [Arqum Malik](https://github.com/arqummalik1)**

</div>
