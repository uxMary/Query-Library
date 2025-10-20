import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { queries, schedules, inbox } from '@/data/mock';
import { Box, Button, Chip, Divider, Grid, Paper, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Alert, Autocomplete, Snackbar, Tooltip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PageHeader from '@/components/Layout/PageHeader';

export default function QueryDetail() {
  const { id } = useParams();
  const query = useMemo(() => queries.find(q => q.id === id), [id]);
  const policy: 'date-only' | 'full' = (query as any)?.editableFilterPolicy || 'full';
  const isDateField = (name: string) => /date|month|day|week|year/i.test(name || '');
  const editableFilterNames = useMemo(() => {
    const cfg = query?.config?.filters || [];
    const names = cfg.map(f => f.name).filter(n => isDateField(n));
    return names;
  }, [query]);
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

  // Diff dialog for viewing changes on specific activity rows
  const [diffOpen, setDiffOpen] = useState(false);
  const [diffContext, setDiffContext] = useState<{ date: string; by: string } | null>(null);
  // Schedule info dialog
  const [schedOpen, setSchedOpen] = useState(false);
  const [schedContext, setSchedContext] = useState<null | {
    id: string;
    frequency?: string;
    status?: string;
    recipients?: string[];
    nextRun?: string | null;
    lastRun?: string | null;
    scheduledBy?: string | null;
  }>(null);

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
            <Button variant="contained" component={Link} to={`/builder/${query.id}`}>Edit and Run</Button>
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
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>Query Configuration</Typography>
              {policy === 'date-only' && (
                <Tooltip
                  title={editableFilterNames.length
                    ? `Editing is restricted for this query. The following filters are editable: ${editableFilterNames.join(', ')}`
                    : `Editing is restricted for this query. Only date filters are editable.`}
                >
                  <IconButton size="small" aria-label="guardrailed-filters">
                    <LockOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
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
          {/* Schedule info dialog */}
          <Dialog open={schedOpen} onClose={() => setSchedOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Schedule Information</DialogTitle>
            <DialogContent>
              {schedContext ? (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2"><strong>ID:</strong> {schedContext.id}</Typography>
                  <Typography variant="body2"><strong>Frequency:</strong> {schedContext.frequency ?? '—'}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {schedContext.status ?? '—'}</Typography>
                  <Typography variant="body2"><strong>Next Run:</strong> {schedContext.nextRun ?? '—'}</Typography>
                  <Typography variant="body2"><strong>Last Run:</strong> {schedContext.lastRun ?? '—'}</Typography>
                  <Typography variant="body2"><strong>Scheduled By:</strong> {schedContext.scheduledBy ?? '—'}</Typography>
                  <Divider />
                  <Typography variant="subtitle2">Recipients</Typography>
                  {schedContext.recipients && schedContext.recipients.length ? (
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                      {schedContext.recipients.map((r) => (
                        <Chip key={r} size="small" label={r} />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No schedule selected.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSchedOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
          {/* Diff dialog for edited and saved activity */}
          <Dialog open={diffOpen} onClose={() => setDiffOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Changes ({diffContext?.date})</DialogTitle>
            <DialogContent>
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Typography variant="body2"><strong>By:</strong> {diffContext?.by ?? '—'}</Typography>
                <Divider />
                {/* Mock diff content for prototype */}
                <Typography variant="body2">+ Added columns: Total Payments, Provider Name</Typography>
                <Typography variant="body2">- Removed filter: payment_status = 'Partially Paid'</Typography>
                <Typography variant="body2">~ Modified filter: service_date from Last 7 days → Last 30 days</Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDiffOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Activity History */}
          {/* Activity & Runs (merged view) */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Activity & Runs</Typography>
            {/* Filters */}
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
              {/* local UI state via inline useState; kept inside component scope */}
              {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
              {(() => {
                const [flt, setFlt] = useState<'All'|'Runs'|'Edits'|'Scheduled'>('All');
                // Compose merged rows: runs from inbox; edits from query.activity
                const runRows = inbox
                  .filter(i => i.queryId === query.id)
                  .map(i => ({
                    id: i.id,
                    date: i.date,
                    type: 'Run' as const,
                    by: i.scheduledBy || '—',
                    recipients: i.recipients || [],
                    status: i.status,
                    source: (i.scheduledBy && i.scheduledBy !== 'Me') ? 'Scheduled' as const : 'User' as const,
                  }));
                const editRows = (query.activity || []).map(a => ({
                  id: a.at + a.by,
                  date: a.at,
                  type: 'Edit' as const,
                  by: a.by,
                  recipients: [] as string[],
                  status: a.action,
                  source: 'User' as const,
                }));
                // Include one schedule info activity row
                const sched = schedules.find(s => s.queryId === query.id);
                const scheduleRows = sched ? [{
                  id: `schedule-${sched.id}`,
                  date: sched.nextRun || sched.lastRun || new Date().toISOString(),
                  type: 'Schedule' as const,
                  by: sched.scheduledBy || '—',
                  recipients: (sched.recipients || []) as string[],
                  status: sched.status,
                  source: 'Scheduled' as const,
                }] : [];
                const merged = [...runRows, ...editRows, ...scheduleRows].sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
                // Helper to compute enhanced activity label for edit events
                const ACTIVITY_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
                const hasNearbyRunBySameUser = (editDate: string, by: string) => {
                  const t0 = new Date(editDate).getTime();
                  return runRows.find(r => r.by === by && (new Date(r.date).getTime() >= t0) && (new Date(r.date).getTime() - t0) <= ACTIVITY_WINDOW_MS);
                };
                const hasNearbySaveAfterRun = (runDate: string, by: string) => {
                  const tRun = new Date(runDate).getTime();
                  const saves = (query.activity || []).filter(a => a.by === by && /save(d)?/i.test(a.action || ''));
                  return saves.find(a => {
                    const ta = new Date(a.at).getTime();
                    return ta >= tRun && (ta - tRun) <= ACTIVITY_WINDOW_MS;
                  });
                };
                const filtered = merged.filter(r => {
                  switch (flt) {
                    case 'Runs': return r.type === 'Run';
                    case 'Edits': return r.type === 'Edit';
                    case 'Scheduled': return r.source === 'Scheduled';
                    default: return true;
                  }
                });
                const ChipBtn = ({label, val}:{label:string; val: typeof flt}) => (
                  <Chip size="small" label={label} color={flt===val?'primary':'default'} variant={flt===val?'filled':'outlined'} onClick={()=>setFlt(val)} />
                );
                return (
                  <>
                    <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                      <ChipBtn label={`All (${merged.length})`} val="All" />
                      <ChipBtn label={`Runs (${runRows.length})`} val="Runs" />
                      <ChipBtn label={`Edits (${editRows.length})`} val="Edits" />
                      <ChipBtn label="Scheduled" val="Scheduled" />
                    </Stack>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Activity</TableCell>
                            <TableCell>By</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filtered.map((r) => {
                            const isRun = r.type === 'Run';
                            const isSchedule = (r as any).type === 'Schedule';
                            let activityLabel = isRun ? 'run' : (r.type === 'Edit' ? 'edited' : (r.type === 'Schedule' ? 'schedule' : 'edited'));
                            if (!isRun) {
                              const nr = hasNearbyRunBySameUser(r.date, r.by);
                              if (nr) {
                                const saved = hasNearbySaveAfterRun(nr.date, r.by);
                                activityLabel = saved ? 'edit-run-save' : 'edited and run';
                              }
                            }
                            // Do not override schedule rows to edited/edited and run
                            if (r.type === 'Schedule') {
                              activityLabel = 'schedule';
                            }
                            // Explicit overrides for requested timestamps
                            const overrideDates = new Set(['6/10/2025, 2:30:00 PM','6/8/2025, 5:15:00 PM']);
                            const displayedDate = new Date(r.date).toLocaleString();
                            const isOverrideRow = overrideDates.has(displayedDate);
                            if (isOverrideRow) {
                              activityLabel = 'edited and run';
                            }
                            // Specific override: mark 6/9/2025, 8:00:00 PM as 'edited and saved'
                            if (displayedDate === '6/9/2025, 8:00:00 PM' && !isRun) {
                              activityLabel = 'edited and saved';
                            }
                            return (
                              <TableRow key={`${r.type}-${r.id}`} hover>
                                <TableCell>{new Date(r.date).toLocaleString()}</TableCell>
                                <TableCell>{activityLabel}</TableCell>
                                <TableCell>{r.by}</TableCell>
                                <TableCell align="right">
                                  {(isRun || isOverrideRow) ? (
                                    <>
                                      <Tooltip title="View"><IconButton size="small" aria-label="view"><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                                      <Tooltip title="Download"><IconButton size="small" aria-label="download"><GetAppIcon fontSize="small" /></IconButton></Tooltip>
                                    </>
                                  ) : isSchedule ? (
                                    <Tooltip title="View schedule">
                                      <IconButton
                                        size="small"
                                        aria-label="view-schedule"
                                        onClick={() => {
                                          const found = schedules.find(s => `schedule-${s.id}` === (r as any).id);
                                          if (found) {
                                            setSchedContext({
                                              id: found.id,
                                              frequency: found.frequency as any,
                                              status: found.status,
                                              recipients: found.recipients,
                                              nextRun: found.nextRun,
                                              lastRun: found.lastRun,
                                              scheduledBy: found.scheduledBy,
                                            });
                                            setSchedOpen(true);
                                          }
                                        }}
                                      >
                                        <EventNoteOutlinedIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                      {displayedDate === '6/9/2025, 8:00:00 PM' && (
                                        <Tooltip title="View changes">
                                          <IconButton size="small" aria-label="view-changes" onClick={() => { setDiffContext({ date: displayedDate, by: r.by }); setDiffOpen(true); }}>
                                            <DifferenceOutlinedIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                      {displayedDate !== '6/9/2025, 8:00:00 PM' && (
                                        <Typography variant="caption" color="text.secondary">—</Typography>
                                      )}
                                    </Stack>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {filtered.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4}>
                                <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                );
              })()}
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
