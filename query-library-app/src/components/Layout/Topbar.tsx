import { AppBar, Box, IconButton, Toolbar, Typography, Avatar, Stack, Tooltip, Container } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useLocation, Link } from 'react-router-dom';

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [
    { label: 'Analytics Hub', to: '/' },
    { label: 'Query Library', to: '/' },
    ...parts.map((p, idx) => ({
      label: decodeURIComponent(p.charAt(0).toUpperCase() + p.slice(1)),
      to: '/' + parts.slice(0, idx + 1).join('/'),
    })),
  ];
  return crumbs;
}

export default function Topbar() {
  const crumbs = useBreadcrumbs();
  return (
    <>
      {/* Top purple bar with breadcrumbs and title */}
      <AppBar position="fixed" color="secondary" elevation={0} sx={(t) => ({ boxShadow: 'none', zIndex: t.zIndex.drawer + 1 })}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }}>
          <Toolbar disableGutters sx={{ display: 'flex', gap: 2, alignItems: 'center', minHeight: 64 }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'secondary.contrastText' }}>
                {crumbs.map((c, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="center">
                    {i > 0 && <Typography variant="body2" sx={{ opacity: 0.8 }}>/</Typography>}
                    <Typography variant="body2" component={Link} to={c.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {c.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton color="inherit">
                <NotificationsNoneIcon />
              </IconButton>
              <Tooltip title="My Profile">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>MM</Avatar>
              </Tooltip>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Spacer handled by <Toolbar/> in Layout */}
    </>
  );
}
