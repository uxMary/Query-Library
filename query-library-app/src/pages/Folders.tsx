import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Pagination, Stack, Typography, TextField, Chip, IconButton, InputAdornment, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, ToggleButtonGroup, ToggleButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { folders, queries as allQueries, schedules } from '@/data/mock';
import { QueryItem } from '@/types';
import QueryCard from '@/components/QueryCard';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/Layout/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import FolderCard from '@/components/FolderCard';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';

export default function Folders() {
  const { slug } = useParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [category, setCategory] = useState<'All' | 'System' | 'My'>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

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

  const formatOwner = (q: QueryItem) => {
    if (q.type === 'Athena') return 'athenahealth';
    if (q.type === 'Practice') return `Practice: ${q.owner}`;
    if (q.sharedBy) return `${q.createdBy} • Shared by ${q.sharedBy}`;
    return q.createdBy || q.owner || '—';
  };

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

        <Stack direction="column" spacing={1} alignItems="flex-start">
          <TextField
            size="small"
            placeholder="Search folders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ width: { xs: '100%', md: '66.6667%' } }}
          />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {(['All','System','My'] as const).map(cat => (
              <Chip
                key={cat}
                size="small"
                label={cat}
                color={category === cat ? 'primary' : 'default'}
                variant={category === cat ? 'filled' : 'outlined'}
                onClick={() => setCategory(cat)}
              />
            ))}
            {/* Inline type-based tags summary for All Folders view */}
            {(() => {
              const counts: Record<string, number> = {};
              items.forEach(q => {
                const add = (label: string) => { counts[label] = (counts[label] || 0) + 1; };
                if (q.type === 'Athena') add('Athenahealth');
                if (q.type === 'Practice') add('Practice');
                if (q.type === 'Custom') add('My Query');
                if (q.sharedBy) add('Shared');
              });
              const entries = Object.entries(counts);
              return entries.map(([label, n]) => (
                <Chip key={label} size="small" variant="outlined" label={`${label} (${n})`} />
              ));
            })()}
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {visible.map(({ folder, count, isMy }) => {
            const slugPath = toSlugLocal(folder.name);
            const inThisFolder = items.filter(q => q.folderId === folder.id);
            const previews = inThisFolder.slice(0, 3);
            const accent = isMy ? '#0466B4' : '#4E2D82';
            const folderTags = Array.from(new Set(inThisFolder.flatMap(q => q.tags || []))).slice(0, 6);
            return (
              <Grid key={folder.id} item xs={12} sm={6} md={4} sx={{ display: 'flex', position: 'relative' }}>
                <Box component={Link} to={`/folders/${slugPath}`} sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1, '& > *': { flex: 1 } }}>
                  <FolderCard title={`${folder.name} (${count})`} description={folder.description} previewQueries={previews} accentColor={accent} isCustom={isMy} tags={folderTags} />
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" onClick={() => togglePin(selectedFolder.name)} startIcon={isPinned(selectedFolder.name) ? <PushPinIcon /> : <PushPinOutlinedIcon />}>
              {isPinned(selectedFolder.name) ? 'Unpin' : 'Pin'}
            </Button>
            <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setView(v)}>
              <ToggleButton value="grid">Grid</ToggleButton>
              <ToggleButton value="list">List</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        ) : undefined}
      />
      <TextField
        size="small"
        placeholder="Search in this folder"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
        sx={{ width: { xs: '100%', md: '66.6667%' } }}
      />
      {/* Type-based tags summary for this folder */}
      {selectedFolder && (
        (() => {
          const qs = items.filter(q => q.folderId === selectedFolder.id);
          const counts: Record<string, number> = {};
          qs.forEach(q => {
            const add = (label: string) => { counts[label] = (counts[label] || 0) + 1; };
            if (q.type === 'Athena') add('Athenahealth');
            if (q.type === 'Practice') add('Practice');
            if (q.type === 'Custom') add('My Query');
            if (q.sharedBy) add('Shared');
          });
          const entries = Object.entries(counts);
          if (!entries.length) return null;
          return (
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {entries.map(([label, n]) => (
                <Chip key={label} size="small" variant="outlined" label={`${label} (${n})`} />
              ))}
            </Stack>
          );
        })()
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Queries in this folder</Typography>
          {filtered.length === 0 ? (
            <Box sx={{ p: 3, borderRadius: 1, border: (t) => `1px solid ${t.palette.divider}` }}>
              <Typography color="text.secondary">No queries found in this folder.</Typography>
            </Box>
          ) : view === 'list' ? (
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
                  {paged.map((q) => {
                    const scheds = schedules.filter(s => s.queryId === q.id);
                    const latest = scheds.map(s => ({ s, t: s.lastRun ? Date.parse(s.lastRun) : 0 })).sort((a,b)=>b.t-a.t)[0]?.s;
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
                            <Box component={Link} to={`/query/${q.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                              {q.name}
                            </Box>
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
                                <Chip size="small" label={`+${recipsAll.length - recips.length}`} variant="outlined" />
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
                </TableBody>
              </Table>
            </TableContainer>
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
