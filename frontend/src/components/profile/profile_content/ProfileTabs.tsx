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
    router.push(`?tab=${newValue}`, { scroll: false });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={tab} 
        onChange={handleChange} 
        aria-label="profile tabs"
        sx={{
          '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)' },
          '& .MuiTab-root.Mui-selected': { color: 'rgb(255,255,255)' },
          '& .MuiTabs-indicator': { backgroundColor: 'rgb(255,255,255)' },
          '& .MuiTab-root:focus': { color: 'rgb(255,255,255)' }
        }}
      >
        <Tab value="posts" label={postCountLabel ? `Posts (${postCountLabel})` : "Posts"} sx={{
          fontWeight: 'bold',
          fontFamily: 'inherit',
          fontSize: '1.25rem',
        }}/>
        <Tab value="comments" label={commentCountLabel ? `Comments (${commentCountLabel})` : "Comments"} sx={{
          fontWeight: 'bold',
          fontFamily: 'inherit',
          fontSize: '1.25rem',
        }}/>
      </Tabs>
    </Box>
  );
}
