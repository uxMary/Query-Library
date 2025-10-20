# Query Library Code Dump

## `query-library-app/package.json`

```json
{
  "name": "query-library-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "@mui/icons-material": "^5.15.20",
    "@mui/material": "^5.15.20",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.4.5",
    "vite": "^5.4.0"
  }
}

```

## `query-library-app/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

## `query-library-app/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

```

## `query-library-app/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Query Library</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

## `query-library-app/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

```

## `query-library-app/src/App.tsx`

```tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import QueryDetail from './pages/QueryDetail';
import Folders from './pages/Folders';
import SchedulesInbox from './pages/SchedulesInbox';
import Housekeeping from './pages/Housekeeping';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:slug" element={<Folders />} />
        <Route path="/query/:id" element={<QueryDetail />} />
        <Route path="/schedules" element={<SchedulesInbox />} />
        <Route path="/housekeeping" element={<Housekeeping />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

```

## `query-library-app/src/types.ts`

```typescript
export type QueryType = 'Athena' | 'Practice' | 'Custom';

export interface Folder {
  id: string;
  name: string;
  description?: string;
}

export interface QueryFilter {
  name: string;
  value: string;
}

export interface QueryConfig {
  columns: string[];
  filters: QueryFilter[];
}

export interface ActivityEvent {
  at: string; // ISO
  by: string;
  action: string; // e.g., 'Executed', 'Updated', 'Schedule Modified'
  details?: string;
}

export interface QueryItem {
  id: string;
  name: string;
  description?: string;
  type: QueryType;
  folderId: string;
  tags: string[];
  owner: string;
  sql: string;
  createdBy: string;
  createdOn: string; // ISO
  lastRun?: string; // ISO
  lastModified: string; // ISO
  favorite?: boolean;
  sharedBy?: string;
  accessLevel?: 'Viewer' | 'Editor' | 'Owner';
  config?: QueryConfig;
  activity?: ActivityEvent[];
}

export interface ScheduleItem {
  id: string;
  queryId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Ad-hoc';
  nextRun?: string; // ISO
  lastRun?: string; // ISO
  status: 'Scheduled' | 'Success' | 'Failed' | 'Paused';
  recipients?: string[];
  scheduledBy?: string;
}

export interface InboxItem {
  id: string;
  queryId: string;
  date: string; // ISO
  status: 'New' | 'Read' | 'Archived' | 'Failed' | 'Paused';
  hasAttachment?: boolean;
  recipients?: string[];
  scheduledBy?: string;
}

```

## `query-library-app/src/data/mock.ts`

```typescript
import { Folder, InboxItem, QueryItem, ScheduleItem } from '@/types';

export const folders: Folder[] = [
  { id: 'fin', name: 'Financial Performance', description: 'Revenue, AR, payments' },
  { id: 'ops', name: 'Operational Efficiency', description: 'Throughput and operations' },
  { id: 'appt', name: 'Appointments and Scheduling', description: 'Access and utilization' },
  { id: 'cred', name: 'Credentialing and Enrollment' },
  { id: 'ref', name: 'Referral Management' },
  { id: 'px', name: 'Patient Engagement and Experience' },
  { id: 'care', name: 'Care Team Coordination and Care Transitions' },
  { id: 'quality', name: 'Quality of Care and Performance' },
  { id: 'pop', name: 'Population Health Management' },
  { id: 'ed', name: 'Emergency Department (EP) and Hospital Metrics' },
  // Custom/user folders
  { id: 'my', name: 'My Folder', description: 'Personal saved queries' },
  { id: 'billing', name: 'Billing Team', description: 'Shared billing team workspace' },
  { id: 'quarterly', name: 'My Quarterly Runs', description: 'Quarterly runbook and reports' },
];

export const tags = [
  'AR Days', 'Denials', 'No-Show', 'Utilization', 'Payer Mix', 'Readmission', 'LOS', 'Provider Productivity',
  'Referrals', 'Patient Portal', 'HEDIS', 'Risk Stratification', 'Scheduling Access'
];

export const queries: QueryItem[] = [
  {
    id: 'q1',
    name: 'AR Days by Payer',
    description: 'Accounts Receivable days grouped by payer over last quarter',
    type: 'Athena',
    folderId: 'fin',
    tags: ['AR Days', 'Payer Mix'],
    owner: 'Athena Intelligence',
    sql: 'SELECT payer, AVG(ar_days) FROM ar_metrics WHERE date >= CURRENT_DATE - INTERVAL 90 DAY GROUP BY payer;',
    createdBy: 'athena',
    createdOn: '2024-05-01',
    lastRun: '2025-09-29T10:15:00Z',
    lastModified: '2025-09-20',
    favorite: true,
    sharedBy: 'system',
    accessLevel: 'Viewer',
    config: {
      columns: ['patient_id', 'revenue_amount', 'service_date', 'payment_status', 'insurance_type', 'provider_name', 'department'],
      filters: [
        { name: 'service_date', value: 'Last 30 days' },
        { name: 'payment_status', value: 'Partially Paid' },
        { name: 'department', value: 'Radiology + Providers' }
      ]
    },
    activity: [
      { at: '2025-06-10T09:00:00Z', by: 'John Smith', action: 'Executed', details: '1,250 records processed' },
      { at: '2025-06-09T14:30:00Z', by: 'Sarah Johnson', action: 'Schedule Modified', details: 'Weekly → Monthly' },
      { at: '2025-06-08T11:45:00Z', by: 'Mike Davis', action: 'Updated', details: 'Added payment_status filter' }
    ]
  },
  {
    id: 'q2',
    name: 'Clinic No-Show Rate',
    description: 'No-show rate by clinic and provider',
    type: 'Practice',
    folderId: 'appt',
    tags: ['No-Show', 'Scheduling Access'],
    owner: 'Ops Analytics',
    sql: 'SELECT clinic, provider, no_show_rate FROM scheduling_kpis ORDER BY no_show_rate DESC;',
    createdBy: 'jdoe',
    createdOn: '2024-11-15',
    lastRun: '2025-09-28T13:30:00Z',
    lastModified: '2025-09-25',
    config: {
      columns: ['clinic', 'provider', 'no_show_rate'],
      filters: [
        { name: 'date', value: 'Last 12 weeks' },
        { name: 'clinic', value: 'All' }
      ]
    },
    activity: [
      { at: '2025-09-28T13:30:00Z', by: 'jdoe', action: 'Executed' },
      { at: '2025-09-20T10:00:00Z', by: 'jdoe', action: 'Updated', details: 'Adjusted week window' }
    ]
  },
  {
    id: 'q3',
    name: 'Readmission Risk Cohort',
    description: 'Patients with high readmission risk scores',
    type: 'Custom',
    folderId: 'pop',
    tags: ['Readmission', 'Risk Stratification'],
    owner: 'Population Health',
    sql: 'SELECT patient_id, risk_score FROM readmission_risk WHERE risk_score > 0.8;',
    createdBy: 'asmith',
    createdOn: '2025-01-06',
    lastModified: '2025-09-15',
    favorite: true,
    sharedBy: 'asmith',
    accessLevel: 'Owner',
    config: {
      columns: ['patient_id', 'risk_score'],
      filters: [
        { name: 'risk_score', value: '> 0.8' }
      ]
    },
    activity: [
      { at: '2025-09-27T09:00:00Z', by: 'asmith', action: 'Executed' },
      { at: '2025-09-15T08:00:00Z', by: 'asmith', action: 'Updated', details: 'Refined cohort threshold' }
    ]
  },
  {
    id: 'q4',
    name: 'Provider Productivity Dashboard',
    description: 'RVUs, visits, and utilization by provider',
    type: 'Athena',
    folderId: 'ops',
    tags: ['Provider Productivity', 'Utilization'],
    owner: 'Athena Intelligence',
    sql: 'SELECT provider, rvu, visits FROM productivity WHERE month = DATE_TRUNC("month", CURRENT_DATE);',
    createdBy: 'athena',
    createdOn: '2024-09-10',
    lastRun: '2025-09-27T09:00:00Z',
    lastModified: '2025-09-27',
    config: {
      columns: ['provider', 'rvu', 'visits'],
      filters: [
        { name: 'month', value: 'This Month' }
      ]
    },
    activity: [
      { at: '2025-09-27T09:00:00Z', by: 'athena', action: 'Executed' },
      { at: '2025-09-10T10:00:00Z', by: 'athena', action: 'Created' }
    ]
  },
  {
    id: 'q5',
    name: 'Net Collection Rate',
    description: 'Percent of collectible revenue actually collected over period',
    type: 'Athena',
    folderId: 'fin',
    tags: ['Collections', 'Revenue'],
    owner: 'Finance Analytics',
    sql: 'SELECT period, net_collection_rate FROM revenue_kpis ORDER BY period DESC LIMIT 12;',
    createdBy: 'mkhan',
    createdOn: '2024-07-12',
    lastRun: '2025-09-29T08:00:00Z',
    lastModified: '2025-09-22'
  },
  {
    id: 'q6',
    name: 'Payment Posting Lag',
    description: 'Average days between payment date and posting date',
    type: 'Practice',
    folderId: 'fin',
    tags: ['Payments', 'Lag'],
    owner: 'Revenue Cycle',
    sql: 'SELECT payer, AVG(DATEDIFF(day, payment_date, posted_date)) AS posting_lag FROM payments GROUP BY payer;',
    createdBy: 'sjones',
    createdOn: '2024-08-05',
    lastRun: '2025-09-26T12:00:00Z',
    lastModified: '2025-09-26'
  },
  {
    id: 'q7',
    name: 'OR Utilization by Room',
    description: 'Operating room utilization by room and daypart',
    type: 'Athena',
    folderId: 'ops',
    tags: ['Utilization'],
    owner: 'Operations',
    sql: 'SELECT room, daypart, utilization FROM or_utilization WHERE date >= CURRENT_DATE - INTERVAL 30 DAY;',
    createdBy: 'opsbot',
    createdOn: '2024-10-12',
    lastRun: '2025-09-30T07:30:00Z',
    lastModified: '2025-09-30'
  },
  {
    id: 'q8',
    name: 'Throughput Time by Department',
    description: 'Average patient throughput time from check-in to checkout',
    type: 'Practice',
    folderId: 'ops',
    tags: ['Throughput'],
    owner: 'Ops Analytics',
    sql: 'SELECT department, AVG(TIMESTAMPDIFF(minute, check_in, check_out)) AS minutes FROM visits GROUP BY department;',
    createdBy: 'bchan',
    createdOn: '2024-06-20',
    lastRun: '2025-09-29T16:00:00Z',
    lastModified: '2025-09-29'
  },
  {
    id: 'q9',
    name: 'No-Show Rate Trend',
    description: 'Weekly trend of no-show rate across clinics',
    type: 'Practice',
    folderId: 'appt',
    tags: ['No-Show'],
    owner: 'Scheduling',
    sql: 'SELECT week, clinic, no_show_rate FROM no_show_trends ORDER BY week DESC;',
    createdBy: 'planner',
    createdOn: '2024-05-18',
    lastRun: '2025-09-28T11:00:00Z',
    lastModified: '2025-09-28'
  },
  {
    id: 'q10',
    name: 'Schedule Fill Rate',
    description: 'Percentage of available appointment slots that were filled',
    type: 'Athena',
    folderId: 'appt',
    tags: ['Scheduling Access'],
    owner: 'Scheduling',
    sql: 'SELECT date, fill_rate FROM schedule_fill WHERE date >= CURRENT_DATE - INTERVAL 60 DAY;',
    createdBy: 'sadmin',
    createdOn: '2024-03-02',
    lastRun: '2025-09-27T09:45:00Z',
    lastModified: '2025-09-27'
  },
  {
    id: 'q11',
    name: 'Activity by Payer',
    description: 'Comprehensive daily revenue activity by payer including payments, adjustments, and outstanding AR with trending analytics.',
    type: 'Athena',
    folderId: 'fin',
    tags: ['Financial', 'Payer', 'Monthly'],
    owner: 'Athena Intelligence',
    sql: 'SELECT payer, SUM(payments) AS total_payments, SUM(adjustments) AS total_adjustments, SUM(outstanding_ar) AS outstanding_ar, DATE_TRUNC("day", activity_date) AS day FROM revenue_activity GROUP BY payer, day ORDER BY day DESC;'
      ,
    createdBy: 'athena',
    createdOn: '2025-08-21',
    lastRun: '2025-09-30T08:30:00Z',
    lastModified: '2025-09-30',
    favorite: true,
    sharedBy: 'system',
    accessLevel: 'Viewer',
    config: {
      columns: ['payer', 'total_payments', 'total_adjustments', 'outstanding_ar', 'day'],
      filters: [
        { name: 'service_date', value: 'Last 30 days' },
        { name: 'payer', value: 'All' }
      ]
    },
    activity: [
      { at: '2025-09-30T08:30:00Z', by: 'athena', action: 'Executed', details: 'Refreshed daily activity' },
      { at: '2025-09-29T12:00:00Z', by: 'athena', action: 'Created' }
    ]
  },
  // Custom queries in custom folders to surface under "My" category
  {
    id: 'cq1',
    name: 'My Favorite Denials Snapshot',
    description: 'Quick view of top denial reasons this month.',
    type: 'Custom',
    folderId: 'my',
    tags: ['Denials', 'Monthly'],
    owner: 'Me',
    sql: 'SELECT reason, COUNT(*) AS cnt FROM denials WHERE month = DATE_TRUNC("month", CURRENT_DATE) GROUP BY reason ORDER BY cnt DESC LIMIT 10;',
    createdBy: 'me',
    createdOn: '2025-09-10',
    lastModified: '2025-09-28'
  },
  {
    id: 'cq2',
    name: 'Billing Follow-up Queue',
    description: 'Accounts requiring billing team attention (aging > 60 days).',
    type: 'Custom',
    folderId: 'billing',
    tags: ['AR Days', 'Billing'],
    owner: 'Billing Team',
    sql: 'SELECT account_id, payer, ar_days FROM ar_accounts WHERE ar_days > 60 ORDER BY ar_days DESC;',
    createdBy: 'billingbot',
    createdOn: '2025-08-15',
    lastModified: '2025-09-22',
    sharedBy: 'billinglead'
  },
  {
    id: 'cq3',
    name: 'Quarterly KPI Pack',
    description: 'Bundle of key revenue and ops KPIs for QBR.',
    type: 'Custom',
    folderId: 'quarterly',
    tags: ['Quarterly', 'KPI'],
    owner: 'Me',
    sql: 'SELECT metric, value FROM quarterly_kpis WHERE quarter = DATE_TRUNC("quarter", CURRENT_DATE);',
    createdBy: 'me',
    createdOn: '2025-07-01',
    lastModified: '2025-09-30',
    favorite: true
  },
  // Populate empty folders: cred, ref, px, care, quality, ed
  { id: 'cred1', name: 'Pending Credentialing Applications', description: 'Open credentialing apps by payer and age', type: 'Practice', folderId: 'cred', tags: ['Credentialing'], owner: 'Operations', sql: 'SELECT payer, COUNT(*) AS pending FROM credentialing WHERE status = "Pending" GROUP BY payer;', createdBy: 'opsbot', createdOn: '2025-09-01', lastModified: '2025-09-18' },
  { id: 'cred2', name: 'Expiring Enrollments', description: 'Providers with enrollments expiring in next 60 days', type: 'Practice', folderId: 'cred', tags: ['Credentialing'], owner: 'Operations', sql: 'SELECT provider, expiration_date FROM enrollments WHERE expiration_date <= CURRENT_DATE + INTERVAL 60 DAY;', createdBy: 'opsbot', createdOn: '2025-09-05', lastModified: '2025-09-20' },
  { id: 'cred3', name: 'Credentialing Cycle Time', description: 'Average days from submission to approval', type: 'Athena', folderId: 'cred', tags: ['Credentialing','Cycle Time'], owner: 'Athena Intelligence', sql: 'SELECT AVG(DATEDIFF(day, submitted_at, approved_at)) AS avg_days FROM credentialing WHERE approved_at IS NOT NULL;', createdBy: 'athena', createdOn: '2025-09-10', lastModified: '2025-09-21' },
  { id: 'ref1', name: 'Referral Leakage', description: 'Referrals sent out of network by specialty', type: 'Athena', folderId: 'ref', tags: ['Referral'], owner: 'Network Mgmt', sql: 'SELECT specialty, COUNT(*) AS out_of_network FROM referrals WHERE in_network = false GROUP BY specialty;', createdBy: 'nmgr', createdOn: '2025-09-03', lastModified: '2025-09-18' },
  { id: 'ref2', name: 'Referral Turnaround Time', description: 'Days from referral to scheduled visit', type: 'Practice', folderId: 'ref', tags: ['Referral','Access'], owner: 'Access Team', sql: 'SELECT AVG(DATEDIFF(day, referral_date, scheduled_date)) AS days FROM referrals WHERE scheduled_date IS NOT NULL;', createdBy: 'access', createdOn: '2025-09-07', lastModified: '2025-09-22' },
  { id: 'ref3', name: 'Unscheduled Referrals', description: 'Open referrals older than 14 days', type: 'Practice', folderId: 'ref', tags: ['Referral'], owner: 'Access Team', sql: 'SELECT id, patient, specialty, referral_date FROM referrals WHERE scheduled_date IS NULL AND referral_date < CURRENT_DATE - INTERVAL 14 DAY;', createdBy: 'access', createdOn: '2025-09-08', lastModified: '2025-09-23' },
  { id: 'px1', name: 'Portal Adoption', description: 'Patients with active portal accounts', type: 'Athena', folderId: 'px', tags: ['Patient Portal'], owner: 'Patient Experience', sql: 'SELECT COUNT(*) AS active_portal_users FROM patients WHERE portal_active = true;', createdBy: 'pexp', createdOn: '2025-09-02', lastModified: '2025-09-18' },
  { id: 'px2', name: 'Message Response Time', description: 'Average hours to respond to patient messages', type: 'Practice', folderId: 'px', tags: ['Patient Portal','Response Time'], owner: 'Patient Experience', sql: 'SELECT AVG(TIMESTAMPDIFF(hour, received_at, responded_at)) AS hours FROM portal_messages WHERE responded_at IS NOT NULL;', createdBy: 'pexp', createdOn: '2025-09-06', lastModified: '2025-09-24' },
  { id: 'px3', name: 'NPS by Department', description: 'Recent patient NPS scores by department', type: 'Custom', folderId: 'px', tags: ['NPS'], owner: 'Me', sql: 'SELECT department, AVG(score) AS nps FROM nps_responses WHERE date >= CURRENT_DATE - INTERVAL 30 DAY GROUP BY department;', createdBy: 'me', createdOn: '2025-09-12', lastModified: '2025-09-28' },
  // More custom queries under 'My Folder'
  { id: 'cq4', name: 'My Denials Drilldown', description: 'Detail view of denials by code, payer, and clinic', type: 'Custom', folderId: 'my', tags: ['Denials','Drilldown'], owner: 'Me', sql: 'SELECT clinic, payer, denial_code, COUNT(*) AS cnt FROM denials WHERE date >= CURRENT_DATE - INTERVAL 30 DAY GROUP BY clinic, payer, denial_code ORDER BY cnt DESC;', createdBy: 'me', createdOn: '2025-09-18', lastModified: '2025-09-28' },
  { id: 'cq5', name: 'My AR Heatmap', description: 'Aging buckets by payer and department', type: 'Custom', folderId: 'my', tags: ['AR Days','Aging'], owner: 'Me', sql: 'SELECT department, payer, SUM(CASE WHEN ar_days<=30 THEN amount ELSE 0 END) AS d0_30, SUM(CASE WHEN ar_days BETWEEN 31 AND 60 THEN amount ELSE 0 END) AS d31_60, SUM(CASE WHEN ar_days BETWEEN 61 AND 90 THEN amount ELSE 0 END) AS d61_90, SUM(CASE WHEN ar_days>90 THEN amount ELSE 0 END) AS d90p FROM ar_accounts GROUP BY department, payer;', createdBy: 'me', createdOn: '2025-09-20', lastModified: '2025-09-29', favorite: true },
  { id: 'cq6', name: 'My Visit Trend', description: 'Weekly visits by clinic and provider', type: 'Custom', folderId: 'my', tags: ['Visits','Trend'], owner: 'Me', sql: 'SELECT week, clinic, provider, visits FROM weekly_visits WHERE week >= DATE_TRUNC("week", CURRENT_DATE) - INTERVAL 12 WEEK ORDER BY week DESC;', createdBy: 'me', createdOn: '2025-09-22', lastModified: '2025-09-30' },
  { id: 'care1', name: 'Care Transitions 7-day Follow-up', description: 'Patients with follow-up within 7 days of discharge', type: 'Athena', folderId: 'care', tags: ['Care Transitions'], owner: 'Care Mgmt', sql: 'SELECT COUNT(*) AS followed_up FROM discharges WHERE follow_up_date <= discharge_date + INTERVAL 7 DAY;', createdBy: 'care', createdOn: '2025-09-04', lastModified: '2025-09-19' },
  { id: 'care2', name: 'Care Coordination Tasks Open', description: 'Open tasks by care coordinator', type: 'Practice', folderId: 'care', tags: ['Care Coordination'], owner: 'Care Mgmt', sql: 'SELECT coordinator, COUNT(*) AS open_tasks FROM care_tasks WHERE status = "Open" GROUP BY coordinator;', createdBy: 'care', createdOn: '2025-09-09', lastModified: '2025-09-25' },
  { id: 'care3', name: 'High-Risk Panel Size', description: 'Current high-risk panel size by coordinator', type: 'Practice', folderId: 'care', tags: ['Population Health'], owner: 'Care Mgmt', sql: 'SELECT coordinator, COUNT(*) AS patients FROM risk_panels WHERE risk = "High" GROUP BY coordinator;', createdBy: 'care', createdOn: '2025-09-11', lastModified: '2025-09-26' },
  { id: 'quality1', name: 'HEDIS Gaps Closed', description: 'Count of closed gaps in last month', type: 'Athena', folderId: 'quality', tags: ['HEDIS','Quality'], owner: 'Quality', sql: 'SELECT measure, COUNT(*) AS closed FROM hedis_gaps WHERE closed_date >= CURRENT_DATE - INTERVAL 30 DAY GROUP BY measure;', createdBy: 'quality', createdOn: '2025-09-01', lastModified: '2025-09-18' },
  { id: 'quality2', name: 'Open Quality Gaps', description: 'Active open gaps by provider', type: 'Practice', folderId: 'quality', tags: ['Quality'], owner: 'Quality', sql: 'SELECT provider, COUNT(*) AS open_gaps FROM hedis_gaps WHERE closed_date IS NULL GROUP BY provider;', createdBy: 'quality', createdOn: '2025-09-05', lastModified: '2025-09-22' },
  { id: 'quality3', name: 'Measure Compliance Trend', description: 'Monthly compliance trend for key measures', type: 'Practice', folderId: 'quality', tags: ['Quality','Trend'], owner: 'Quality', sql: 'SELECT month, measure, compliance FROM quality_compliance ORDER BY month DESC;', createdBy: 'quality', createdOn: '2025-09-13', lastModified: '2025-09-28' },
  { id: 'ed1', name: 'ED Wait Time', description: 'Median ED door-to-doc time (mins)', type: 'Athena', folderId: 'ed', tags: ['ED','Wait Time'], owner: 'Hospital Ops', sql: 'SELECT AVG(minutes) AS median_wait FROM ed_wait_times WHERE date >= CURRENT_DATE - INTERVAL 30 DAY;', createdBy: 'hop', createdOn: '2025-09-03', lastModified: '2025-09-19' },
  { id: 'ed2', name: 'LWBS Rate', description: 'Left without being seen rate by day', type: 'Practice', folderId: 'ed', tags: ['ED','LWBS'], owner: 'Hospital Ops', sql: 'SELECT date, lwbs_rate FROM ed_lwbs ORDER BY date DESC;', createdBy: 'hop', createdOn: '2025-09-07', lastModified: '2025-09-24' },
  { id: 'ed3', name: 'ED Boarding Hours', description: 'Total boarding hours by day', type: 'Practice', folderId: 'ed', tags: ['ED','Boarding'], owner: 'Hospital Ops', sql: 'SELECT date, boarding_hours FROM ed_boarding ORDER BY date DESC;', createdBy: 'hop', createdOn: '2025-09-14', lastModified: '2025-09-29' }
];

export const schedules: ScheduleItem[] = [
  { id: 's1', queryId: 'q1', frequency: 'Monthly', nextRun: '2025-10-05T12:00:00Z', lastRun: '2025-09-05T12:00:00Z', status: 'Scheduled', recipients: ['finance@practice.com', 'Me'], scheduledBy: 'Me' },
  { id: 's2', queryId: 'q2', frequency: 'Weekly', nextRun: '2025-10-02T12:00:00Z', lastRun: '2025-09-25T12:00:00Z', status: 'Success', recipients: ['ops@practice.com'], scheduledBy: 'jdoe' },
  { id: 's3', queryId: 'q3', frequency: 'Daily', nextRun: '2025-10-02T01:00:00Z', lastRun: '2025-10-01T01:00:00Z', status: 'Failed', recipients: ['asmith', 'Me'], scheduledBy: 'asmith' },
  { id: 's4', queryId: 'q4', frequency: 'Monthly', nextRun: '2025-10-10T12:00:00Z', lastRun: '2025-09-10T12:00:00Z', status: 'Paused', recipients: ['leaders@practice.com'], scheduledBy: 'athena' },
  { id: 's5', queryId: 'q1', frequency: 'Quarterly', nextRun: '2025-12-31T12:00:00Z', lastRun: '2025-09-30T12:00:00Z', status: 'Success', recipients: ['cfo@practice.com'], scheduledBy: 'system' },
  { id: 's6', queryId: 'q11', frequency: 'Monthly', nextRun: '2025-10-28T09:00:00Z', lastRun: '2025-09-28T09:00:00Z', status: 'Scheduled', recipients: ['john@practice.com', 'Me'], scheduledBy: 'Me' }
];

export const inbox: InboxItem[] = [
  { id: 'i1', queryId: 'q1', date: '2025-09-30T12:01:00Z', status: 'New', hasAttachment: true, recipients: ['finance', 'Me'], scheduledBy: 'Me' },
  { id: 'i2', queryId: 'q2', date: '2025-09-28T12:05:00Z', status: 'Read', hasAttachment: true, recipients: ['ops'], scheduledBy: 'jdoe' },
  { id: 'i3', queryId: 'q3', date: '2025-09-27T06:20:00Z', status: 'Archived', recipients: ['asmith'], scheduledBy: 'asmith' },
  { id: 'i4', queryId: 'q11', date: '2025-09-30T09:05:00Z', status: 'New', hasAttachment: true, recipients: ['john', 'Me'], scheduledBy: 'Me' }
];

```

## `query-library-app/src/components/Layout/HeaderContext.tsx`

```tsx
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type HeaderContextValue = {
  headerNode: ReactNode | null;
  setHeaderNode: (node: ReactNode | null) => void;
};

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerNode, setHeaderNode] = useState<ReactNode | null>(null);
  const value = useMemo(() => ({ headerNode, setHeaderNode }), [headerNode]);
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) return { headerNode: null, setHeaderNode: (_: ReactNode | null) => {} };
  return ctx;
}

