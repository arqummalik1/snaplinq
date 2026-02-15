================================================================================
                       SNAPLINQ - COMPLETE PROJECT REFERENCE
                           Version 1.0.0 | February 2026
================================================================================

TABLE OF CONTENTS
─────────────────
1.  OVERVIEW
2.  TECH STACK
3.  FULL PROJECT STRUCTURE (EVERY FILE)
4.  DESIGN SYSTEM (COLORS, TYPOGRAPHY, SPACING)
5.  ICONS & ASSETS
6.  CONFIGURATION FILES (DETAILED)
7.  SOURCE CODE - LIBRARY FILES
8.  SOURCE CODE - UTILITY FILES
9.  SOURCE CODE - UI COMPONENTS
10. SOURCE CODE - CONTEXT PROVIDERS (STATE MANAGEMENT)
11. SOURCE CODE - DASHBOARD COMPONENTS
12. SOURCE CODE - APP SCREENS (ROUTES)
13. DEPENDENCIES (EVERY PACKAGE)
14. ENVIRONMENT VARIABLES
15. AUTHENTICATION FLOW
16. DATABASE SCHEMA (SUPABASE)
17. DEPLOYMENT (VERCEL / WEB)
18. MOBILE BUILD (iOS / ANDROID)
19. KNOWN LIMITATIONS
20. FUTURE ENHANCEMENTS


================================================================================
1. OVERVIEW
================================================================================

Snaplinq is a universal bookmark manager built with React Native (Expo).
It is the mobile companion to the Snaplinq web application and connects to
the SAME Supabase backend database, meaning users see the same saved links
on both the web app and the mobile app.

Key capabilities:
  - Save, organize, edit, and delete bookmarks (links)
  - Auto-categorize URLs (AI Tools, Coding, Design, Social, etc.)
  - Auto-fetch favicons and generate titles from URLs
  - Google Sign-In (native on mobile, OAuth redirect on web)
  - Email/Password authentication
  - Dark/Light mode with system preference detection
  - Responsive grid layout (2 cols mobile → 4 cols tablet → 6 cols desktop)
  - Deep linking support via "snaplinq://" URL scheme
  - Deployable as a web app on Vercel
  - Buildable as native iOS and Android apps via EAS


================================================================================
2. TECH STACK
================================================================================

Category              | Technology              | Version
─────────────────────|────────────────────────|──────────
Framework             | Expo (React Native)     | ~54.0.33
Language              | TypeScript              | ~5.9.2
React                 | React                   | 19.1.0
React Native          | React Native            | 0.81.5
Styling               | NativeWind (TailwindCSS)| ^4.2.1
CSS Framework         | TailwindCSS             | ^3.4.19
Router                | Expo Router             | ~6.0.23
Backend               | Supabase                | ^2.95.3
Auth (Native)         | Google Sign-In          | ^16.1.1
Auth (Web)            | Supabase OAuth          | Built-in
Storage               | AsyncStorage            | ^2.2.0
Icons                 | Lucide React Native     | ^0.564.0
Gradients             | Expo Linear Gradient    | ^15.0.8
Animations            | React Native Reanimated | ~4.1.1
Gestures              | Gesture Handler         | ~2.28.0
Web Support           | React Native Web        | ~0.21.0
Class Merging         | clsx + tailwind-merge   | ^2.1.1 / ^3.4.0


================================================================================
3. FULL PROJECT STRUCTURE (EVERY FILE)
================================================================================

