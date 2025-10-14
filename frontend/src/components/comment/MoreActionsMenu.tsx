import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { MoreActionsButtonProps } from './types';
import SvgIcon from '@mui/material/SvgIcon';

// ******** handle ไปแก้ใน file useCommentAction ************

export const MoreActionsMenu: React.FC<MoreActionsButtonProps> = ({
    anchorEl,
    handleMenuOpen,
    handleMenuClose,
    handleEdit,
    handleDelete,
    handleSetSolution,
    handleDeleteModalOpen,
}) => {
    return (
        <>
            <IconButton
                aria-label="display more actions"
                onClick={handleMenuOpen}
                size="small"
                style={{
                    // Use fixed, equal values to ensure a square shape
                    width: '25px',
                    height: '25px',
                    // The borderRadius is handled by IconButton, but this ensures a circle
                    borderRadius: '50%', 
                    // Merge existing conditional styles
                    ...(Boolean(anchorEl) ?{ backgroundColor: '#1976d2', color: 'white' } : {backgroundColor: 'black', color: 'white'})
                }}
            >
                <MoreHorizIcon fontSize="small" />
            </IconButton>
            

            <Menu
                anchorEl={anchorEl}
                
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                disableScrollLock={true}
              
                // Apply custom styles to the menu container
                PaperProps={{
                    elevation: 0, // Remove default shadow
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))', // Add a subtle shadow
                        mt: 1,
                        border: '1px solid black',
                        borderRadius: '12px',
                    },
                }}
                
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} fontSize="small" />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteModalOpen}>
                    {/* <DeleteOutlineIcon sx={{ mr: 1 }} fontSize="small" /> */}
                    <SvgIcon  sx={{ mr: 1 }} fontSize="small">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </SvgIcon>
                    Delete
                </MenuItem>
                <MenuItem onClick={handleSetSolution}>
                    <LightbulbOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
                    Solution
                </MenuItem>
            </Menu>
        </>
    );
};