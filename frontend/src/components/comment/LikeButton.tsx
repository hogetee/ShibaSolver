import React from 'react';
import IconButton from '@mui/material/IconButton';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { ActionButtonProps } from './types'; 


// ******** handle ไปแก้ใน file useCommentAction ************

export const LikeButton: React.FC<ActionButtonProps> = ({ count, userStatus, onClick }) => {
    return (
        <div className="flex items-center gap-1">
          
             <IconButton
                className=" rounded-full hover:bg-gray-100"
                onClick={onClick}
                aria-label="Like comment"
                size="small"
                // Flip the icon for Dislike visual representation
                style={{
                       
                         width: '25px',
                        height: '25px',
                        // The borderRadius is handled by IconButton, but this ensures a circle
                     
                        // Merge existing conditional styles
                        ...(userStatus === 'liked' ?{ backgroundColor: 'var(--color-accent-400)', color: 'white' } : {backgroundColor: 'black', color: 'white'})
                }}
                >
                <ThumbUpAltIcon   style={{ fontSize: '17px' }}/>
            </IconButton>
          
            <span className="text-base font-bold min-w-[1.25rem]">{count > 0 ? count : ''}</span>
        </div>
    );
};