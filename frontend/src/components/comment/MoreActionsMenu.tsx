'use client';

import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import { MoreActionsButtonProps } from './types';
import SvgIcon from '@mui/material/SvgIcon';

export const MoreActionsMenu: React.FC<MoreActionsButtonProps> = ({
    anchorEl,
    handleMenuOpen,
    handleMenuClose,
    handleEdit,
    handleDelete,
    handleSetSolution,
    handleDeleteModalOpen,
    owner,
    handleReportClick
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <IconButton
                ref={buttonRef}
                aria-label="display more actions"
                onClick={handleToggle}
                size="small"
                style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? 'var(--color-accent-400)' : 'var(--color-dark-900)',
                    color: 'white'
                }}
            >
                <MoreHorizIcon fontSize="small" />
            </IconButton>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute left-0 top-8 z-20 bg-white border border-black rounded-xl shadow-lg min-w-[120px] font-display text-dark-900 overflow-hidden">
                        {owner && <div> <div 
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleAction(handleEdit)}
                        >
                            <EditIcon fontSize="small" className="mr-2" />
                            Edit
                        </div>
                        <div 
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleAction(handleDeleteModalOpen)}
                        >
                            <SvgIcon fontSize="small" className="mr-2">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </SvgIcon>
                            Delete
                        </div> 
                        <div 
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleAction(handleSetSolution)}
                        >
                            <LightbulbOutlinedIcon fontSize="small" className="mr-2" />
                            Solution
                        </div> </div> }
                        <div 
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleAction(handleReportClick)}
                        >
                            <OutlinedFlagIcon fontSize="small" className="mr-2" />
                            Report
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};