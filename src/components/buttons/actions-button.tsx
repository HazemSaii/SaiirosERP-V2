import type {
  Theme,
  SxProps
} from '@mui/material';

import { t } from 'i18next';
import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { 
  Menu,
  Button,
  MenuItem,
  ListItemText
} from '@mui/material';

export type ActionType = string;

interface ActionsButtonProps {
  actions: ActionType[];
  handleOpenDialog: (action: ActionType) => void;
  isCreate?: boolean;
  buttonText?: string;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({ 
  actions,
  handleOpenDialog, 
  isCreate = false,
  buttonText =t('Actions')
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (label: ActionType) => {
    handleOpenDialog(label);
    handleClose();
  };

  const defaultButtonSx: SxProps<Theme> = {
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '8px',
    fontWeight: 'bold',
  };


  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        variant="contained"
        sx={{ ...defaultButtonSx }}
      >
        {buttonText}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'actions-button',
        }}
      >
        {!isCreate && actions.map((label) => (
          <MenuItem 
            key={label}
            onClick={() => handleMenuItemClick(label)}
          >
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionsButton;