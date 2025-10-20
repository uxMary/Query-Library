import { useMemo, useState } from 'react';
import { Box, Button, Chip, Divider, IconButton, Paper, Stack, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip, TextField, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
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
  const [schedSearch, setSchedSearch] = useState('');
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
  const schedulesFilteredBySearch = useMemo(() => {
    const t = schedSearch.trim().toLowerCase();
    if (!t) return schedulesFiltered;
    return schedulesFiltered.filter(s => {
      const qName = (queries.find(q => q.id === s.queryId)?.name || '').toLowerCase();
      const by = (s.scheduledBy || '').toLowerCase();
      const recips = (s.recipients || []).join(',').toLowerCase();
      return qName.includes(t) || by.includes(t) || recips.includes(t);
    });
  }, [schedSearch, schedulesFiltered]);
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
      <PageHeader title="My Inbox and schedules" />
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
            <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h6">Schedules</Typography>
              <TextField
                size="small"
                placeholder="Search schedules (query, owner, recipients)"
                value={schedSearch}
                onChange={(e) => setSchedSearch(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
                sx={{ maxWidth: 360, width: '100%' }}
              />
            </Stack>
            {/* Schedules filter chips */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {(['All','Failed','Mine','Success','Paused','Scheduled'] as const).map(f => (
                <Chip
                  key={f}
                  label={`${f} (${scheduleCounts[f]})`}
                  color={schedFilter === f ? 'primary' : 'default'}
                  variant={schedFilter === f ? 'filled' : 'outlined'}
                  onClick={() => setSchedFilter(f)}
                  size="small"
                />
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
                  {schedulesFilteredBySearch.map((s) => {
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
                            <Chip
                              size="small"
                              color="error"
                              label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <span>Failed</span>
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
                                    <InfoOutlinedIcon fontSize="inherit" sx={{ opacity: 0.85 }} />
                                  </Tooltip>
                                </Stack>
                              }
                            />
                          ) : s.status === 'Paused' ? (
                            <Chip
                              size="small"
                              color="warning"
                              label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <span>Paused</span>
                                  <Tooltip
                                    placement="top"
                                    title={
                                      <Box sx={{ fontSize: 12, p: 0.5 }}>
                                        <Typography variant="subtitle2" sx={{ fontSize: 12, mb: 0.5 }}>Schedule paused</Typography>
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                          <li>Paused by user</li>
                                          <li>Maintenance/blackout window</li>
                                          <li>Quota or credit limit reached</li>
                                        </ul>
                                        <Typography variant="body2" sx={{ fontSize: 12, mt: 0.5 }}>
                                          Resume from schedule settings when ready.
                                        </Typography>
                                      </Box>
                                    }
                                  >
                                    <InfoOutlinedIcon fontSize="inherit" sx={{ opacity: 0.85 }} />
                                  </Tooltip>
                                </Stack>
                              }
                            />
                          ) : (
                            <Chip size="small" label={s.status} color={s.status === 'Success' ? 'success' : (s.status === 'Scheduled' ? 'default' : 'default')} />
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