snaplinq/
│
├── .env                            # Environment variables (Supabase keys)
├── .gitignore                      # Git ignore rules
├── .vscode/
│   ├── extensions.json             # Recommended VS Code extensions
│   └── settings.json               # VS Code workspace settings
│
├── app.json                        # Expo app configuration (name, icons, plugins)
├── babel.config.js                 # Babel config (jsxImportSource: nativewind)
├── eslint.config.js                # ESLint config
├── global.css                      # Tailwind CSS entry (@tailwind directives)
├── metro.config.js                 # Metro bundler config (withNativeWind)
├── nativewind-env.d.ts             # TypeScript reference for NativeWind types
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Lockfile
├── tailwind.config.js              # TailwindCSS theme config (colors, content paths)
├── tsconfig.json                   # TypeScript config
├── vercel.json                     # Vercel deployment config
├── README.md                       # GitHub README
├── readme.txt                      # THIS FILE - detailed project reference
│
├── assets/                         # Static assets
│   ├── icon.png                    # App icon (1024x1024, Snaplinq branded)
│   ├── adaptive-icon.png           # Android adaptive icon foreground
│   ├── images/
│   │   ├── android-icon-background.png
│   │   ├── android-icon-foreground.png
│   │   ├── android-icon-monochrome.png
│   │   ├── favicon.png             # Web favicon (48x48)
│   │   ├── icon.png                # Default icon
│   │   ├── partial-react-logo.png  # Expo default (can be removed)
│   │   ├── react-logo.png          # Expo default (can be removed)
│   │   ├── react-logo@2x.png       # Expo default (can be removed)
│   │   ├── react-logo@3x.png       # Expo default (can be removed)
│   │   └── splash-icon.png         # Splash screen icon
│
├── app/                            # Expo Router screens (file-based routing)
│   ├── _layout.tsx                 # ROOT LAYOUT — wraps all screens with providers
│   ├── index.tsx                   # DASHBOARD SCREEN — main link grid
│   ├── login.tsx                   # LOGIN SCREEN — email/password + Google
│   ├── add-link.tsx                # ADD LINK SCREEN — form for shared URLs
│   ├── modal.tsx                   # Expo default modal (can be removed)
│   └── (tabs)/                     # Expo default tab layout (can be removed)
│       ├── _layout.tsx             # Tab navigator layout
│       ├── index.tsx               # Tab home screen
│       └── explore.tsx             # Tab explore screen
│
├── components/                     # Expo default components (can be removed)
│   ├── external-link.tsx           # Opens external URLs
│   ├── haptic-tab.tsx              # Tab with haptic feedback
│   ├── hello-wave.tsx              # Wave animation demo
│   ├── parallax-scroll-view.tsx    # Parallax scrolling demo
│   ├── themed-text.tsx             # Theme-aware Text
│   ├── themed-view.tsx             # Theme-aware View
│   └── ui/
│       ├── collapsible.tsx         # Collapsible panel
│       ├── icon-symbol.ios.tsx     # SF Symbol icon (iOS)
│       └── icon-symbol.tsx         # Fallback icon
│
├── constants/
│   └── theme.ts                    # Expo default theme constants
│
├── hooks/
│   ├── use-color-scheme.ts         # Native color scheme hook
│   ├── use-color-scheme.web.ts     # Web-specific color scheme hook
│   └── use-theme-color.ts          # Theme color hook
│
├── scripts/
│   └── reset-project.js            # Expo script to reset project
│
└── src/                            # CUSTOM SNAPLINQ SOURCE CODE
    ├── lib/
    │   ├── supabase.ts             # Supabase client initialization
    │   └── utils.ts                # cn() utility (clsx + tailwind-merge)
    │
    ├── utils/
    │   ├── categorize.ts           # URL auto-categorization logic
    │   └── metadata.ts             # Favicon + title generation from URLs
    │
    ├── components/
    │   ├── ui/                     # Reusable UI primitives
    │   │   ├── Button.tsx          # Universal button (primary/secondary/ghost/danger)
    │   │   ├── Input.tsx           # Styled text input with label
    │   │   └── Modal.tsx           # Platform-aware modal with handle bar
    │   │
    │   └── dashboard/              # Dashboard-specific components
    │       ├── AddLinkModal.tsx     # Add/Edit link form modal
    │       ├── LinkGrid.tsx        # Responsive grid grouped by category
    │       └── LinkItem.tsx        # Individual link card with context menu
    │
    └── context/                    # React Context providers (state management)
        ├── AuthContext.tsx          # Authentication (Google + Email)
        ├── LinkContext.tsx          # CRUD operations for links
        └── ThemeContext.tsx         # Dark/Light mode management


================================================================================
4. DESIGN SYSTEM (COLORS, TYPOGRAPHY, SPACING)
================================================================================

COLORS (defined in tailwind.config.js)
──────────────────────────────────────

The app uses a Slate + Emerald color palette with Cyan accents.

SLATE (Background / Surface / Text)
  slate-50:  #f8fafc   — Light mode background
  slate-100: #f1f5f9   — Light mode surface / input bg
  slate-200: #e2e8f0   — Light borders, separators
  slate-300: #cbd5e1   — Disabled text, handle bars
  slate-400: #94a3b8   — Placeholder text, muted icons
  slate-500: #64748b   — Secondary text
  slate-600: #475569   — Body text (light mode)
  slate-700: #334155   — Dark borders, labels
  slate-800: #1e293b   — Dark mode surface / cards
  slate-900: #0f172a   — Dark mode background
  slate-950: #020617   — Deepest dark

EMERALD (Primary / CTA / Accent)
  emerald-400: #34d399  — Light mode accent, gradient start
  emerald-500: #10b981  — Primary buttons, active states
  emerald-600: #059669  — Hover states

