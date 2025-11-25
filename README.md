# QyshKePassi – Wi-Fi QR Code Vault

QyshKePassi (Albanian for “How’s the password?”) is a React 19 + Vite application that lets people generate, share, print, export, and safely store Wi-Fi QR codes. It couples a polished onboarding experience with Supabase authentication, email verification, i18n, theming, and a card vault that travels with the user across devices.

## Table of Contents
- [Feature Highlights](#feature-highlights)
- [Technology Stack](#technology-stack)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Authentication & Data Protection](#authentication--data-protection)
- [Internationalization, UX, and Accessibility](#internationalization-ux-and-accessibility)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
- [Supabase Schema](#supabase-schema)
- [Project Structure](#project-structure)
- [Testing & Quality Notes](#testing--quality-notes)
- [Roadmap & Known Gaps](#roadmap--known-gaps)
- [License](#license)

## Feature Highlights
- **Guided onboarding** – A `SlideToStart` interaction, Lottie animations, and Framer Motion transitions ease users into the main builder.
- **QR generator for Wi-Fi networks** – Build Wi-Fi payloads (`WIFI:T:...;S:...;P:...;;`), validate via `react-hook-form`, pick encryption (WPA/WEP/open), and auto-generate strong passwords.
- **Real-time previews** – Render QR previews with `react-qrcode-logo` and persist the chosen style in local state.
- **Share & export workflows** – Copy passwords, download PNG/JPEG, export PDF (`jsPDF`), print-friendly overlays, and WhatsApp deep links. `file-saver` streams binary downloads.
- **Supabase-backed vault** – Authenticated & confirmed users can store up to 10 Wi-Fi cards, search, edit in place, delete individually or in bulk, and pull the freshest card into the builder.
- **Email verification gate** – `EmailVerificationScreen` blocks access to saved cards until `email_confirmed_at` is set, with resend support using `supabase.auth.resend`.
- **Profile management** – Update display name/password, inspect account metadata, and wipe the account through a Supabase Edge Function (`hyper-processor`) that handles cascading deletes securely server-side.
- **Theming & persistence** – `ThemeContext` toggles between dark/light, synced with `localStorage` and OS preferences; `GlobalContext` caches the most recent QR session to survive reloads.
- **Internationalization** – English + Albanian translations via `i18next`/`react-i18next`, with persisted language preference.
- **Responsive UI kit** – Tailwind CSS 4 utility classes + custom CSS variables, Lucide icons, and headless UI primitives keep components consistent.
- **Toast notifications** – `react-toastify` surfaces success/error states across auth, QR generation, exports, and destructive actions.

## Technology Stack
- **Runtime & build:** React 19, Vite (Rolldown variant), JavaScript (ESM).
- **State & data:** Context API (`AuthContext`, `GlobalContext`, `CardContext`, `ThemeContext`), TanStack React Query for server-cache defaults.
- **Forms & UX:** `react-hook-form`, `framer-motion`, `lottie-react`, `lucide-react`.
- **QR & assets:** `qrcode` for data URLs, `react-qrcode-logo` (with room for `@liquid-js/qr-code-styling` customizations), `file-saver`, `jsPDF`.
- **Backend-as-a-Service:** Supabase Auth, Postgres (`wifi_cards` table), Edge Functions for privileged actions.
- **Internationalization:** `i18next`, `react-i18next`, JSON locale dictionaries (`en.json`, `sq.json`).
- **Styling:** Tailwind CSS 4 + CSS variables (`index.css`) for semantic color tokens, transitions, and responsive typography.
- **Routing:** `react-router-dom@7` (BrowserRouter, nested layouts, guarded routes).
- **Notifications:** `react-toastify`.

## Architecture at a Glance
- `src/App.jsx` bootstraps contexts (Theme → Auth → Card → Global), React Query, router, and orchestrates landing/verification/main phases.
- **Layouts**: `Landing` for hero + onboarding; `Shared` wraps authenticated routes with persistent header/footer, modals, and theme toggles.
- **Pages**:
  - `Main` – the builder that drives QR generation, password strength, encryption selection, and share actions.
  - `ProfilePage` – account metadata, inline editing (`EditableField`), card summary, and dangerous actions.
  - `SaveCardsPage` – search, pagination, edit/delete, and injection of stored cards back into the generator flow.
  - `NotFound` – fallback route.
- **Context responsibilities**:
  - `AuthContext` → login/register/logout, email confirmation status, resend confirmation helper.
  - `CardContext` → fetch/save/update/delete rows from Supabase `wifi_cards`, memoized “latest card”, max-card enforcement.
  - `GlobalContext` → UI state for the generator (form visibility, cached QR info, optimistic error messaging).
  - `ThemeContext` → global light/dark switch with localStorage persistence.
- **Key UI Components**: `FormWrapper`, `FormInput`, `PasswordInput`, `EncryptionSelector`, `ShareQRCode`, `QrCard`, `ProtectedRoute`, `ProtectedWrapper`, `AuthModal`, `DeleteAccountModal`, `DeleteCardModal`, `EmailVerificationScreen`, `SlideToStart`.

## Authentication & Data Protection
- **Supabase Auth** drives email/password login + registration. `AuthProvider` listens to `onAuthStateChange`.
- **Email confirmation enforcement**: Non-confirmed users are redirected to the verification screen; QR saving is blocked until `isConfirmed` is true.
- **Secure storage**: Saved QR cards live in Supabase `wifi_cards`, filtered by `user_id`. CRUD actions are performed client-side via Supabase SDK; Row-Level Security should enforce `auth.uid() = user_id` (configure server-side).
- **Account deletion**: `ProfilePage` calls a Supabase Edge Function (`hyper-processor`) passing the JWT, ensuring server-side cleanup (cards + auth profile) without exposing elevated keys.
- **Client-side persistence**: Non-sensitive session data (theme preference, last QR session, onboarding completion flag, toast gating) leverage `localStorage`. Passwords stay only in memory/localStorage for the active session; saving to Supabase is optional and user-triggered.

## Internationalization, UX, and Accessibility
- English (`en.json`) and Albanian (`sq.json`) resources load via `i18next`; selected language persists in `localStorage`.
- All interactive elements use Lucide icons plus text labels for better readability.
- Buttons and cards respect focus outlines & WCAG contrast by using semantic CSS variables.
- Motion (Framer Motion, Lottie) is purely decorative; core flows still operate without animation.


## Screenshot
![Screenshot](https://github.com/user-attachments/assets/d543c448-f2b0-4e15-a59a-2f3bfa850147)


## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ (ships with recent Node)
- A Supabase project with:
  - Auth (email/password) enabled
  - Edge Function deployed at `/functions/v1/hyper-processor` (optional but required for account deletion)
  - `wifi_cards` table (see schema below)

### Environment Variables
Create `.env` (or `.env.local`) in the project root:
```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```
> The app throws on startup if either variable is missing (see `src/api/supabaseClient.jsx`), preventing accidental builds without backend connectivity.

### Installation
```bash
git clone https://github.com/<your-org>/QyshKePassi.git
cd QyshKePassi
npm install
npm run dev        # starts Vite on http://localhost:5173
```

### Available Scripts
- `npm run dev` – Vite dev server with HMR + React Fast Refresh.
- `npm run build` – Production build (rolldown-vite) emitting assets in `dist/`.
- `npm run preview` – Serves the production build locally.
- `npm run lint` – ESLint (flat config) verifying `src` + config files.

## Supabase Schema
Create `wifi_cards` with at least the following columns:
| Column       | Type        | Notes                                   |
|--------------|-------------|-----------------------------------------|
| `id`         | uuid        | Primary key, default `gen_random_uuid()`|
| `user_id`    | uuid        | Foreign key to `auth.users.id`         |
| `title`      | text        | Display name shown in cards            |
| `ssid`       | text        | Wi-Fi SSID                             |
| `password`   | text        | Optional password (consider encryption)|
| `encryption` | text        | OPEN/WEP/WPA etc.                      |
| `qr_url`     | text        | Base64 data URL of the QR image        |
| `created_at` | timestamptz | Default `now()`                        |

Implement RLS policies so users only read/write their own rows:
```sql
create policy "Users can manage their cards"
on public.wifi_cards
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## Project Structure
```
.
├── public/                  # Static assets (favicon, Vite SVG)
├── src/
│   ├── api/supabaseClient.jsx
│   ├── assets/              # Lottie JSON, icons, logos
│   ├── components/
│   │   ├── Shared/          # Header, Footer, Delete modals, Auth modal
│   │   ├── UI/              # Button, Dropdown, EditableField, etc.
│   │   └── ...              # Form + QR specific components
│   ├── context/             # Auth, Card, Global, Theme providers
│   ├── hooks/               # `useCards`, `useFadeScale`
│   ├── layouts/             # Landing + authenticated wrapper
│   ├── lib/i18n.js          # i18next setup with `en.json`, `sq.json`
│   ├── pages/               # Main, Profile, Saved Cards, NotFound
│   ├── utils/               # Toast helper, Print QR, etc.
│   ├── App.jsx              # Router + phase manager
│   └── main.jsx             # React root + Toast container mount
├── package.json
├── vite.config.js
├── eslint.config.js
└── LICENSE
```

## Testing & Quality Notes
- No automated tests yet. Focus has been on UX polish and backend integration; consider adding vitest + React Testing Library for components/contexts and contract tests for Supabase interactions.
- ESLint (flat config) is configured via `eslint.config.js`. Run `npm run lint` before publishing.

## Roadmap & Known Gaps
- Improve offline support by caching generated QR images via IndexedDB.
- Add per-card theming (dot shapes, gradients) using `@liquid-js/qr-code-styling`.
- Expand export targets (SVG) and sharing channels (AirDrop, Apple Wallet pass).
- Integrate WebAuthn / OAuth providers in Supabase for passwordless flows.
- Provide automated schema migrations and seed scripts for Supabase.

## License
MIT © 2025 Pleurat Pllana – see [`LICENSE`](LICENSE) for full text.
