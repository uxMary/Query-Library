import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box, IconButton, Tooltip, Divider } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MoveToInboxRoundedIcon from '@mui/icons-material/MoveToInboxRounded';
import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
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
        {/* Reduce spacing between icon and label; improve selected affordance */}
        <Box sx={{
          '& .MuiListItemIcon-root': { minWidth: 32 },
          '& .MuiListItemButton-root.Mui-selected': {
            bgcolor: 'rgba(4,102,180,0.10)',
            '&:hover': { bgcolor: 'rgba(4,102,180,0.15)' },
          },
          '& .MuiListItemButton-root.Mui-selected .MuiListItemIcon-root': { color: 'primary.main' },
          '& .MuiListItemButton-root.Mui-selected .MuiListItemText-primary': { color: 'primary.main' },
        }}>
          <ListItemButton component={Link} to="/" selected={pathname === '/' || pathname === '/home'}>
            <ListItemIcon><HomeRoundedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={Link} to="/schedules" selected={pathname.startsWith('/schedules')}>
            <ListItemIcon><MoveToInboxRoundedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="My Inbox and schedules" />
          </ListItemButton>
          <ListItemButton component={Link} to="/housekeeping" selected={pathname.startsWith('/housekeeping')}>
            <ListItemIcon><CleaningServicesRoundedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Housekeeping" />
          </ListItemButton>
          <ListItemButton component={Link} to="/folders" selected={pathname === '/folders' || pathname.startsWith('/folders/')}>
            <ListItemIcon><FolderOpenRoundedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="All Folders" />
          </ListItemButton>
        </Box>
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

      {/* Removed Browse section so Pinned Folders is the last section as requested */}
    </Drawer>
  );
}