```

## `query-library-app/src/components/Layout/PageHeader.tsx`

```tsx
import React, { useEffect, useMemo } from 'react';
import { Stack, Typography, Box, Link as MLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useHeader } from './HeaderContext';

export interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  subtitle?: string;
  titleAdornment?: React.ReactNode; // optional inline control next to title (e.g., favorite/pin)
}

export default function PageHeader({ title, actions, subtitle, titleAdornment }: PageHeaderProps) {
  const { setHeaderNode } = useHeader();
  const { pathname } = useLocation();
  const crumbs = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    return [
      { label: 'Analytics Hub', to: '/' },
      { label: 'Query Library', to: '/' },
      ...parts.map((p, idx) => ({
        label: decodeURIComponent(p.charAt(0).toUpperCase() + p.slice(1)),
        to: '/' + parts.slice(0, idx + 1).join('/'),
      })),
    ];
  }, [pathname]);

  const headerEl = useMemo(() => (
    <Box
      sx={(t) => ({
        mb: 2,
        px: 0,
        pt: 1,
        pb: 0,
        borderRadius: 0,
        bgcolor: '#ffffff',
        boxShadow: t.shadows[1],
      })}
    >
      <Stack spacing={1} sx={{ px: { xs: 3 } }}>
        {/* Breadcrumbs */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0 }}>
          {crumbs.map((c, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              {i > 0 && <Typography variant="caption" color="text.secondary">/</Typography>}
              <MLink component={Link} to={c.to} underline="none" color="inherit" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                <Typography variant="caption" color="text.secondary">{c.label}</Typography>
              </MLink>
            </Stack>
          ))}
        </Stack>

        {/* Title, subtitle, actions */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ minHeight: 48, px: 0 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{title}</Typography>
              {titleAdornment}
            </Stack>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            )}
          </Box>
          {actions && (
            <Stack direction="row" spacing={1} alignItems="center">{actions}</Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  ), [title, actions, subtitle, titleAdornment, crumbs]);

  useEffect(() => {
    setHeaderNode(headerEl);
    return () => setHeaderNode(null);
  }, [setHeaderNode, headerEl]);

  // Render nothing in-page; header is rendered by Layout
  return null;
}

