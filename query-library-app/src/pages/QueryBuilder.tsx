import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PageHeader from '@/components/Layout/PageHeader';
import { useParams } from 'react-router-dom';
import { queries } from '@/data/mock';

// Prototype attribute catalog (seed minimal groups/attributes)
const CATALOG: { group: string; items: string[] }[] = [
  { group: 'Commonly used', items: ['Claim ID', 'Patient ID', 'Provider Group'] },
  { group: 'Provider', items: ['Provider NPI', 'Provider Name'] },
  { group: 'Transaction', items: ['Total Charges', 'Total Payments', 'Contractual Adjustments'] },
  { group: 'Claim', items: ['Payer Insurance Reporting Category', 'Current Claim Error'] },
  { group: 'Payer', items: ['Payer Name'] },
];

export default function QueryBuilder() {
  const { id } = useParams();
  const query = queries.find(q => q.id === id);
  const policy: 'date-only' | 'full' = query?.editableFilterPolicy || 'full';
  const [tab, setTab] = useState(0); // 0=Columns, 1=Filters
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState<string[]>([
    'Month of Service',
    'Payer Insurance Reporting Category',
    'Current Claim Error',
    'Total Charges',
    'Total Payments',
    'Contractual Adjustments',
    'Global/Cap Adjustments',
    'Non-Contractual Adjustments',
  ]);

  // Filters prototype
  type FilterRow = { field: string; operator: string; value: string };
  const [filters, setFilters] = useState<FilterRow[]>([]);

  const filteredCatalog = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return CATALOG;
    return CATALOG.map(g => ({
      group: g.group,
      items: g.items.filter(i => i.toLowerCase().includes(t)),
    })).filter(g => g.items.length > 0);
  }, [search]);

  const handleAdd = (name: string) => {
    setAdded(prev => (prev.includes(name) ? prev : [...prev, name]));
  };
  const handleRemove = (name: string) => setAdded(prev => prev.filter(n => n !== name));

  // Save menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleCloseSaveMenu = () => setAnchorEl(null);

  const onSave = () => {
    // TODO: persist builder state to localStorage or mocks
    handleCloseSaveMenu();
  };
  const onSaveAs = () => {
    // TODO: create a new QueryItem from builder state
    handleCloseSaveMenu();
  };

  const onRun = () => {
    // TODO: run with mock and show preview
  };

  const columnsPane = (
    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
      {/* Left attribute tree/search */}
      <Paper variant="outlined" sx={{ width: 320, p: 1.5, flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Search column attributes to add"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
          fullWidth
        />
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1} sx={{ maxHeight: 420, overflow: 'auto', pr: 0.5 }}>
          {filteredCatalog.map(g => (
            <Box key={g.group}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{g.group}</Typography>
              <Stack sx={{ mt: 0.5 }}>
                {g.items.map(item => (
                  <Button
                    key={item}
                    size="small"
                    onClick={() => handleAdd(item)}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    + {item}
                  </Button>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Added columns list */}
      <Paper variant="outlined" sx={{ flex: 1, p: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Added column attributes ({added.length})</Typography>
          <Typography variant="caption" color="text.secondary">Actions</Typography>
        </Stack>
        <List dense disablePadding>
          {added.map(name => (
            <ListItem key={name} divider secondaryAction={
              <Tooltip title="Remove">
                <IconButton edge="end" size="small" onClick={() => handleRemove(name)} aria-label="remove">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <DragIndicatorIcon fontSize="small" color="disabled" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={name} />
            </ListItem>
          ))}
          {added.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">Select columns from the left to start building your query.</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Stack>
  );

  const isDateField = (name: string) => /date|month|day|week|year/i.test(name || '');
  const filtersPane = (
    <Paper variant="outlined" sx={{ p: 1.5, mt: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Button size="small" variant="outlined" onClick={() => setFilters(prev => [...prev, { field: '', operator: '', value: '' }])}>+ Add filter</Button>
        <Typography variant="caption" color="text.secondary">Define filters to narrow results</Typography>
      </Stack>
      {filters.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No filters added.</Typography>
      ) : (
        <Stack spacing={1}>
          {filters.map((f, idx) => (
            <Stack key={idx} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <TextField size="small" label="Field" value={f.field} onChange={(e) => setFilters(prev => prev.map((x,i)=> i===idx ? { ...x, field: e.target.value } : x))} sx={{ minWidth: 180 }} />
              <TextField size="small" label="Operator" value={f.operator} onChange={(e) => setFilters(prev => prev.map((x,i)=> i===idx ? { ...x, operator: e.target.value } : x))} sx={{ minWidth: 160 }} disabled={policy==='date-only' && !isDateField(f.field)} />
              <TextField size="small" label="Value" value={f.value} onChange={(e) => setFilters(prev => prev.map((x,i)=> i===idx ? { ...x, value: e.target.value } : x))} sx={{ minWidth: 220 }} disabled={policy==='date-only' && !isDateField(f.field)} />
              {policy==='date-only' && !isDateField(f.field) && (
                <Tooltip title="This query is guardrailed: only Date filters can be edited."><span><LockOutlinedIcon color="disabled" fontSize="small" /></span></Tooltip>
              )}
              <IconButton aria-label="delete" size="small" onClick={() => setFilters(prev => prev.filter((_,i)=>i!==idx))}><DeleteIcon fontSize="small" /></IconButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Query Builder"
        // Breadcrumbs are handled by PageHeader using existing app logic
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Feedback"><IconButton size="small"><FeedbackOutlinedIcon /></IconButton></Tooltip>
            <Tooltip title="Help"><IconButton size="small"><HelpOutlineIcon /></IconButton></Tooltip>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              Save
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseSaveMenu}>
              <MenuItem onClick={onSave}>Save</MenuItem>
              <MenuItem onClick={onSaveAs}>Save As…</MenuItem>
            </Menu>
            <Button size="small" variant="contained" startIcon={<PlayArrowIcon />} onClick={onRun}>Run Query</Button>
          </Stack>
        }
      />

      <Paper variant="outlined" sx={{ p: 0 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 1 }}>
          <Tab label="Select Columns" />
          <Tab label="Select Filters" />
        </Tabs>
        <Divider />
        <Box sx={{ p: 2 }}>
          {tab === 0 ? columnsPane : filtersPane}
        </Box>
      </Paper>

      {/* Footer actions */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
        <TextField size="small" placeholder="Chart Widget Name" sx={{ maxWidth: 360 }} />
        <Button size="small" variant="outlined">View Full Results</Button>
      </Stack>
    </Stack>
  );
}
