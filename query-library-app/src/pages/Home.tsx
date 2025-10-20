import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, Tab, Tabs, Typography, ToggleButton, ToggleButtonGroup, List, ListItem, ListItemText, IconButton, Divider, Button, TextField, Paper, FormControl, InputLabel, Select, MenuItem, Chip, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
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

  // Format owner information similar to OneDrive ownership display
  const formatOwner = (q: QueryItem) => {
    if (q.type === 'Athena') return 'athenahealth';
    if (q.type === 'Practice') return `Practice: ${q.owner}`;
    // Custom
    if (q.sharedBy) return `${q.createdBy} • Shared by ${q.sharedBy}`;
    return q.createdBy || q.owner || '—';
  };

  const renderTable = (rows: QueryItem[]) => (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Last run</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Recipients</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((q) => {
            const scheds = schedules.filter(s => s.queryId === q.id);
            const latest = scheds
              .map(s => ({ s, t: s.lastRun ? Date.parse(s.lastRun) : 0 }))
              .sort((a,b)=>b.t-a.t)[0]?.s;
            const status = latest?.status;
            const statusColor = status === 'Failed' ? 'error' : status === 'Success' ? 'success' : status === 'Paused' ? 'warning' : 'default';
            const recipsAll = Array.from(new Set(scheds.flatMap(s => s.recipients || [])));
            const recips = recipsAll.slice(0,3);
            return (
              <TableRow key={q.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" onClick={() => toggleFavorite(q.id)} aria-label={q.favorite ? 'unfavorite' : 'favorite'}>
                      {q.favorite ? <Star fontSize="small" color="warning"/> : <StarBorder fontSize="small" />}
                    </IconButton>
                    <Tooltip
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: '#F3EAFB',
                            color: 'text.primary',
                            border: '1px solid #E0D4EF',
                            boxShadow: 3,
                            maxWidth: 360,
                            p: 1.5,
                            '& .MuiTooltip-arrow': { color: '#F3EAFB' },
                          }
                        }
                      }}
                      title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontSize: 12, mb: 0.5 }}>{q.name}</Typography>
                          {q.description && (
                            <Typography variant="body2" sx={{ fontSize: 12, mb: 0.5 }} color="text.secondary">{q.description}</Typography>
                          )}
                          <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Owner: {formatOwner(q)}</Typography>
                          {!!q.tags.length && (
                            <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Tags: {q.tags.join(', ')}</Typography>
                          )}
                          {q.config && (
                            <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Config: {q.config.columns.length} cols{q.config.filters.length ? ` • ${q.config.filters.length} filters` : ''}</Typography>
                          )}
                        </Box>
                      }
                    >
                      <Box component={Link} to={`/query/${q.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                        {q.name}
                      </Box>
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell>{formatOwner(q)}</TableCell>
                <TableCell>{q.lastRun ? new Date(q.lastRun).toLocaleString() : '—'}</TableCell>
                <TableCell>{status ? <Chip size="small" label={status} color={statusColor as any} /> : '—'}</TableCell>
                <TableCell>
                  {recips.length ? (
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                      {recips.map(r => <Chip key={r} size="small" label={r} />)}
                      {recipsAll.length > recips.length && (
                        <Tooltip title={recipsAll.join(', ')}>
                          <Chip size="small" label={`+${recipsAll.length - recips.length}`} variant="outlined" />
                        </Tooltip>
                      )}
                    </Stack>
                  ) : '—'}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" component={Link} to={`/query/${q.id}`} aria-label="view"><VisibilityIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">No results</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Stack spacing={2} sx={{ ml: 0, pl: 0, width: '100%' }}>
      <PageHeader
        title="Query Library"
        actions={<Button variant="contained" component={Link} to="/builder">New Query</Button>}
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
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Last run</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Recipients</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(0, 25).map((q) => {
                  const scheds = schedules.filter(s => s.queryId === q.id);
                  const latest = scheds
                    .map(s => ({ s, t: s.lastRun ? Date.parse(s.lastRun) : 0 }))
                    .sort((a,b)=>b.t-a.t)[0]?.s;
                  const status = latest?.status;
                  const statusColor = status === 'Failed' ? 'error' : status === 'Success' ? 'success' : status === 'Paused' ? 'warning' : 'default';
                  const recips = Array.from(new Set(scheds.flatMap(s => s.recipients || []))).slice(0,3);
                  return (
                    <TableRow key={q.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton size="small" onClick={() => toggleFavorite(q.id)} aria-label={q.favorite ? 'unfavorite' : 'favorite'}>
                            {q.favorite ? <Star fontSize="small" color="warning"/> : <StarBorder fontSize="small" />}
                          </IconButton>
                          <Tooltip
                            placement="top"
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: '#F3EAFB',
                                  color: 'text.primary',
                                  border: '1px solid #E0D4EF',
                                  boxShadow: 3,
                                  maxWidth: 360,
                                  p: 1.5,
                                  '& .MuiTooltip-arrow': { color: '#F3EAFB' },
                                }
                              }
                            }}
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontSize: 12, mb: 0.5 }}>{q.name}</Typography>
                                {q.description && (
                                  <Typography variant="body2" sx={{ fontSize: 12, mb: 0.5 }} color="text.secondary">{q.description}</Typography>
                                )}
                                <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Owner: {formatOwner(q)}</Typography>
                                {!!q.tags.length && (
                                  <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Tags: {q.tags.join(', ')}</Typography>
                                )}
                                {q.config && (
                                  <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Config: {q.config.columns.length} cols{q.config.filters.length ? ` • ${q.config.filters.length} filters` : ''}</Typography>
                                )}
                              </Box>
                            }
                          >
                            <Box component={Link} to={`/query/${q.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                              {highlightMatch(q.name, search)}
                            </Box>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatOwner(q)}</TableCell>
                      <TableCell>{q.lastRun ? new Date(q.lastRun).toLocaleString() : '—'}</TableCell>
                      <TableCell>{status ? <Chip size="small" label={status} color={statusColor as any} /> : '—'}</TableCell>
                      <TableCell>
                        {recips.length ? (
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                            {recips.map(r => <Chip key={r} size="small" label={r} />)}
                            {scheds.some(s => (s.recipients||[]).length > recips.length) && (
                              <Tooltip title={(scheds.flatMap(s=>s.recipients||[])).join(', ')}>
                                <Chip size="small" label={`+${(new Set(scheds.flatMap(s=>s.recipients||[]))).size - recips.length}`} variant="outlined" />
                              </Tooltip>
                            )}
                          </Stack>
                        ) : '—'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" component={Link} to={`/query/${q.id}`} aria-label="view"><VisibilityIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">No results</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
        <Grid item xs={12} md={12} lg={12} sx={{ display: activeMode ? 'none' : 'block' }}>
          {tab === 0 && (
            <Stack spacing={2}>
              {view === 'list' ? (
                renderTable(filtered.slice(0, 50))
              ) : (
                <>
                  <div>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Athena Recommended Queries</Typography>
                    <Grid container spacing={2}>
                      {athenaRecommended.map(q => (
                        <Grid item xs={12} sm={6} md={4} key={q.id} sx={{ display: 'flex' }}>
                          <QueryCard variant="suggested" query={q} onToggleFavorite={toggleFavorite} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                  <div>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Frequently Used Queries</Typography>
                    <Grid container spacing={2}>
                      {frequentlyUsed.map(q => (
                        <Grid item xs={12} sm={6} md={4} key={q.id} sx={{ display: 'flex' }}>
                          <QueryCard query={q} onToggleFavorite={toggleFavorite} />
                        </Grid>
                      ))}
                    </Grid>
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
                </>
              )}
            </Stack>
          )}

          {tab === 1 && (
            view === 'list' ? (
              renderTable(filtered.filter(q => q.favorite))
            ) : (
              <>
                <Grid container spacing={2}>
                  {filtered.filter(q => q.favorite).map(q => (
                    <Grid key={q.id} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                      <QueryCard query={q} onToggleFavorite={toggleFavorite} />
                    </Grid>
                  ))}
                </Grid>
                {filtered.filter(q => q.favorite).length === 0 && (
                  <Typography sx={{ mt: 1 }} color="text.secondary">No favorites yet.</Typography>
                )}
              </>
            )
          )}

          {tab === 2 && (
            view === 'list' ? (
              renderTable(filtered.filter(q => !!q.sharedBy))
            ) : (
              <>
                <Grid container spacing={2}>
                  {filtered.filter(q => !!q.sharedBy).map(q => (
                    <Grid key={q.id} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                      <QueryCard query={q} onToggleFavorite={toggleFavorite} />
                    </Grid>
                  ))}
                </Grid>
                {filtered.filter(q => !!q.sharedBy).length === 0 && (
                  <Typography sx={{ mt: 1 }} color="text.secondary">No shared queries.</Typography>
                )}
              </>
            )
          )}

          {tab === 3 && (
            view === 'list' ? (
              renderTable(filtered.filter(q => q.type === 'Custom'))
            ) : (
              <>
                <Grid container spacing={2}>
                  {filtered.filter(q => q.type === 'Custom').map(q => (
                    <Grid key={q.id} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                      <QueryCard query={q} onToggleFavorite={toggleFavorite} />
                    </Grid>
                  ))}
                </Grid>
                {filtered.filter(q => q.type === 'Custom').length === 0 && (
                  <Typography sx={{ mt: 1 }} color="text.secondary">No custom queries.</Typography>
                )}
              </>
            )
          )}
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
