import { Box, Stack, Typography, Grid, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import MiniQueryCard from './MiniQueryCard';
import { QueryItem } from '@/types';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

interface Props {
  title: string;
  description?: string;
  previewQueries?: QueryItem[];
  accentColor?: string; // e.g., brand/primary hue for folder colorization
  isCustom?: boolean; // whether this is a user/custom folder vs system
  tags?: string[]; // aggregated tags to show
}

// Folder card with a subtle top "tab" notch and light border to differentiate the Folders swimlane
export default function FolderCard({ title, description, previewQueries, accentColor = '#0466B4', isCustom = false, tags }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        border: (t) => `1px solid ${alpha(accentColor, 0.2)}`,
        bgcolor: (t) => alpha(accentColor, 0.06),
        p: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: -8,
          left: 24,
          width: 56,
          height: 16,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          bgcolor: accentColor,
          border: (t) => `1px solid ${alpha(accentColor, 0.4)}`,
          borderBottom: 'none',
        },
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          {isCustom ? (
            <PersonOutlineIcon fontSize="small" sx={{ color: '#0466B4' }} />
          ) : (
            <FolderOutlinedIcon fontSize="small" sx={{ color: '#4E2D82' }} />
          )}
          <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
        </Stack>
        {tags && tags.length > 0 ? (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
            {tags.map((p) => (
              <Chip key={p} size="small" variant="outlined" label={p} />
            ))}
          </Stack>
        ) : description && (() => {
          const parts = description.split(',').map(s => s.trim()).filter(Boolean);
          const looksLikeTags = parts.length > 1 && parts.every(p => p.length <= 30);
          return looksLikeTags ? (
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
              {parts.map(p => (
                <Chip key={p} size="small" variant="outlined" label={p} />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">{description}</Typography>
          );
        })()}
        {previewQueries && previewQueries.length > 0 && (
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {previewQueries.slice(0, 5).map((q) => (
              <Grid item xs={12} key={q.id}>
                <MiniQueryCard item={q} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
}
