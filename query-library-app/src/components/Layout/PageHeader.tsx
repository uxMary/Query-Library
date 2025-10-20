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
