import React from 'react';
import IconButton from '@mui/material/IconButton';
import ReplyIcon from '@mui/icons-material/Reply';
import { ReplyButtonProps } from './types'; 

// ******** handle ไปแก้ใน file useCommentAction ************

export const ReplyButton: React.FC<ReplyButtonProps> = ({ isReplying, onClick }) => {
    return (
       
        
            <IconButton
                className="rounded-full hover:bg-gray-100"
                onClick={onClick}
                color={isReplying ? 'primary' : 'default'}
                aria-label="Reply comment"
                size="small"
                style={{
                    // Use fixed, equal values to ensure a square shape
                    width: '25px',
                    height: '25px',
                    // The borderRadius is handled by IconButton, but this ensures a circle
                    borderRadius: '50%', 
                    // Merge existing conditional styles
                    ...(isReplying ? { backgroundColor: 'var(--color-accent-400)', color: 'white' } : {backgroundColor: 'black', color: 'white'})
                }}
            >
                {/* Adjust icon size if needed */}
                <ReplyIcon fontSize="small" />
            </IconButton>
      
    );
};