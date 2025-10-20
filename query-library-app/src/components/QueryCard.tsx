import { Card, CardActionArea, CardContent, Chip, Stack, Typography, IconButton, Tooltip, Box, Divider } from '@mui/material';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import { QueryItem } from '@/types';
import { Link } from 'react-router-dom';
import { schedules, inbox, folders as allFolders } from '@/data/mock';

interface Props {
  query: QueryItem;
  onToggleFavorite?: (id: string) => void;
  variant?: 'suggested' | 'frequent';
}

export default function QueryCard({ query, onToggleFavorite, variant = 'frequent' }: Props) {
  // Derive latest run info from schedules
  const scheds = schedules.filter(s => s.queryId === query.id);
  const latest = scheds
    .map(s => ({ s, t: s.lastRun ? Date.parse(s.lastRun) : 0 }))
    .sort((a,b) => b.t - a.t)[0]?.s;
  const lastRunText = latest?.lastRun ? new Date(latest.lastRun).toLocaleString() : '—';
  const folderName = allFolders.find(f => f.id === (query as any).folderId)?.name || '—';
  const runsForQuery = inbox.filter(i => i.queryId === query.id);
  const numberOfRuns = runsForQuery.length;
  const numberOfSchedules = scheds.length;
  const filterCount = query.config?.filters?.length || 0;
  const filterList = (query.config?.filters || []).map((f: any) => `${f.field ?? f.name ?? 'field'} ${f.op ?? f.operator ?? ':'} ${f.value ?? f.val ?? ''}`);
  const filterPreview = filterCount ? (filterList.slice(0, 3).join(' • ') + (filterCount > 3 ? ` • +${filterCount - 3} more` : '')) : '—';
  const queryTypeLabel = (() => {
    if (query.type === 'Athena') return 'Athenahealth';
    if (query.type === 'Practice') return 'Practice';
    if (query.sharedBy) return 'Shared';
    return 'My Query';
  })();
  const ensureLongDescription = (name: string, d?: string) => {
    const base = (d || '').trim();
    if (base.length >= 150) return base;
    const filler = ` ${name} provides a comprehensive, enterprise-ready view tailored for operational and financial analysis. Use this query to explore trends, identify outliers, and support decision-making across teams with reliable, consistent metrics and curated filters.`;
    const combined = (base ? base + ' ' : '') + filler;
    return combined.length < 150 ? (combined + ' It is designed to scale and remain readable, with clear definitions and sample parameters that you can refine as needed.') : combined;
  };
  const longDesc = ensureLongDescription(query.name, query.description);
  return (
    <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 120ms ease, transform 120ms ease', '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.10)', transform: 'translateY(-1px)' } }}>
      {variant === 'suggested' && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#4E2D82'
          }}
        />
      )}
      <CardContent sx={{ pt: 2, pb: 2.25, pr: 5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Favorite inside the card, anchored top-right */}
        <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
          <Tooltip title={query.favorite ? 'Unfavorite' : 'Favorite'}>
            <IconButton size="small" onClick={(e) => { e.preventDefault(); onToggleFavorite?.(query.id); }} aria-label={query.favorite ? 'Unfavorite' : 'Favorite'}>
              {query.favorite ? <Star color="warning" fontSize="small" /> : <StarBorder fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        {/* Clickable content on the left; tooltip wraps the whole card area except the favorite icon */}
        <Tooltip
          enterDelay={300}
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#F3EAFB',
                color: 'text.primary',
                border: '1px solid #E0D4EF',
                boxShadow: 3,
                maxWidth: 420,
                p: 1.5,
                '& .MuiTooltip-arrow': { color: '#F3EAFB' },
              }
            }
          }}
          title={
            <Box sx={{ p: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontSize: 13, mb: 0.5 }}>{query.name}</Typography>
              <Typography variant="body2" sx={{ fontSize: 12, mb: 1 }} color="text.secondary">{longDesc}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Query Type: {queryTypeLabel}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Folder (Domain): {folderName}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Number of Run times: {numberOfRuns}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Last run: {lastRunText}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ display: 'block', mb: filterCount ? 0.5 : 0 }} color="text.secondary">Filters Applied: {filterCount || '—'}</Typography>
              {filterCount > 0 && (
                <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">
                  {(() => {
                    const txt = filterList.slice(0, 4).join(' | ');
                    return txt + (filterCount > 4 ? ` | +${filterCount - 4} more` : '');
                  })()}
                </Typography>
              )}
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">No Of Schedules: {numberOfSchedules}</Typography>
            </Box>
          }
        >
          <CardActionArea component={Link} to={`/query/${query.id}`} sx={{ alignItems: 'stretch', display: 'block', flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{query.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{query.description}</Typography>
            <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap', overflow: 'hidden', pr: 1, minHeight: 28 }}>
              <Chip size="small" label={query.type} color={variant === 'suggested' ? 'secondary' : 'primary'} variant="outlined" sx={{ '& .MuiChip-label': { px: 1 } }} />
              {query.tags.slice(0, 2).map((t) => (
                <Chip key={t} size="small" label={t} variant="outlined" sx={{ '& .MuiChip-label': { px: 1, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }} />
              ))}
              {query.tags.length > 2 && (
                <Chip size="small" label={`+${query.tags.length - 2}`} variant="outlined" sx={{ '& .MuiChip-label': { px: 1 } }} />
              )}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">Last run: {lastRunText}</Typography>
            </Stack>
          </CardActionArea>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
