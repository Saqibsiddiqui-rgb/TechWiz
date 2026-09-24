# Campus Coin — Smart Spending. Student Style.

Frontend prototype for the Techwiz 7 "Campus Coin" SRS (NextGen BudgetBee).
React + TypeScript + Tailwind CSS + Lucide icons. All data is mock data held in
local state and saved to `localStorage`, so the app works with no backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Requires Node 18 or newer.

## Demo accounts

| Role    | URL             | Email                     | Password     |
|---------|-----------------|---------------------------|--------------|
| Student | `#/login`       | alex.khan@campus.edu.pk   | student123   |
| Admin   | `#/admin/login` | admin@campuscoin.pk       | admin123     |

Both login screens have a "Fill it in for me" button. Any new account created
on the Register page also works for the current browser session.
To start over: Settings → Preferences → Reset demo data.

## Routes

Public: `/`, `/login`, `/register`, `/forgot-password`, `/admin/login`
Student: `/app`, `/app/transactions`, `/app/add-expense`, `/app/add-income`,
`/app/categories`, `/app/budgets`, `/app/reports`, `/app/insights`, `/app/tips`,
`/app/bookmarks`, `/app/notifications`, `/app/profile`, `/app/settings`
Admin: `/admin`, `/admin/users`, `/admin/categories`, `/admin/tips`, `/admin/stats`

`/app/*` is guarded to the student role and `/admin/*` to the admin role.

## Project structure

```
src/
  lib/          types, formatting, hash router, global store, analytics, AI categoriser
  data/mock.ts  seed data (Alex Khan, Sept 2026 transactions, budgets, insights, admin data)
  components/
    ui/         Button, Card, Input/Select/Toggle/Segmented, Badge, ProgressBar, Modal, Toast, EmptyState, Tabs
    charts/     BarChart, AreaChart, DonutChart, ShareBars (dependency-free SVG)
    Brand.tsx   logo + category icons
    Finance.tsx StatCard, TransactionRow, BudgetLine, InsightCard, TipCard
    TransactionForm.tsx  quick-add form with AI category suggestion
  layouts/      StudentLayout (sidebar, topbar, mobile nav), AdminLayout
  pages/        public/, app/, admin/
```

## Notes on design decisions

- **Charts are hand-written SVG** instead of Recharts, to keep the bundle small
  and let charts follow the light/dark theme tokens directly.
- **Hash routing** (`#/app/...`) so the build can be hosted on any static host
  without server rewrites.
- **AI features are simulated**: `src/lib/ai.ts` is a keyword-based categoriser
  that also learns from the student's corrections. Insights and tips are seeded.
  Everything AI-generated is labelled as a suggestion, not financial advice
  (SRS §1.5). A real version would call an AI API from the backend.
- **Budget alerts** fire at 80% and 100% of a category limit as both a toast
  and an in-app notification.
- **Exports**: PDF uses the browser print dialog with a print stylesheet;
  image export draws the report to a canvas and downloads a PNG.

## Not included (backend scope)

Real authentication, database, email sending and the SQL schema are outside
this frontend prototype. The data shapes in `src/lib/types.ts` mirror the SRS
entities (User, Category, Transaction, Budget, Insight) as a starting point.

## AI tools used

<!-- Techwiz rules require listing every AI tool used. Fill in and keep honest. -->
- Claude (Anthropic): used to scaffold the UI prototype. List here what you
  reviewed, changed and built yourself.
