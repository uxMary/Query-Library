import { Box, Chip, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { folders, tags as allTags } from '@/data/mock';

interface Props {
  type: string | undefined;
  setType: (t: string | undefined) => void;
  folderId: string | undefined;
  setFolderId: (id: string | undefined) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function FiltersPanel({ type, setType, folderId, setFolderId, selectedTags, setSelectedTags }: Props) {
  const types = useMemo(() => ['Athena', 'Practice', 'Custom'], []);

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Filters</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Type</InputLabel>
          <Select label="Type" value={type ?? ''} onChange={(e) => setType(e.target.value || undefined)} displayEmpty>
            <MenuItem value=""><em>Any</em></MenuItem>
            {types.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 240 }} size="small">
          <InputLabel>Folder</InputLabel>
          <Select label="Folder" value={folderId ?? ''} onChange={(e) => setFolderId(e.target.value || undefined)} displayEmpty>
            <MenuItem value=""><em>Any</em></MenuItem>
            {folders.map((f) => (
              <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 280 }} size="small">
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]))}
            input={<OutlinedInput label="Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {allTags.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
