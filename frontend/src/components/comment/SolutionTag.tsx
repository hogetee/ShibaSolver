import React from 'react';
import Chip from '@mui/material/Chip';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

// This component now takes no props.
export const SolutionTag: React.FC = () => {
  return (
    <Chip
      label="Solution"
      icon={<LightbulbOutlinedIcon />}
      
      // `onClick` and `clickable` props have been removed.
      sx={{
        borderRadius: '8px',
        backgroundColor: '#A78BFA',
        color: 'white',
        fontWeight: 'bold',
        // This ensures the icon is also white.
        '& .MuiChip-icon': {
          color: 'white',
        },
        // This makes sure the cursor doesn't change on hover.
        cursor: 'default',
        '&:hover': {
          backgroundColor: '#8B5CF6', // A darker purple
        },
      }}
    />
  );
};