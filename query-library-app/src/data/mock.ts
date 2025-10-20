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
    ],
    editableFilterPolicy: 'date-only'
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
    ],
    editableFilterPolicy: 'full'
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
    ],
    editableFilterPolicy: 'date-only'
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
