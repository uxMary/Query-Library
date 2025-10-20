import { createTheme } from '@mui/material/styles';

const PRIMARY = '#0466B4';
const BRAND = '#4E2D82';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      contrastText: '#fff',
    },
    secondary: {
      main: BRAND,
      contrastText: '#fff',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
    divider: 'rgba(0,0,0,0.08)'
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: 0 } }
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)' } }
    },
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: 0 },
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0 },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0, boxShadow: 'none' },
        containedPrimary: { boxShadow: '0 2px 6px rgba(4,102,180,0.25)' }
      }
    }
  }
});

export default theme;
