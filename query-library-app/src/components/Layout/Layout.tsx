import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import GlobalTopNav from './GlobalTopNav';
import { HeaderProvider, useHeader } from './HeaderContext';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { headerNode } = useHeader();
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <GlobalTopNav />
      <Sidebar />
      <Box component="main" sx={{ flex: 1, ml: 0, px: 0, pt: 0, pb: { xs: 2, md: 3 } }}>
        {/* Spacer for GlobalTopNav (compact, 40px). Using Box to avoid rendering an empty Toolbar element. */}
        <Box sx={{ height: 40 }} />
        {/* Layout-level header slot: no horizontal padding for full-bleed */}
        {headerNode}
        {/* Padded content wrapper */}
        <Box sx={{ px: { xs: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <LayoutInner>{children}</LayoutInner>
    </HeaderProvider>
  );
}
