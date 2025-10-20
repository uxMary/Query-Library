import React from 'react';
import { AppBar, Toolbar, Container, Stack, Typography, IconButton, Box, Link as MLink, useTheme, Avatar } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

/**
 * GlobalTopNav
 * A compact, global athenaOne-style navigation bar that persists across the app.
 * - Left: brand + primary nav links
 * - Right: utility icons (support, settings, notifications) + avatar
 */
export default function GlobalTopNav() {
  const theme = useTheme();
  const height = 40; // compact height

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#4E2D82',
        color: 'common.white',
        height,
        justifyContent: 'center',
        zIndex: (t) => t.zIndex.drawer + 2,
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.2)'}`,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }}>
        <Toolbar disableGutters variant="dense" sx={{ minHeight: height, height }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>athenaOne</Typography>
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['Calendar', 'Patients', 'Ancillaries', 'Claims', 'Financials', 'Reports', 'Quality', 'Apps', 'Support'].map((item) => (
                <MLink
                  key={item}
                  href="#"
                  underline="none"
                  color="inherit"
                  sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                >
                  <Typography variant="body2">{item}</Typography>
                </MLink>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0} alignItems="center">
            <IconButton color="inherit" size="small" aria-label="support">
              <HelpOutlineOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="settings">
              <SettingsOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="notifications">
              <NotificationsNoneIcon fontSize="small" />
            </IconButton>
            <Box sx={{ pl: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>MM</Avatar>
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
