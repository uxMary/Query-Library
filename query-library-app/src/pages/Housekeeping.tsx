import { Box, Chip, Grid, Paper, Stack, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import PageHeader from '@/components/Layout/PageHeader';

export default function Housekeeping() {
  return (
    <Stack spacing={2}>
      <PageHeader title="Housekeeping" />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Inactive Queries</Typography>
              <Button variant="outlined" size="small">Review</Button>
            </Stack>
            <List>
              <ListItem>
                <ListItemText primary="Old Payer Mix Report" secondary="Last run: 2023-12-15" />
                <Chip size="small" label="Inactive" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Legacy Denials Trend" secondary="Last run: 2024-01-05" />
                <Chip size="small" label="Inactive" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Orphaned Folders</Typography>
              <Button variant="outlined" size="small">Clean Up</Button>
            </Stack>
            <List>
              <ListItem>
                <ListItemText primary="Archived - 2022 Reports" secondary="0 queries" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Temp - Exports" secondary="1 query" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Data Source Syncs</Typography>
              <Button variant="contained" size="small">Sync Now</Button>
            </Stack>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Last Sync: 2025-09-30 02:00</Typography>
              <Typography variant="body2">Status: <Chip size="small" color="success" label="Healthy" /></Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">User Access Review</Typography>
              <Button variant="outlined" size="small">Manage</Button>
            </Stack>
            <List>
              <ListItem>
                <ListItemText primary="Shared: Readmission Risk Cohort" secondary="Shared by: asmith • Access: Viewer" />
                <Chip size="small" label="Review" color="warning" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
