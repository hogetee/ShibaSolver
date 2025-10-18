import React from 'react';
import Chip from '@mui/material/Chip';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { ThemeProvider } from '@emotion/react';
import theme from '@/theme/theme';
// This component now takes no props.
export const SolutionTag: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
    <Chip
      label="Solution"
      icon={<LightbulbOutlinedIcon />}
      color='secondary'
      // `onClick` and `clickable` props have been removed.
      sx={{
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        backgroundColor: 'var(--color-accent-400)',
        // This ensures the icon is also white.
        '& .MuiChip-icon': {
          color: 'white',
        },
      }}
    />
    </ThemeProvider>
  );
};