```

## `query-library-app/src/components/Layout/Sidebar.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box, IconButton, Tooltip, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import { Link, useLocation } from 'react-router-dom';
import { folders as allFolders } from '@/data/mock';

const drawerWidth = 240;

export default function Sidebar() {
  const { pathname } = useLocation();
  const folders = allFolders.map(f => f.name);
  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  // Persist up to 3 pinned folder slugs in localStorage
  const getInitialPinned = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('pinnedFolders') || '[]');
      const defaults = ['my-folder', 'billing-team', 'my-quarterly-runs'];
      if (Array.isArray(stored) && stored.length > 0) return stored.slice(0, 3);
      // Seed defaults if nothing pinned yet
      return defaults.slice(0, 3);
    } catch {
      return ['my-folder', 'billing-team', 'my-quarterly-runs'];
    }
  };
  const [pinned, setPinned] = useState<string[]>(getInitialPinned);
  useEffect(() => { localStorage.setItem('pinnedFolders', JSON.stringify(pinned)); }, [pinned]);
  const togglePin = (slug: string) => {
    setPinned((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, slug];
    });
  };
  const isPinned = (slug: string) => pinned.includes(slug);
  const pinnedFolders = folders.filter((name) => isPinned(toSlug(name))).slice(0, 3);
  const browseLimited = folders.slice(0, 3);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#F5F0FA', // lightest purple tint (brand #4E2D82 tinted)
          borderRight: (t) => `1px solid ${t.palette.divider}`,
        },
        display: { xs: 'none', md: 'block' },
      }}
      open
    >
      {/* Top spacer to align with GlobalTopNav (40px). Remove gutters to avoid extra horizontal padding. */}
      <Toolbar variant="dense" disableGutters sx={{ minHeight: 40, height: 40 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="overline" color="text.secondary">Navigation</Typography>
      </Box>
      <List disablePadding sx={{ pt: 0 }}>
        <ListItemButton component={Link} to="/" selected={pathname === '/' || pathname === '/home'}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} to="/schedules" selected={pathname.startsWith('/schedules')}>
          <ListItemIcon><ScheduleIcon /></ListItemIcon>
          <ListItemText primary="Schedules & Inbox" />
        </ListItemButton>
        <ListItemButton component={Link} to="/housekeeping" selected={pathname.startsWith('/housekeeping')}>
          <ListItemIcon><BuildCircleIcon /></ListItemIcon>
          <ListItemText primary="Housekeeping" />
        </ListItemButton>
      </List>
      {/* Pinned Folders */}
      <Box sx={{ px: 2, pt: 1 }}>
        <Typography variant="overline" color="text.secondary">Pinned Folders</Typography>
      </Box>
      <List disablePadding sx={{ pb: 1 }}>
        {pinnedFolders.length === 0 && (
          <ListItemButton component={Link} to="/folders">
            <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} primary="Pin folders from the Folders page" />
          </ListItemButton>
        )}
        {pinnedFolders.map((name) => (
          <ListItemButton key={`pin-${name}`} component={Link} to={`/folders/${toSlug(name)}`} selected={pathname.includes(toSlug(name))}>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={name} />
            <Tooltip title="Unpin">
              <IconButton size="small" edge="end" onClick={(e) => { e.preventDefault(); togglePin(toSlug(name)); }}>
                <PushPinIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Browse (limited to 3) + See all */}
      <Box sx={{ px: 2, pt: 1 }}>
        <Typography variant="overline" color="text.secondary">Browse Folders</Typography>
      </Box>
      <List sx={{ pb: 2 }}>
        {browseLimited.map((name) => (
          <ListItemButton key={name} component={Link} to={`/folders/${toSlug(name)}`} selected={pathname.includes(toSlug(name))}>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={name} />
            <Tooltip title={isPinned(toSlug(name)) ? 'Unpin' : pinned.length >= 3 ? 'Pin limit reached' : 'Pin'}>
              <span>
                <IconButton
                  size="small"
                  edge="end"
                  onClick={(e) => { e.preventDefault(); togglePin(toSlug(name)); }}
                  disabled={!isPinned(toSlug(name)) && pinned.length >= 3}
                >
                  {isPinned(toSlug(name)) ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          </ListItemButton>
        ))}
        <ListItemButton component={Link} to="/folders" selected={pathname === '/folders'}>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary="See all folders" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

```

## `query-library-app/src/components/FolderCard.tsx`

```tsx
import { Box, Stack, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import MiniQueryCard from './MiniQueryCard';
import { QueryItem } from '@/types';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

interface Props {
  title: string;
  description?: string;
  previewQueries?: QueryItem[];
  accentColor?: string; // e.g., brand/primary hue for folder colorization
  isCustom?: boolean; // whether this is a user/custom folder vs system
}

// Folder card with a subtle top "tab" notch and light border to differentiate the Folders swimlane
export default function FolderCard({ title, description, previewQueries, accentColor = '#0466B4', isCustom = false }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        border: (t) => `1px solid ${alpha(accentColor, 0.2)}`,
        bgcolor: (t) => alpha(accentColor, 0.06),
        p: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: -8,
          left: 24,
          width: 56,
          height: 16,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          bgcolor: accentColor,
          border: (t) => `1px solid ${alpha(accentColor, 0.4)}`,
          borderBottom: 'none',
        },
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          {isCustom ? (
            <PersonOutlineIcon fontSize="small" sx={{ color: '#0466B4' }} />
          ) : (
            <FolderOutlinedIcon fontSize="small" sx={{ color: '#4E2D82' }} />
          )}
          <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
        </Stack>
        {description && (
          <Typography variant="body2" color="text.secondary">{description}</Typography>
        )}
        {previewQueries && previewQueries.length > 0 && (
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {previewQueries.slice(0, 5).map((q) => (
              <Grid item xs={12} key={q.id}>
                <MiniQueryCard item={q} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
}

```

## `query-library-app/src/components/MiniQueryCard.tsx`

```tsx
import { Card, CardActionArea, CardContent, Stack, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { QueryItem } from '@/types';

interface Props {
  item: QueryItem;
}

// A compact query card for folder previews
export default function MiniQueryCard({ item }: Props) {
  return (
    <Card sx={{ borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <CardActionArea component={Link} to={`/query/${item.id}`}>
        <CardContent sx={{ py: 1.0, px: 1.25 }}>
          <Stack spacing={0}>
            <Tooltip title={item.name}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.name}
              </Typography>
            </Tooltip>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

```

## `query-library-app/src/pages/Home.tsx`

```tsx
import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, Tab, Tabs, Typography, ToggleButton, ToggleButtonGroup, List, ListItem, ListItemText, IconButton, Divider, Button, TextField, Paper, FormControl, InputLabel, Select, MenuItem, Chip, InputAdornment } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import QueryCard from '@/components/QueryCard';
import FolderCard from '@/components/FolderCard';
import PageHeader from '@/components/Layout/PageHeader';
// FiltersPanel intentionally not rendered on Home to avoid duplicate filters with the top toolbar
import { queries as allQueries, folders, schedules } from '@/data/mock';
import { QueryItem } from '@/types';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<string | undefined>();
  const [folderId, setFolderId] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState<QueryItem[]>(allQueries);
  const [search, setSearch] = useState('');
  const searchActive = search.trim().length > 0;
  const filtersActive = !!type || !!folderId || selectedTags.length > 0;
  const activeMode = searchActive || filtersActive;

  // Initialize search from URL (?q=)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearch(q);
    // initialize filters from URL
    const urlType = searchParams.get('type') || undefined;
    const urlFolder = searchParams.get('folder') || undefined;
    const urlTags = searchParams.get('tags');
    setType(urlType || undefined);
    setFolderId(urlFolder || undefined);
    if (urlTags) setSelectedTags(urlTags.split(',').filter(Boolean));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with search
  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (search.trim()) next.set('q', search.trim());
      else next.delete('q');
      // sync filters
      if (type) next.set('type', type);
      else next.delete('type');
      if (folderId) next.set('folder', folderId);
      else next.delete('folder');
      if (selectedTags.length) next.set('tags', selectedTags.join(','));
      else next.delete('tags');
      return next;
    });
  }, [search, type, folderId, selectedTags, setSearchParams]);

  // Escape behavior: Esc clears search; if empty then clears filters; if none, blur
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchActive) {
          setSearch('');
        } else if (filtersActive) {
          setType(undefined);
          setFolderId(undefined);
          setSelectedTags([]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchActive, filtersActive]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter(q => {
      const matchesFilters = (!type || q.type === (type as any)) &&
        (!folderId || q.folderId === folderId) &&
        (selectedTags.length === 0 || selectedTags.every(t => q.tags.includes(t)));
      if (!matchesFilters) return false;
      if (!term) return true;
      const folderName = folders.find(f => f.id === q.folderId)?.name?.toLowerCase() || '';
      const inName = q.name.toLowerCase().includes(term);
      const inDesc = (q.description || '').toLowerCase().includes(term);
      const inTags = q.tags.some(t => t.toLowerCase().includes(term));
      const inFolder = folderName.includes(term);
      return inName || inDesc || inTags || inFolder;
    });
  }, [items, type, folderId, selectedTags, search]);

  const athenaRecommended = filtered.filter(q => q.type === 'Athena').slice(0, 3);
  const frequentlyUsed = filtered.slice(0, 3);
  const frequentlyFolders = folders.slice(0, 3);

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(q => q.id === id ? { ...q, favorite: !q.favorite } : q));
  };

  return (
    <Stack spacing={2} sx={{ ml: 0, pl: 0, width: '100%' }}>
      <PageHeader
        title="Query Library"
        actions={<Button variant="contained">New Query</Button>}
      />

      {/* Top toolbar: search + filters + CTA */}
      <Paper sx={{ p: 3, border: (t) => `1px solid ${t.palette.divider}`, mb: 0, ml: 0, bgcolor: 'background.paper' }}>
        {/* Controls above search: back and clear */}
        {activeMode && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Button size="small" onClick={() => { setSearch(''); setType(undefined); setFolderId(undefined); setSelectedTags([]); }}>Back to Home</Button>
            <Button size="small" onClick={() => { setSearch(''); setType(undefined); setFolderId(undefined); setSelectedTags([]); }}>Clear results</Button>
          </Stack>
        )}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7} lg={6}>
            <TextField
              fullWidth
              size="medium"
              autoFocus
              placeholder="Search for Queries, Names, Description, Folder"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  searchActive ? (
                    <InputAdornment position="end">
                      <IconButton aria-label="Clear search" size="small" onClick={() => setSearch('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 3px rgba(4,102,180,0.15)'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl fullWidth size="small">
              <InputLabel shrink id="query-type-label">Query Type</InputLabel>
              <Select
                labelId="query-type-label"
                id="query-type"
                label="Query Type"
                value={type ?? ''}
                onChange={(e) => setType((e.target.value as string) || undefined)}
                displayEmpty
                renderValue={(v) => (v ? String(v) : 'All')}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Athena">Athena</MenuItem>
                <MenuItem value="Practice">Practice</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl fullWidth size="small">
              <InputLabel shrink id="folder-label">Folder</InputLabel>
              <Select
                labelId="folder-label"
                id="folder-select"
                label="Folder"
                value={folderId ?? ''}
                onChange={(e) => setFolderId((e.target.value as string) || undefined)}
                displayEmpty
                renderValue={(v) => (v ? (folders.find(f=>f.id===v as string)?.name ?? (v as string)) : 'All')}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {folders.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl fullWidth size="small">
              <InputLabel
                shrink
                id="tags-label"
                sx={{
                  px: 0.5,
                  bgcolor: 'background.paper',
                  '&.MuiInputLabel-shrink': { bgcolor: 'background.paper' },
                }}
              >
                Tags
              </InputLabel>
              <Select
                multiple
                labelId="tags-label"
                id="tags-select"
                label="Tags"
                value={selectedTags}
                onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]))}
                renderValue={(selected) => {
                const sel = selected as string[];
                if (!sel.length) return 'All';
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {sel.map((value) => (<Chip key={value} label={value} size="small" />))}
                  </Box>
                );
              }}
              >
                {/* Keep options in FiltersPanel; this is a shorthand bar */}
                <MenuItem value="AR Days">AR Days</MenuItem>
                <MenuItem value="Denials">Denials</MenuItem>
                <MenuItem value="No-Show">No-Show</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
        </Grid>
        {/* Inline suggested searches: visible when input is empty, placed below the row to preserve vertical alignment */}
        {!activeMode && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Denials', 'AR Days', 'No-Show', 'Credentialing', 'Failed Runs', 'Financials'].map(term => (
              <Chip
                key={term}
                label={term}
                size="small"
                variant="outlined"
                onClick={() => setSearch(term)}
                clickable
              />
            ))}
          </Box>
        )}
        {/* Applied filters as chips when active (no keyword needed) */}
        {(filtersActive) && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {type && (
              <Chip label={`Type: ${type}`} onDelete={() => setType(undefined)} />
            )}
            {folderId && (
              <Chip label={`Folder: ${folders.find(f=>f.id===folderId)?.name ?? folderId}`} onDelete={() => setFolderId(undefined)} />
            )}
            {selectedTags.map(tag => (
              <Chip key={tag} label={tag} onDelete={() => setSelectedTags(selectedTags.filter(t => t !== tag))} />
            ))}
          </Stack>
        )}
      </Paper>
      {/* Focused-mode overlay container */}
      <Box sx={{ position: 'relative' }}>
        {activeMode && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.04)',
              zIndex: 1,
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />
        )}

      {activeMode && (
        <Paper sx={{ p: 1.5, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2, position: 'relative', zIndex: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2">
              {searchActive ? (
                <>Results for “{search.trim()}” • {filtered.length}</>
              ) : (
                <>Filtered results • {filtered.length}</>
              )}
            </Typography>
            {/* header actions removed per request; controls live above the search bar */}
          </Stack>
          <List dense>
            {filtered.slice(0, 10).map((q) => (
              <ListItem key={q.id} button component={Link} to={`/query/${q.id}`}>
                <ListItemText
                  primary={highlightMatch(q.name, search)}
                  secondary={highlightMatch(`${folders.find(f => f.id === q.folderId)?.name ?? ''}${q.tags.length ? ' • ' + q.tags.slice(0, 2).join(', ') : ''}`, search, 'caption')}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                />
              </ListItem>
            ))}
            {filtered.length === 0 && (
              <ListItem>
                <ListItemText primary="No results" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
              </ListItem>
            )}
          </List>
        </Paper>
      )}

      {/* Secondary FiltersPanel removed to prevent duplicate controls */}
      
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ display: activeMode ? 'none' : 'flex', mt: '0!important' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 0, mb: 0, py: 0 }}>
          <Tab label="For You" />
          <Tab label="Favorites" />
          <Tab label="Shared" />
          <Tab label="My Queries" />
        </Tabs>
        <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setView(v)} sx={{ mt: 0, mb: 0 }}>
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={9} sx={{ display: activeMode ? 'none' : 'block' }}>
          {tab === 0 && (
            <Stack spacing={2}>
              <div>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Athena Recommended Queries</Typography>
                {view === 'grid' ? (
                  <Grid container spacing={2}>
                    {athenaRecommended.map(q => (
                      <Grid item xs={12} sm={6} md={4} key={q.id} sx={{ display: 'flex' }}>
                        <QueryCard variant="suggested" query={q} onToggleFavorite={toggleFavorite} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Stack spacing={1}>
                    {athenaRecommended.map(q => (
                      <Box key={q.id}><QueryCard variant="suggested" query={q} onToggleFavorite={toggleFavorite} /></Box>
                    ))}
                  </Stack>
                )}
              </div>

              <div>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Frequently Used Queries</Typography>
                {view === 'grid' ? (
                  <Grid container spacing={2}>
                    {frequentlyUsed.map(q => (
                      <Grid item xs={12} sm={6} md={4} key={q.id} sx={{ display: 'flex' }}>
                        <QueryCard query={q} onToggleFavorite={toggleFavorite} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Stack spacing={1}>
                    {frequentlyUsed.map(q => (
                      <Box key={q.id}><QueryCard query={q} onToggleFavorite={toggleFavorite} /></Box>
                    ))}
                  </Stack>
                )}
              </div>

              <div>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Frequently Used Folders</Typography>
                <Grid container spacing={2}>
                  {frequentlyFolders.map((f, idx) => {
                    const palette = ['#4E2D82', '#0466B4', '#2E7D32', '#EF6C00', '#00838F'];
                    const accentColor = palette[idx % palette.length];
                    const previews = allQueries.filter(q => q.folderId === f.id).slice(0, 3);
                    return (
                      <Grid key={f.id} item xs={12} sm={6} md={4}>
                        <FolderCard title={f.name} description={f.description || '—'} previewQueries={previews} accentColor={accentColor} />
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </Stack>
          )}

          {tab === 1 && (
            <Stack spacing={2}>
              {filtered.filter(q => q.favorite).map(q => (
                <QueryCard key={q.id} query={q} onToggleFavorite={toggleFavorite} />
              ))}
              {filtered.filter(q => q.favorite).length === 0 && (
                <Typography color="text.secondary">No favorites yet.</Typography>
              )}
            </Stack>
          )}

          {tab === 2 && (
            <Stack spacing={2}>
              {filtered.filter(q => !!q.sharedBy).map(q => (
                <QueryCard key={q.id} query={q} onToggleFavorite={toggleFavorite} />
              ))}
              {filtered.filter(q => !!q.sharedBy).length === 0 && (
                <Typography color="text.secondary">No shared queries.</Typography>
              )}
            </Stack>
          )}

          {tab === 3 && (
            <Stack spacing={2}>
              {filtered.filter(q => q.type === 'Custom').map(q => (
                <QueryCard key={q.id} query={q} onToggleFavorite={toggleFavorite} />
              ))}
              {filtered.filter(q => q.type === 'Custom').length === 0 && (
                <Typography color="text.secondary">No custom queries.</Typography>
              )}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} md={4} lg={3} sx={{ display: activeMode ? 'none' : 'block' }}>
          {/* Recent schedules */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>Most Recent Schedules (5)</Typography>
              <Button size="small">View All</Button>
            </Stack>
            <List dense>
              {schedules.slice(0, 5).map((s) => {
                const q = allQueries.find(q => q.id === s.queryId)!;
                return (
                  <Box key={s.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ pr: 10 }}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton size="small"><GetAppIcon fontSize="small" /></IconButton>
                          <IconButton size="small">{q.favorite ? <Star color="warning" fontSize="small" /> : <StarBorder fontSize="small" />}</IconButton>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={q.name}
                        secondary={`${s.frequency} • ${s.status}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        sx={{ pr: 2 }}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                );
              })}
            </List>
          </Box>
        </Grid>
      </Grid>
      </Box>
    </Stack>
  );
}

// Highlight occurrences of term in a given text by wrapping matches in a subtle mark.
function highlightMatch(text: string, term: string, variant: 'body2' | 'caption' = 'body2') {
  const t = term.trim();
  if (!t) return text;
  const regex = new RegExp(`(${escapeRegExp(t)})`, 'ig');
  const parts = text.split(regex);
  return (
    <Typography component="span" variant={variant}>
      {parts.map((part, idx) =>
        // parts at odd indices are the captured matches
        idx % 2 === 1 ? (
          <Box key={idx} component="mark" sx={{ bgcolor: 'rgba(4,102,180,0.15)', color: 'inherit', px: 0.25 }}>
            {part}
          </Box>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </Typography>
  );
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

```

## `query-library-app/src/pages/Folders.tsx`

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Pagination, Stack, Typography, TextField, Chip, IconButton, InputAdornment, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { folders, queries as allQueries } from '@/data/mock';
import { QueryItem } from '@/types';
import QueryCard from '@/components/QueryCard';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/Layout/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import FolderCard from '@/components/FolderCard';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';

export default function Folders() {
  const { slug } = useParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [category, setCategory] = useState<'All' | 'System' | 'My'>('All');

  const [items, setItems] = useState<QueryItem[]>(allQueries);
  // Local folders created in UI (prototype only, not persisted)
  type LocalFolder = { id: string; name: string; description?: string };
  const [additionalFolders, setAdditionalFolders] = useState<LocalFolder[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  // Pinned folders state shared with Sidebar via localStorage
  const getInitialPinned = () => {
    try { return JSON.parse(localStorage.getItem('pinnedFolders') || '[]'); } catch { return []; }
  };
  const [pinned, setPinned] = useState<string[]>(getInitialPinned);
  useEffect(() => { localStorage.setItem('pinnedFolders', JSON.stringify(pinned)); }, [pinned]);
  const toSlugLocal = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const isPinned = (name: string) => pinned.includes(toSlugLocal(name));
  const togglePin = (name: string) => {
    const slug = toSlugLocal(name);
    setPinned(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 3) return prev; // limit 3
      return [...prev, slug];
    });
  };

  const selectedFolder = useMemo(() => {
    if (!slug) return undefined;
    const toSlugLocal = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const base = folders.find(f => toSlugLocal(f.name) === slug);
    if (base) return base;
    const local = additionalFolders.find(f => toSlugLocal(f.name) === slug);
    return local ? { id: local.id, name: local.name, description: local.description } as any : undefined;
  }, [slug, additionalFolders]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const inFolder = selectedFolder ? items.filter(q => q.folderId === selectedFolder.id) : items;
    return inFolder.filter(q => q.name.toLowerCase().includes(term) || q.tags.some(t => t.toLowerCase().includes(term)));
  }, [items, search, selectedFolder]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const toggleFavorite = (id: string) => setItems(prev => prev.map(q => q.id === id ? { ...q, favorite: !q.favorite } : q));

  // GRID OF FOLDERS (no slug)
  if (!selectedFolder) {
    const allFold = [
      ...folders,
      ...additionalFolders.map(f => ({ id: f.id, name: f.name, description: f.description }))
    ];
    const folderStats = allFold.map(f => {
      const qs = items.filter(q => q.folderId === f.id);
      const isMy = qs.some(q => q.type === 'Custom'); // proxy for user-owned/custom
      return { folder: f, count: qs.length, isMy };
    });

    const visible = folderStats.filter(({ folder, isMy }) => {
      const term = search.trim().toLowerCase();
      const matchesText = !term || folder.name.toLowerCase().includes(term) || (folder.description || '').toLowerCase().includes(term);
      const matchesCat = category === 'All' ? true : category === 'System' ? !isMy : isMy;
      return matchesText && matchesCat;
    });

    const handleCreate = () => {
      const name = newName.trim();
      if (!name) return;
      const id = toSlugLocal(name);
      setAdditionalFolders(prev => [...prev, { id, name, description: newDesc.trim() || undefined }]);
      setNewOpen(false); setNewName(''); setNewDesc('');
    };

    return (
      <Stack spacing={2}>
        <PageHeader title="Folders" subtitle="Browse system domains and your custom folders" actions={
          <Button variant="contained" size="small" onClick={() => setNewOpen(true)}>New Folder</Button>
        } />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <TextField
            size="small"
            placeholder="Search folders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ maxWidth: 360 }}
          />
          <Stack direction="row" spacing={1}>
            {(['All','System','My'] as const).map(cat => (
              <Chip key={cat} label={cat} color={category === cat ? 'primary' : 'default'} variant={category === cat ? 'filled' : 'outlined'} onClick={() => setCategory(cat)} />
            ))}
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {visible.map(({ folder, count, isMy }) => {
            const slugPath = toSlugLocal(folder.name);
            const previews = items.filter(q => q.folderId === folder.id).slice(0, 3);
            const accent = isMy ? '#0466B4' : '#4E2D82';
            return (
              <Grid key={folder.id} item xs={12} sm={6} md={4} sx={{ display: 'flex', position: 'relative' }}>
                <Box component={Link} to={`/folders/${slugPath}`} sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1, '& > *': { flex: 1 } }}>
                  <FolderCard title={`${folder.name} (${count})`} description={folder.description} previewQueries={previews} accentColor={accent} isCustom={isMy} />
                </Box>
                <Tooltip title={isPinned(folder.name) ? 'Unpin' : pinned.length >= 3 ? 'Pin limit reached' : 'Pin'}>
                  <span>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 6, right: 10, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePin(folder.name); }}
                      disabled={!isPinned(folder.name) && pinned.length >= 3}
                      aria-label={isPinned(folder.name) ? 'Unpin folder' : 'Pin folder'}
                    >
                      {isPinned(folder.name) ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            );
          })}
          {visible.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 3, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}>
                <Typography color="text.secondary">No folders match your filters.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Dialog open={newOpen} onClose={() => setNewOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>New Folder</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Folder name" autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth />
              <TextField label="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} fullWidth multiline minRows={2} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  }

  // FOLDER DETAIL (with slug)
  return (
    <Stack spacing={2}>
      <PageHeader
        title={selectedFolder ? selectedFolder.name : 'Folders'}
        subtitle={selectedFolder ? (selectedFolder.description || '—') : undefined}
        actions={selectedFolder ? (
          <Button size="small" onClick={() => togglePin(selectedFolder.name)} startIcon={isPinned(selectedFolder.name) ? <PushPinIcon /> : <PushPinOutlinedIcon />}>
            {isPinned(selectedFolder.name) ? 'Unpin' : 'Pin'}
          </Button>
        ) : undefined}
      />
      <TextField size="small" placeholder="Search in this folder" value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Queries in this folder</Typography>
          {filtered.length === 0 ? (
            <Box sx={{ p: 3, borderRadius: 1, border: (t) => `1px solid ${t.palette.divider}` }}>
              <Typography color="text.secondary">No queries found in this folder.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {paged.map(q => (
                <Grid key={q.id} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                  <QueryCard query={q} onToggleFavorite={toggleFavorite} />
                </Grid>
              ))}
            </Grid>
          )}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              page={page}
              onChange={(_, v) => setPage(v)}
              count={Math.max(1, Math.ceil(filtered.length / pageSize))}
              shape="rounded"
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`Total: ${filtered.length}`} size="small" />
              <IconButton size="small" color="default">
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

```

## `query-library-app/src/pages/QueryDetail.tsx`

```tsx
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { queries, schedules, inbox } from '@/data/mock';
import { Box, Button, Chip, Divider, Grid, Paper, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Alert, Autocomplete, Snackbar, Tooltip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PageHeader from '@/components/Layout/PageHeader';

export default function QueryDetail() {
  const { id } = useParams();
  const query = useMemo(() => queries.find(q => q.id === id), [id]);
  // New Schedule dialog state
  const [open, setOpen] = useState(false);
  const [schedName, setSchedName] = useState('');
  const [pattern, setPattern] = useState<'Daily' | 'Weekly'>('Weekly');
  const [interval, setInterval] = useState<number>(1);
  const [days, setDays] = useState<{[k: string]: boolean}>({ Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false });
  const [time, setTime] = useState('06:00');
  const [tz, setTz] = useState('ET');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Low'>('Normal');
  const [retryOnFailure, setRetryOnFailure] = useState(true);
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [skipHolidays, setSkipHolidays] = useState(false);
  const [maxExec, setMaxExec] = useState('30');
  const [createdMsg, setCreatedMsg] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [recipients, setRecipients] = useState<string[]>(['Me']);
  const userOptions = useMemo(() => {
    const fromSchedules = schedules.flatMap(s => [s.scheduledBy, ...(s.recipients || [])]);
    const fromInbox = inbox.flatMap(i => [i.scheduledBy, ...(i.recipients || [])]);
    const base = ['Me', 'jdoe', 'asmith', 'finance', 'ops', 'john', 'athena', 'system', 'leaders'];
    return Array.from(new Set([...base, ...fromSchedules, ...fromInbox].filter(Boolean))) as string[];
  }, []);
  // Favorite star state persisted in localStorage
  const [isFav, setIsFav] = useState<boolean>(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('favoriteQueries') || '[]');
      return Array.isArray(arr) && query ? arr.includes(query.id) : false;
    } catch { return false; }
  });
  const toggleFav = () => {
    try {
      const arr: string[] = JSON.parse(localStorage.getItem('favoriteQueries') || '[]');
      let next = Array.isArray(arr) ? arr.slice() : [];
      if (!query) return;
      if (next.includes(query.id)) { next = next.filter(id => id !== query.id); setIsFav(false); }
      else { next.push(query.id); setIsFav(true); }
      localStorage.setItem('favoriteQueries', JSON.stringify(next));
    } catch {
      if (!query) return;
      setIsFav(v => !v);
    }
  };

  if (!query) return <Typography>Query not found.</Typography>;

  const openDialog = () => {
    setSchedName(`${query.name} - Schedule`);
    setOpen(true);
  };

  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return { h: isNaN(h) ? 6 : h, m: isNaN(m) ? 0 : m };
  };

  const getNextRuns = (): string[] => {
    const results: string[] = [];
    const now = new Date();
    const { h, m } = parseTime(time);
    const start = new Date(now);
    start.setSeconds(0, 0);
    start.setHours(h, m, 0, 0);
    let cursor = start > now ? start : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m, 0, 0);
    const pushIf = (d: Date) => {
      results.push(d.toLocaleString());
    };
    if (pattern === 'Daily') {
      while (results.length < 3) {
        pushIf(new Date(cursor));
        cursor = new Date(cursor.getTime() + interval * 24 * 60 * 60 * 1000);
      }
    } else {
      // Weekly: use selected days
      const dayOrder = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      while (results.length < 3) {
        const dow = dayOrder[cursor.getDay()];
        if (days[dow]) pushIf(new Date(cursor));
        // advance by 1 day; after finishing a week window, jump interval-1 extra weeks
        const next = new Date(cursor.getTime() + 24*60*60*1000);
        // If we crossed a multiple of 7 days block and it's the last selected day this week logic is complex;
        // to keep simple, we just keep iterating days; every 7 days constitutes a week; use modulo of weeks to enforce interval
        // Compute weeks since start
        const diffDays = Math.floor((next.getTime() - start.getTime()) / (24*60*60*1000));
        const weeksSinceStart = Math.floor(diffDays / 7);
        if (weeksSinceStart % interval === 0) {
          cursor = next;
        } else {
          cursor = next;
        }
      }
    }
    return results;
  };

  const handleCreate = () => {
    setCreatedMsg('Schedule created');
    setToastOpen(true);
    setOpen(false);
  };

  return (
    <Stack spacing={2}>
      <PageHeader
        title={query.name}
        subtitle={query.description}
        titleAdornment={(
          <Tooltip title={isFav ? 'Unfavorite' : 'Favorite'}>
            <IconButton size="small" onClick={toggleFav} aria-label={isFav ? 'Unfavorite query' : 'Favorite query'}>
              {isFav ? <StarIcon color="warning" fontSize="small" /> : <StarBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        actions={(
          <Stack direction="row" spacing={1}>
            <Button variant="contained">Edit and Run</Button>
            <Button variant="outlined">Share</Button>
            <Button variant="outlined">Move</Button>
          </Stack>
        )}
      />
      <Box>
        <Stack direction="row" spacing={1} sx={{ mt: 0, flexWrap: 'wrap' }}>
          <Chip size="small" label={query.type} color="primary" variant="outlined" />
          {query.tags.map(t => <Chip key={t} size="small" label={t} variant="outlined" />)}
          <Button size="small" variant="text">+ Add Tag</Button>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Created: {query.createdOn} | Athena Query</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {/* Query Configuration */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Query Configuration</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Columns (example)</Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">patient_id</Typography>
                  <Typography variant="body2">revenue_amount</Typography>
                  <Typography variant="body2">service_date</Typography>
                  <Typography variant="body2">payment_status</Typography>
                  <Typography variant="body2">insurance_type</Typography>
                  <Typography variant="body2">provider_name</Typography>
                  <Typography variant="body2">department</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Filters (example)</Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">service_date: Last 30 days</Typography>
                  <Typography variant="body2">payment_status: Partially Paid</Typography>
                  <Typography variant="body2">department: Radiology + Providers</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Activity History */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Activity History</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Total Runs: 142</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">• Query Executed Jun 10, 2025, 9:00 AM — 1,250 records processed. by John Smith</Typography>
              <Typography variant="body2">• Schedule Modified Jun 9, 2025, 2:30 PM — Frequency changed weekly → monthly by Sarah Johnson</Typography>
              <Typography variant="body2">• Query Updated Jun 8, 2025, 11:45 AM — Added payment_status filter by Mike Davis</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Schedule Information */}
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>Schedule Information</Typography>
              <Button size="small" variant="outlined" onClick={openDialog}>Add Schedule</Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Total Schedules: {schedules.filter(s => s.queryId === query.id).length}</Typography>
            <Stack spacing={1.25}>
              {schedules.filter(s => s.queryId === query.id).map(s => (
                <Paper key={s.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Typography variant="body2"><strong>Frequency:</strong> {s.frequency}</Typography>
                      <Chip size="small" label={s.status} color={s.status === 'Success' ? 'success' : s.status === 'Failed' ? 'error' : 'default'} variant="outlined" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Recipients: {s.recipients?.join(', ') || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">Next Run: {s.nextRun ?? '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">Scheduled by: {s.scheduledBy ?? '—'}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Button size="small">Edit</Button>
                      <Button size="small" color="error">Delete</Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              {schedules.filter(s => s.queryId === query.id).length === 0 && (
                <Typography color="text.secondary">No schedules yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* New Schedule Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>New Schedule</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <TextField label="Schedule Name" value={schedName} onChange={(e) => setSchedName(e.target.value)} />
            </FormControl>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Recurrence Pattern</Typography>
                <FormControl size="small" sx={{ maxWidth: 240 }}>
                  <InputLabel id="pattern-label">Pattern</InputLabel>
                  <Select labelId="pattern-label" label="Pattern" value={pattern} onChange={(e) => setPattern(e.target.value as any)}>
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>

                {pattern === 'Daily' && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2">Repeat every</Typography>
                    <TextField size="small" type="number" inputProps={{ min: 1 }} value={interval} onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value || '1', 10)))} sx={{ width: 90 }} />
                    <Typography variant="body2">day(s)</Typography>
                  </Stack>
                )}

                {pattern === 'Weekly' && (
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2">Repeat every</Typography>
                      <TextField size="small" type="number" inputProps={{ min: 1 }} value={interval} onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value || '1', 10)))} sx={{ width: 90 }} />
                      <Typography variant="body2">week(s) on:</Typography>
                    </Stack>
                    <FormGroup row>
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                        <FormControlLabel key={d} control={<Checkbox checked={!!days[d]} onChange={(e) => setDays(prev => ({ ...prev, [d]: e.target.checked }))} />} label={d} />
                      ))}
                    </FormGroup>
                  </Stack>
                )}

                <Alert severity="info">Next 3 runs: {getNextRuns().join(' • ') || 'No days selected'}</Alert>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Execution Time</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="Time" type="time" size="small" value={time} onChange={(e) => setTime(e.target.value)} sx={{ maxWidth: 160 }} />
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="tz-label">Timezone</InputLabel>
                    <Select labelId="tz-label" label="Timezone" value={tz} onChange={(e) => setTz(e.target.value)}>
                      <MenuItem value="ET">Eastern Time (ET)</MenuItem>
                      <MenuItem value="CT">Central Time (CT)</MenuItem>
                      <MenuItem value="MT">Mountain Time (MT)</MenuItem>
                      <MenuItem value="PT">Pacific Time (PT)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="prio-label">Priority</InputLabel>
                    <Select labelId="prio-label" label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <FormControlLabel control={<Checkbox checked={retryOnFailure} onChange={(e) => setRetryOnFailure(e.target.checked)} />} label="Retry on failure" />
                  <FormControlLabel control={<Checkbox checked={skipWeekends} onChange={(e) => setSkipWeekends(e.target.checked)} />} label="Skip weekends" />
                  <FormControlLabel control={<Checkbox checked={skipHolidays} onChange={(e) => setSkipHolidays(e.target.checked)} />} label="Skip holidays" />
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="maxexec-label">Max execution time</InputLabel>
                    <Select labelId="maxexec-label" label="Max execution time" value={maxExec} onChange={(e) => setMaxExec(e.target.value)}>
                      <MenuItem value="15">15 minutes</MenuItem>
                      <MenuItem value="30">30 minutes</MenuItem>
                      <MenuItem value="60">60 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Recipients</Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={userOptions}
                  value={recipients}
                  onChange={(_, val) => setRecipients(val as string[])}
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} size="small" label="Add recipients" placeholder="Type a name..." />
                  )}
                />
                <Typography variant="caption" color="text.secondary">Use usernames. Suggestions appear as you type.</Typography>
              </Stack>
            </Paper>

            <Alert severity="success" sx={{ display: createdMsg ? 'block' : 'none' }}>{createdMsg}</Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!schedName.trim()}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message={createdMsg || 'Saved'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  );
}

```

## `query-library-app/src/pages/SchedulesInbox.tsx`

```tsx
import { useMemo, useState } from 'react';
import { Box, Button, Chip, Divider, IconButton, Paper, Stack, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { inbox, queries, schedules } from '@/data/mock';
import PageHeader from '@/components/Layout/PageHeader';

export default function SchedulesInbox() {
  // Parent tabs: 0=Inbox (default), 1=Schedules
  const [tab, setTab] = useState(0);
  // Inbox chip filters
  type InboxFilter = 'All' | 'New' | 'Archived';
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>('All');
  const inboxFiltered = useMemo(() => {
    if (inboxFilter === 'New') return inbox.filter(i => i.status === 'New');
    if (inboxFilter === 'Archived') return inbox.filter(i => i.status === 'Archived');
    return inbox;
  }, [inboxFilter]);
  const inboxCounts = useMemo(() => ({
    All: inbox.length,
    New: inbox.filter(i => i.status === 'New').length,
    Archived: inbox.filter(i => i.status === 'Archived').length,
  }), []);

  // Schedules chip filters
  type SchedFilter = 'All' | 'Failed' | 'Mine' | 'Success' | 'Paused' | 'Scheduled';
  const [schedFilter, setSchedFilter] = useState<SchedFilter>('All');
  const schedulesFiltered = useMemo(() => {
    switch (schedFilter) {
      case 'Failed':
        return schedules.filter(s => s.status === 'Failed');
      case 'Success':
        return schedules.filter(s => s.status === 'Success');
      case 'Paused':
        return schedules.filter(s => s.status === 'Paused');
      case 'Scheduled':
        return schedules.filter(s => s.status === 'Scheduled');
      case 'Mine':
        return schedules.filter(s => (s.scheduledBy || '').toLowerCase() === 'me');
      default:
        return schedules;
    }
  }, [schedFilter]);
  const scheduleCounts = useMemo(() => ({
    All: schedules.length,
    Failed: schedules.filter(s => s.status === 'Failed').length,
    Mine: schedules.filter(s => (s.scheduledBy || '').toLowerCase() === 'me').length,
    Success: schedules.filter(s => s.status === 'Success').length,
    Paused: schedules.filter(s => s.status === 'Paused').length,
    Scheduled: schedules.filter(s => s.status === 'Scheduled').length,
  }), []);

  return (
    <Stack spacing={2}>
      <PageHeader title="Schedules & Inbox" />
      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Inbox" />
          <Tab label="Schedules" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />

        {tab === 0 && (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Inbox</Typography>
              <Box />
            </Stack>
            {/* Inbox filter chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
              {(['All','New','Archived'] as const).map(f => (
                <Chip key={f} label={`${f} (${inboxCounts[f]})`} color={inboxFilter === f ? 'primary' : 'default'} variant={inboxFilter === f ? 'filled' : 'outlined'} onClick={() => setInboxFilter(f)} size="small" />
              ))}
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Query Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Scheduled By</TableCell>
                    <TableCell>Recipients</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inboxFiltered.map((i) => {
                    const q = queries.find(q => q.id === i.queryId)!;
                    const chipColor = i.status === 'Failed'
                      ? 'error'
                      : i.status === 'Paused'
                        ? 'warning'
                        : i.status === 'New'
                          ? 'primary'
                          : i.status === 'Read'
                            ? 'success'
                            : 'default';
                    return (
                      <TableRow key={i.id} hover>
                        <TableCell>{q?.name}</TableCell>
                        <TableCell>{new Date(i.date).toLocaleString()}</TableCell>
                        <TableCell>{i.scheduledBy || '—'}</TableCell>
                        <TableCell>{i.recipients && i.recipients.length ? i.recipients.join(', ') : '—'}</TableCell>
                        <TableCell>
                          <Chip size="small" label={i.status} color={chipColor as any} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" aria-label="view"><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton size="small" aria-label="download"><GetAppIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tab === 1 && (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6">Schedules</Typography>
              <Button variant="contained">+ New Schedule</Button>
            </Stack>
            {/* Schedules filter chips */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {(['All','Failed','Mine','Success','Paused','Scheduled'] as const).map(f => (
                <Chip key={f} label={`${f} (${scheduleCounts[f]})`} color={schedFilter === f ? 'primary' : 'default'} variant={schedFilter === f ? 'filled' : 'outlined'} onClick={() => setSchedFilter(f)} size="small" />
              ))}
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Query Name</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Scheduled By</TableCell>
                    <TableCell>Recipients</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedulesFiltered.map((s) => {
                    const q = queries.find(q => q.id === s.queryId)!;
                    return (
                      <TableRow key={s.id} hover>
                        <TableCell>{q?.name}</TableCell>
                        <TableCell>{s.frequency}</TableCell>
                        <TableCell>{s.scheduledBy || '—'}</TableCell>
                        <TableCell>{s.recipients && s.recipients.length ? s.recipients.join(', ') : '—'}</TableCell>
                        <TableCell>{s.nextRun ? new Date(s.nextRun).toLocaleString() : '—'}</TableCell>
                        <TableCell>{s.lastRun ? new Date(s.lastRun).toLocaleString() : '—'}</TableCell>
                        <TableCell>
                          {s.status === 'Failed' ? (
                            <Tooltip
                              placement="top"
                              title={
                                <Box sx={{ fontSize: 12, p: 0.5 }}>
                                  <Typography variant="subtitle2" sx={{ fontSize: 12, mb: 0.5 }}>Run failed</Typography>
                                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    <li>Query error: syntax or missing table/column</li>
                                    <li>Access issue: insufficient permissions or expired credentials</li>
                                    <li>Timeout: large data set or long-running query</li>
                                    <li>Upstream outage: source system temporarily unavailable</li>
                                  </ul>
                                  <Typography variant="body2" sx={{ fontSize: 12, mt: 0.5 }}>
                                    Try: validate SQL, check filters/joins, reduce time window, and re-run. If access-related, contact your admin.
                                  </Typography>
                                </Box>
                              }
                            >
                              <Chip size="small" label={s.status} color="error" />
                            </Tooltip>
                          ) : (
                            <Chip size="small" label={s.status} color={s.status === 'Success' ? 'success' : (s.status === 'Paused' ? 'warning' : 'default')} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" aria-label="view"><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton size="small" aria-label="edit"><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" aria-label="delete"><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Stack>
  );
}

```

