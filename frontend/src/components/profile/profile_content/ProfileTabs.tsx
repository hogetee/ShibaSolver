"use client";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProfileTabs({ postCountLabel, commentCountLabel }: { postCountLabel?: string; commentCountLabel?: string; }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') || 'posts';

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(`?tab=${newValue}`);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={tab} 
        onChange={handleChange} 
        aria-label="profile tabs"
        sx={{
          '& .MuiTab-root': { color: 'rgb(255, 255, 255,0.5)' },
          '& .Mui-selected': { color: 'rgb(255, 255, 255,1)' },
          '& .MuiTabs-indicator': { backgroundColor: 'white' }
        }}
      >
        <Tab value="posts" label={`Posts (${postCountLabel})`} sx={{
          fontWeight: 'bold',
          fontFamily: 'inherit',
          fontSize: '1.25rem',
        }}/>
        <Tab value="comments" label={`Comments (${commentCountLabel})`} sx={{
          fontWeight: 'bold',
          fontFamily: 'inherit',
          fontSize: '1.25rem',
        }}/>
      </Tabs>
    </Box>
  );
}
