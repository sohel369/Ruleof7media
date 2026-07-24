# Rule7Media - Full-Stack Lead Gen, Affiliate Tracking & CRM System

Rule7Media is a production-ready, full-stack B2B marketing funnel, affiliate referral tracker, and CRM admin dashboard. It leverages real-time WebSocket communication and a progressive lead profiling gating system to qualify prospects and attribute regional wraps.

---

## Technical Stack

* **Frontend**: React, React Router, Tailwind CSS, Recharts (for analytics), Socket.io-client
* **Backend**: Node.js, Express, Socket.io (for WebSockets), Mongoose / MongoDB (with automatic JSON file-based database fallback)
* **Design**: Premium dark SaaS interface, glassmorphism boundaries, micro-interactions, responsive sizing.

---

## Architecture Details

### 1. Progressive Funnel Gating
Prospects scan partner wraps (linked via URL `?ref=xxxx`) and land on the funnel.
* **Progressive Inputs**:
  * Video 1: Full Name, Business Email, Company Name
  * Video 2: Job Title / Role
  * Video 3: Industry / Sector
  * Video 4: Monthly Marketing Budget
  * Video 5: Fleet Count / Size
  * Video 6: Primary Campaign Goals
  * Video 7: Additional request notes & confirmation
* **Verification Quizzes**: Each video module features verification questions checking user understanding. User cannot advance to Video `n` unless they pass the quiz and save data on Video `n-1`.

### 2. Lead Scoring Engine
Qualified leads receive an automatic score (0–100) calculated by the backend:
1. **Video Completion (+40%)**: Proportional progress `(completed_video / 7) * 40`.
2. **Budget Range (+20%)**: Up to 20 points for Enterprise budgets ($10,000+).
3. **Fleet Size (+15%)**: Up to 15 points for commercial fleets (25+ vehicles).
4. **Quiz Accuracy (+15%)**: Percent correct of total questions * 15.
5. **Affiliate Source (+10%)**: Boost score if lead originated from an affiliate referral.

**Categories**:
* **Cold**: `0 - 40`
* **Warm**: `41 - 70`
* **Hot**: `71 - 100`

### 3. Real-Time Telemetry & Simulation
* **Live Activity logs**: Socket.io broadcasts new leads, step completions, and scan alerts immediately to open CRM views.
* **QR Wrap Scan Simulator**: Simulates real-time scans on physical wraps (located in Sydney, Chicago, etc.) and pushes clicks to the respective affiliate.
* **Webhook Simulator**: Allows admins to trigger POST requests containing lead details to partner endpoints with a visual execution console.

---

## Installation & Running

### Prerequisites
* **Node.js** (v18+) and **npm** installed.
* *(Optional)* Local **MongoDB** running on default port `27017`. If MongoDB is not running, the application will automatically fall back to writing to a local JSON file (`backend/rule7_local_db.json`), requiring no configuration or installation.

### Quick Start
1. Navigate to the root directory `rule7media-fullstack`.
2. Run `npm run install-all` to download all dependencies in root, frontend, and backend folders.
3. Start client and server concurrently in development mode:
   ```bash
   npm run dev
   ```
4. Open your browser to **`http://localhost:3000`** to view the application.

---

## Route Index

### 1. Public Funnel (Marketing)
* `/` -> Funnel Landing/Capture
* `/video-1` to `/video-7` -> Gated videos & quizzes
* `/complete` -> Success landing showing score bracket (Cold/Warm/Hot)

### 2. Affiliate Portal
* `/affiliate` -> Partnership Hub
* `/affiliate/apply` -> Join Form
* `/affiliate/dashboard` -> Active partner performance counters & QR scan simulator
* `/affiliate/links` -> Copy custom referral URLs
* `/affiliate/earnings` -> Commission tier list and leaderboard rankings

### 3. Admin CRM Dashboard
* `/admin/login` -> Admin bypass panel (password: `admin` or `rule7media`)
* `/admin/dashboard` -> KPI metrics, Recharts funnel, and live socket.io stream feed
* `/admin/leads` -> Grid list of leads with multi-dropdown filters
* `/admin/leads/:id` -> Deep profiles, timeline, routing assigner, and webhook transmitter
* `/admin/routing` -> Webhook event logs
* `/admin/reports` -> Charts showing performance trends
* `/admin/settings` -> Configuration of scoring weights