CYAN (Secondary Accent / Gradient)
  cyan-400: #22d3ee     — Gradient end (decorative)
  cyan-500: #06b6d4     — Gradient end (logo)

RED (Danger / Destructive)
  red-400: #f87171      — Dark mode delete icon
  red-500: #ef4444      — Delete button background
  red-600: #dc2626      — Light mode delete icon

GRADIENTS USED
  Logo gradient:     ['#34d399', '#06b6d4']  (emerald-400 → cyan-500)
  Used in:           Login screen logo, Dashboard header logo

DARK MODE
  Background:        slate-900 (#0f172a)
  Surface/Cards:     slate-800 (#1e293b)
  Borders:           slate-700 (#334155) or slate-800 (#1e293b)
  Primary text:      white (#ffffff)
  Secondary text:    slate-400 (#94a3b8)
  Theme color meta:  #0f172a

LIGHT MODE
  Background:        slate-50 (#f8fafc)
  Surface/Cards:     white (#ffffff)
  Borders:           slate-200 (#e2e8f0)
  Primary text:      slate-900 (#0f172a)
  Secondary text:    slate-500 (#64748b)

TYPOGRAPHY
──────────

Font weights used:
  font-bold       — Headings, logo text, buttons
  font-semibold   — Primary button text
  font-medium     — Labels, category pills, secondary button text
  font-normal     — Body text

Font sizes used:
  text-3xl  — Logo letter in gradient (login)
  text-2xl  — Screen titles ("Welcome Back")
  text-xl   — Section titles, modal titles
  text-lg   — Category headers, logo text (dashboard)
  text-sm   — Labels, subtle text, divider text
  text-xs   — Category pills, link titles, placeholder text

SPACING & LAYOUT
────────────────

Border radius:
  rounded-full   — Circular buttons, toggles, search bar, category pills
  rounded-3xl    — Login card wrapper, modal bottom sheet
  rounded-2xl    — Link cards, icon containers, input fields
  rounded-xl     — Buttons, input fields
  rounded-lg     — Small logo

Padding:
  p-8            — Login card
  p-6            — Modal content
  p-4            — Link card, header
  p-2            — Icon touch targets
  px-4 py-3      — Standard button (md)
  px-3 py-1.5    — Small button / category pill

Shadow:
  shadow-xl      — Login card, modal
  shadow-lg      — FAB (floating action button), logo
  shadow-sm      — Link cards, favicon container

RESPONSIVE BREAKPOINTS
─────────────────────

  Default (< 768px):   Mobile — 2 column grid
  sm: (≥ 640px):       Small tablets — some layout adjustments
  md: (≥ 768px):       Tablets — 4 column grid
  lg: (≥ 1024px):      Desktop — 6 column grid

  Responsive logic in LinkGrid.tsx:
    width > 1024  → 6 columns
    width > 768   → 4 columns
    default       → 2 columns


================================================================================
5. ICONS & ASSETS
================================================================================

APP ICONS
─────────
  assets/icon.png            — Main app icon (Fluid S mark, emerald/cyan gradient)
  assets/adaptive-icon.png   — Android adaptive icon (same as main icon)
  assets/favicon.png         — Web favicon
  assets/splash.png          — Splash screen image

  All icons utilize the new premium Snaplinq branding:
  - An abstract fluid "S" shape.
  - Gradient: Emerald (#10b981) to Ocean Blue (#06b6d4).
  - Modern, minimalist, and vector-style.

UI LOGOS
────────
  assets/images/logo-light.png — Full logo (Icon + Dark Text) for Light Mode
  assets/images/logo-dark.png  — Full logo (Icon + White Text) for Dark Mode

UI ICONS (Lucide React Native)
──────────────────────────────
All icons from the "lucide-react-native" package (v0.564.0):

  Search        — Search bar icon (dashboard header)
  Sun           — Light mode toggle icon (dashboard, dark mode active)
  Moon          — Dark mode toggle icon (dashboard, light mode active)
  Plus          — FAB "Add Link" button (dashboard)
  LogOut        — Sign out button (dashboard header)
  MoreVertical  — Context menu trigger (link card, top-right)
  ExternalLink  — (Available, not currently rendered in UI)
  Trash2        — Delete action (link options modal, category delete)
  Edit2         — (Available, not currently rendered in UI)
  CheckCircle   — Success Toast icon
  AlertCircle   — Error Toast icon
  Info          — Info Toast icon
  X             — Toast dismiss icon

  Icon sizes used:
    16px — MoreVertical (link card), Trash2 (category delete), Toast dismiss
    20px — Search (search bar), Toast icons
    24px — Sun, Moon, Plus, LogOut (header actions)

  Icon colors:
    White (#ffffff)          — Plus icon on emerald FAB, Toast icons
    #fcd34d (yellow-300)     — Sun icon (dark mode)
    #475569 (slate-600)      — Moon icon (light mode)
    #94a3b8 (slate-400)      — MoreVertical, Search (dark), Trash2
    #64748b (slate-500)      — Search (light)
    #f87171 (red-400)        — LogOut (dark mode)
    #dc2626 (red-600)        — LogOut (light mode)


================================================================================
6. CONFIGURATION FILES (DETAILED)
================================================================================

app.json
────────
  name:              "snaplinq"
  slug:              "snaplinq"
  version:           "1.0.0"
  orientation:       "portrait"
  icon:              "./assets/icon.png"
  userInterfaceStyle: "automatic" (follows system dark/light)
  splash.image:      "./assets/splash.png"
  splash.resizeMode: "contain"
  splash.backgroundColor: "#ffffff"
  ios.supportsTablet: true
  ios.bundleIdentifier: "com.snaplinq.app"
  android.adaptiveIcon.foregroundImage: "./assets/adaptive-icon.png"
  android.adaptiveIcon.backgroundColor: "#ffffff"
  android.package: "com.snaplinq.app"
  web.favicon: "./assets/favicon.png"
  web.bundler: "metro"
  scheme: "snaplinq" (deep linking: snaplinq://...)
  plugins: ["expo-router"]

babel.config.js
───────────────
  Presets:
    - babel-preset-expo with { jsxImportSource: "nativewind" }
  Plugins:
    - react-native-reanimated/plugin (MUST be last)

metro.config.js
───────────────
  Uses getDefaultConfig from "expo/metro-config"
  Wrapped with withNativeWind from "nativewind/metro"
  Input CSS: "./global.css"

tailwind.config.js
──────────────────
  Content paths: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"]
  Presets: [require("nativewind/preset")]
  Extended colors: slate (full palette), emerald, cyan, red

tsconfig.json
─────────────
  Extends: "expo/tsconfig.base"
  Strict mode: true
  Path aliases: "@/*" → "./*"
  Includes: "nativewind-env.d.ts" for NativeWind type support

vercel.json
───────────
  buildCommand: "npx expo export --platform web"
  outputDirectory: "dist"
  framework: null (static site, no framework detection)
  rewrites: [{ source: "/(.*)", destination: "/index.html" }] (SPA fallback)

global.css
──────────
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

nativewind-env.d.ts
───────────────────
  /// <reference types="nativewind/types" />
  (Adds className prop support to all React Native components)


================================================================================
7. SOURCE CODE - LIBRARY FILES
================================================================================

src/lib/supabase.ts
───────────────────
  Purpose: Initialize and export the Supabase client.
  Imports: AsyncStorage, createClient from @supabase/supabase-js
  Config:
    - URL from EXPO_PUBLIC_SUPABASE_URL env var
    - Key from EXPO_PUBLIC_SUPABASE_ANON_KEY env var
    - auth.storage: AsyncStorage (persists session across app restarts)
    - auth.autoRefreshToken: true
    - auth.persistSession: true
    - auth.detectSessionInUrl: false (important for React Native)
  Exports: supabase (client instance)

src/lib/utils.ts
────────────────
  Purpose: Utility for merging Tailwind class names (NativeWind compatible).
  Imports: clsx (ClassValue), twMerge from tailwind-merge
  Exports: cn(...inputs: ClassValue[]) => string
  Usage: cn("px-4 py-2", variant === "primary" && "bg-emerald-500")


================================================================================
8. SOURCE CODE - UTILITY FILES
================================================================================

src/utils/metadata.ts
─────────────────────
  Purpose: Extract favicon URL and generate title from a URL.

  getFavicon(url: string) => string
    - Extracts hostname from URL
    - Returns Google Favicon API URL: https://www.google.com/s2/favicons?domain={domain}&sz=128
    - Returns empty string on error

  generateTitle(url: string) => string
    - Extracts hostname, removes "www."
    - Takes first part before "." (e.g., "github" from "github.com")
    - Returns the url itself on error

src/utils/categorize.ts
───────────────────────
  Purpose: Auto-categorize a URL into a predefined category.

  categorizeUrl(url: string) => string
    Categories and their URL match patterns:
      "Coding"       → github, gitlab, stackoverflow, dev.to, code
      "AI Tools"     → gpt, openai, claude, midjourney, ai
      "Design"       → dribbble, behance, figma, unsplash, design
      "Social"       → twitter, x.com, linkedin, facebook, instagram
      "News"         → bbc, cnn, nytimes, news
      "Travel"       → flight, hotel, booking, airbnb, trip
      "Music"        → youtube, spotify, music, video
      "Uncategorized" → default (no match)


================================================================================
9. SOURCE CODE - UI COMPONENTS
================================================================================

src/components/ui/Button.tsx
────────────────────────────
  Purpose: Reusable button with variants and sizes.
  Props:
    onPress: () => void          — Click handler
    children: React.ReactNode    — Button label
    variant: 'primary' | 'secondary' | 'ghost' | 'danger' (default: 'primary')
    size: 'sm' | 'md' | 'lg' (default: 'md')
    disabled: boolean            — Disabled state (opacity: 50%)
    loading: boolean             — Shows ActivityIndicator
    className: string            — Additional NativeWind classes

  Variant styles:
    primary:   bg-emerald-500, text-white, font-semibold
    secondary: bg-slate-200 dark:bg-slate-700, text-slate-900 dark:text-white
    ghost:     bg-transparent, text-slate-600 dark:text-slate-400
    danger:    bg-red-500, text-white, font-semibold

  Size styles:
    sm: px-3 py-1.5
    md: px-4 py-3
    lg: px-6 py-4

src/components/ui/Input.tsx
───────────────────────────
  Purpose: Styled text input with optional label.
  Props:
    label: string                — Label text above input
    className: string            — Additional classes
    ...TextInputProps            — All React Native TextInput props
  Styles:
    Container: w-full, space-y-2
    Label: text-sm font-medium text-slate-700 dark:text-slate-300
    Input: bg-slate-100 dark:bg-slate-800, border border-slate-200 dark:border-slate-700
           rounded-xl, px-4 py-3, text-slate-900 dark:text-white
    Placeholder color: #94a3b8

src/components/ui/Modal.tsx
───────────────────────────
  Purpose: Platform-aware modal with handle bar (bottom sheet on mobile).
  Props:
    visible: boolean             — Show/hide
    onClose: () => void          — Close handler
    title: string                — Modal title
    children: React.ReactNode    — Modal content
  Structure:
    - RNModal with transparent background, slide animation
    - KeyboardAvoidingView (padding on iOS, height on Android)
    - Black overlay (bg-black/50) — touch to dismiss
    - White/dark card: rounded-t-3xl (mobile), rounded-2xl (tablet+)
    - Handle bar: w-12 h-1.5 bg-slate-300, hidden on sm+
    - Title: text-xl font-bold, centered


================================================================================
10. SOURCE CODE - CONTEXT PROVIDERS (STATE MANAGEMENT)
================================================================================

src/context/AuthContext.tsx
───────────────────────────
  Purpose: Authentication management with universal Google + Email support.

  State:
    user: User | null
    session: Session | null
    loading: boolean

  Methods:
    signInWithGoogle()
      Web:    supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: window.location.origin })
      Mobile: GoogleSignin.signIn() → supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })

    signOut()
      Mobile: GoogleSignin.signOut() + supabase.auth.signOut()
      Web:    supabase.auth.signOut()

  Listeners:
    - supabase.auth.getSession() on mount
    - supabase.auth.onAuthStateChange() subscription

  GoogleSignin.configure():
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com' (needs replacement)
    offlineAccess: true

src/context/LinkContext.tsx
───────────────────────────
  Purpose: CRUD operations for links with Supabase.

  State:
    links: Link[]
    categories: string[]  — Default: ['Uncategorized', 'Coding', 'Design', 'Reading', 'Music', 'Social', 'AI Tools', 'News', 'Travel']
    loading: boolean

  Link Interface:
    id: string
    url: string
    title: string
    icon?: string          — Favicon URL
    category: string
    created_at?: string
    user_id?: string

  Methods:
    refresh()              — SELECT * FROM links ORDER BY created_at DESC
    addLink(link)          — INSERT into links with user_id and timestamp
    updateLink(id, updates) — UPDATE links SET ... WHERE id = ...
    deleteLink(id)         — DELETE FROM links WHERE id = ...
    addCategory(name)      — Adds to local state (not persisted to DB)
    deleteCategory(name)   — Removes from local state ('Uncategorized' protected)

  Auto-behavior:
    - On session change → refresh()
    - After add/update/delete → refresh()
    - Extracts unique categories from fetched links

src/context/ThemeContext.tsx
────────────────────────────
  Purpose: Dark/Light/System theme management.

  State:
    theme: 'light' | 'dark' | 'system'
    isDark: boolean (derived from NativeWind's colorScheme)

  Methods:
    setTheme(theme)        — Sets theme + persists to AsyncStorage key "snaplinq_theme"
    toggleTheme()          — Toggles between light ↔ dark

  Persistence:
    AsyncStorage key: "snaplinq_theme"
    Loads saved theme on mount


================================================================================
11. SOURCE CODE - DASHBOARD COMPONENTS
================================================================================

src/components/dashboard/LinkItem.tsx
─────────────────────────────────────
  Purpose: Individual link card in the grid.
  Props:
    link: any               — Link object
    onEdit: (link) => void  — Opens edit modal
  Features:
    - Tap: Opens link in in-app browser (expo-web-browser)
    - Long press: Opens options modal
    - Three-dot menu (MoreVertical) also opens options
    - Fallback avatar: First letter of title on slate background
    - Image error handling: Falls back to letter avatar
  Options modal:
    - Open Link
    - Edit Link
    - Delete Link (with Alert confirmation dialog)

src/components/dashboard/LinkGrid.tsx
─────────────────────────────────────
  Purpose: Responsive grid of links grouped by category.
  Props:
    searchQuery: string     — Filters links by title or URL
    onEdit: (link) => void  — Opens edit modal for a link
  Features:
    - Groups links by category
    - Each category has a header with count and emerald accent bar
    - Non-"Uncategorized" categories have a delete button (Trash2)
    - FlatList with dynamic numColumns based on screen width
    - Loading state: "Loading your vault..."
    - Empty state: "No links found — Tap + to add your first link"
    - 24px bottom padding for FAB clearance

src/components/dashboard/AddLinkModal.tsx
─────────────────────────────────────────
  Purpose: Add/Edit link form presented as a modal.
  Props:
    visible: boolean        — Show/hide
    onClose: () => void     — Close handler
    editLink?: any          — If provided, populates form for editing
  Form fields:
    - URL (auto-fills title, icon, category on blur)
    - Title
    - Category (horizontal pill selector with all categories)
    - "+ New" pill to add custom category inline
  Auto-fill on URL blur:
    - Title: generateTitle(url)
    - Icon: getFavicon(url)
    - Category: categorizeUrl(url)
  Submit behavior:
    - Edit mode: updateLink(editLink.id, data)
    - Add mode: addLink(data)
    - Resets form and closes modal on success


================================================================================
12. SOURCE CODE - APP SCREENS (ROUTES)
================================================================================

File-based routing via Expo Router. Each file in app/ = a route.

app/_layout.tsx — ROOT LAYOUT
──────────────────────────────
  Wraps all screens with context providers (outermost → innermost):
    1. AuthProvider
    2. ThemeProvider
    3. LinkProvider
  Stack navigator:
    - "index"    → Dashboard (default)
    - "login"    → Login screen
    - "add-link" → Add Link (presentation: 'modal')
  Imports global.css for Tailwind styles.
  StatusBar: style="auto"

app/index.tsx — DASHBOARD
─────────────────────────
  Auth guard: Redirects to /login if no session.
  Header (sticky, top):
    - Logo: LinearGradient emerald→cyan, letter "S", text "Snaplinq"
    - Search bar: Search icon + Input (rounded-full)
    - Theme toggle: Sun/Moon icon
    - Add button: Emerald FAB with Plus icon
    - Logout: LogOut icon (red)
  Body:
    - ScrollView wrapping LinkGrid
  Modal:
    - AddLinkModal (shown on FAB press or edit)

app/login.tsx — LOGIN
─────────────────────
  Full-screen centered card with dark theme.
  Elements (top to bottom):
    1. Logo: LinearGradient square with letter "L"
    2. Heading: "Welcome Back" / "Create Account"
    3. Subtitle: "Sign in to access your Snaplinq"
    4. Google button: "G Continue with Google"
    5. Divider: "OR CONTINUE WITH EMAIL"
    6. Email input
    7. Password input (secureTextEntry)
    8. "Keep me logged in" toggle (Switch, emerald track)
    9. "Sign In" / "Sign Up" button (emerald, full width)
    10. Toggle: "Don't have an account? Sign Up"
  Auth logic:
    - signUp: supabase.auth.signUp + "Check your email" alert
    - signIn: supabase.auth.signInWithPassword + router.replace('/')
    - Google: calls signInWithGoogle() from AuthContext

app/add-link.tsx — ADD LINK (SHARE TARGET)
──────────────────────────────────────────
  Presented as modal (from _layout.tsx config).
  Reads shared URL from route params (params.url).
  Auto-fills title and category from shared URL.
  Form fields: URL, Title, Category (display only).
  Buttons: Cancel (ghost) | Save Link (primary).
  On save: addLink() → router.back()


================================================================================
13. DEPENDENCIES (EVERY PACKAGE)
================================================================================

PRODUCTION DEPENDENCIES
───────────────────────
Package                                     | Version     | Purpose
───────────────────────────────────────────|────────────|──────────────────────────
@expo/vector-icons                          | ^15.0.3    | Expo icon fonts
@react-native-async-storage/async-storage   | ^2.2.0     | Persistent key-value storage
@react-native-google-signin/google-signin   | ^16.1.1    | Native Google Sign-In SDK
@react-navigation/bottom-tabs               | ^7.4.0     | Bottom tab navigator
@react-navigation/elements                  | ^2.6.3     | Navigation UI elements
@react-navigation/native                    | ^7.1.8     | Core navigation
@supabase/supabase-js                       | ^2.95.3    | Supabase client (auth, DB)
clsx                                        | ^2.1.1     | Conditional class merging
expo                                        | ~54.0.33   | Expo SDK
expo-constants                              | ~18.0.13   | Expo constants
expo-font                                   | ~14.0.11   | Custom font loading
expo-haptics                                | ~15.0.8    | Haptic feedback
expo-image                                  | ~3.0.11    | Optimized image component
expo-linear-gradient                        | ^15.0.8    | Linear gradient views
expo-linking                                | ~8.0.11    | Deep linking
expo-router                                 | ~6.0.23    | File-based routing
expo-splash-screen                          | ~31.0.13   | Splash screen control
expo-status-bar                             | ~3.0.9     | Status bar styling
expo-symbols                                | ~1.0.8     | SF Symbols (iOS)
expo-system-ui                              | ~6.0.9     | System UI customization
expo-web-browser                            | ~15.0.10   | In-app browser
lucide-react-native                         | ^0.564.0   | Icon library (SVG icons)
nativewind                                  | ^4.2.1     | TailwindCSS for React Native
react                                       | 19.1.0     | React core
react-dom                                   | 19.1.0     | React DOM (web)
react-native                                | 0.81.5     | React Native core
react-native-gesture-handler                | ~2.28.0    | Touch gesture system
react-native-reanimated                     | ~4.1.1     | Animation library
react-native-receive-sharing-intent         | ^2.0.0     | Share intent receiver (*)
react-native-safe-area-context              | ~5.6.0     | Safe area insets
react-native-screens                        | ~4.16.0    | Native screen containers
react-native-url-polyfill                   | ^3.0.0     | URL API polyfill
react-native-web                            | ~0.21.0    | React Native → Web bridge
react-native-worklets                       | 0.5.1      | Reanimated worklets
tailwind-merge                              | ^3.4.0     | Smart Tailwind class merging
tailwindcss                                 | ^3.4.19    | CSS utility framework

(*) react-native-receive-sharing-intent is INSTALLED but NOT in app.json plugins.
    It requires a custom EAS development build to function.
    Currently disabled in app/index.tsx (import commented out).

DEV DEPENDENCIES
────────────────
Package                | Version     | Purpose
──────────────────────|────────────|──────────────────────
@types/react           | ~19.1.0    | TypeScript types for React
eslint                 | ^9.25.0    | Linter
eslint-config-expo     | ~10.0.0    | Expo ESLint config
prettier               | ^3.8.1     | Code formatter
typescript             | ~5.9.2     | TypeScript compiler


================================================================================
14. ENVIRONMENT VARIABLES
================================================================================

File: .env (root of snaplinq/)
NOT committed to git (.gitignore includes .env)

EXPO_PUBLIC_SUPABASE_URL=https://ohwnivrapwxvunfmjzam.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iOKYlNbjj1AKqAqvQrZqvw_tVNgztfr

The EXPO_PUBLIC_ prefix makes these available in the client bundle.
These are the SAME credentials used by the web app (link/ directory).

For Vercel deployment, these must be set as Environment Variables in
the Vercel project settings dashboard.


================================================================================
15. AUTHENTICATION FLOW
================================================================================

GOOGLE SIGN-IN
──────────────

  [Web Platform]
  1. User taps "Continue with Google"
  2. supabase.auth.signInWithOAuth({ provider: 'google' })
  3. Browser redirects to Google consent screen
  4. Google redirects back to app URL with auth code
  5. Supabase exchanges code for session
  6. onAuthStateChange fires → user + session set
  7. Dashboard renders

  [Mobile Platform]
  1. User taps "Continue with Google"
  2. GoogleSignin.signIn() opens native Google prompt
  3. Returns idToken
  4. supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })
  5. Supabase validates token and creates session
  6. onAuthStateChange fires → user + session set
  7. Dashboard renders

  REQUIRED SETUP (Mobile):
  - iOS:     GoogleService-Info.plist in project root
  - Android: google-services.json in project root
  - Google Cloud Console: Create OAuth Client IDs for each platform
  - Bundle ID: com.snaplinq.app
  - Package:  com.snaplinq.app

EMAIL/PASSWORD SIGN-IN
──────────────────────
  1. User enters email + password
  2. Sign Up: supabase.auth.signUp() → confirmation email sent
  3. Sign In: supabase.auth.signInWithPassword() → session created
  4. router.replace('/') → Dashboard


================================================================================
16. DATABASE SCHEMA (SUPABASE)
================================================================================

Table: "links"
──────────────
Column      | Type      | Description
────────────|──────────|────────────────────────────
id          | uuid      | Primary key (auto-generated)
url         | text      | The bookmark URL
title       | text      | Display title
icon        | text      | Favicon URL (nullable)
category    | text      | Category name (e.g., "Coding")
created_at  | timestamp | Creation timestamp (ISO 8601)
user_id     | uuid      | Foreign key to auth.users

RLS (Row Level Security): Enabled
  - Users can only SELECT, INSERT, UPDATE, DELETE their own links
  - Enforced by: user_id = auth.uid()


================================================================================
17. DEPLOYMENT (VERCEL / WEB)
================================================================================

STATIC EXPORT
─────────────
  Command: npx expo export --platform web
  Output:  dist/ directory containing:
    - index.html (SPA entry point)
    - _expo/static/css/web-*.css (Tailwind styles)
    - _expo/static/js/web/entry-*.js (App bundle, ~3.95 MB)
    - assets/ (fonts, images)
    - metadata.json

VERCEL SETUP
────────────
  1. Create new Vercel project
  2. Connect to GitHub repository (snaplinq)
  3. Root Directory: ./ (or leave default)
  4. Build Command: npx expo export --platform web
  5. Output Directory: dist
  6. Framework Preset: Other
  7. Environment Variables:
     - EXPO_PUBLIC_SUPABASE_URL = https://ohwnivrapwxvunfmjzam.supabase.co
     - EXPO_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_iOKYlNbjj1AKqAqvQrZqvw_tVNgztfr
  8. SPA Rewrites: Handled by vercel.json

  Alternative: npx vercel --prod (CLI deployment)


================================================================================
18. MOBILE BUILD (iOS / ANDROID)
================================================================================

DEVELOPMENT (Expo Go)
─────────────────────
  npx expo start
  Press 'i' for iOS Simulator
  Press 'a' for Android Emulator
  Scan QR code for physical device

  Note: Google Sign-In does NOT work in Expo Go.
  Use email/password auth for testing in Expo Go.

PRODUCTION BUILD (EAS Build)
────────────────────────────
  1. npm install -g eas-cli
  2. eas login
  3. eas build:configure
  4. iOS:     eas build --platform ios
  5. Android: eas build --platform android
  6. Submit:  eas submit --platform ios/android

  For Google Sign-In to work:
  - Add GoogleService-Info.plist (iOS)
  - Add google-services.json (Android)
  - Add to app.json ios.googleServicesFile / android.googleServicesFile

DEEP LINKING
────────────
  URL Scheme: snaplinq://
  Supported: Yes (via expo-linking + scheme in app.json)
  Example:   snaplinq://add-link?url=https://example.com


================================================================================
19. KNOWN LIMITATIONS
================================================================================

1. Google Sign-In requires custom dev build (not Expo Go)
2. react-native-receive-sharing-intent requires EAS build (currently disabled)
3. No offline support yet (requires network for Supabase queries)
4. Categories are partially local-only (custom categories not persisted to DB)
5. No image preview/thumbnail generation from URLs
6. Search is client-side only (filters after all links are fetched)
7. FlatList numColumns requires key change to re-render on rotation
8. Web bundle is ~3.95 MB uncompressed (Vercel serves gzipped)


================================================================================
20. FUTURE ENHANCEMENTS
================================================================================

1. Share Intent support (re-enable react-native-receive-sharing-intent with EAS)
2. Offline mode with local SQLite cache + Supabase sync
3. Push notifications for shared links
4. Folder/Collection organization (nested categories)
5. Link preview thumbnails (Open Graph image extraction)
6. Import/Export bookmarks (Chrome, Safari, Firefox)
7. Collaborative collections (shared with other users)
8. Widget support (iOS 17 widgets, Android widgets)
9. Biometric auth (Face ID, fingerprint)
10. Chrome Extension companion (already designed, see web app repo)


================================================================================
                              END OF DOCUMENT
================================================================================
