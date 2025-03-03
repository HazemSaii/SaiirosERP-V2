import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import {Iconify} from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  person: any;
};

export default function EmployeeItem({ person }: Props) {
  const [permission, setPermission] = useState(person.permission);

  const popover = usePopover();

  const handleChangePermission = useCallback((newPermission: string) => {
    setPermission(newPermission);
  }, []);

  return (
    <>
      <ListItem
        sx={{
          px: 0,
          py: 1,
        }}
      >
        <Avatar alt={person.firstName} src={person.avatarUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={`${person.firstName} ${person.lastName}`}
          secondary={
            <Tooltip title={person.workEmail}>
              <span>{person.workEmail}</span>
            </Tooltip>
          }
          primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
          secondaryTypographyProps={{ noWrap: true, component: 'span' }}
          sx={{ flexGrow: 1, pr: 1 }}
        />
      </ListItem>

      <CustomPopover
       open={popover.open}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
        anchorEl={popover.anchorEl}
        sx={{ width: 160 }}>
        <>
          <MenuItem
            selected={permission === 'view'}
            onClick={() => {
              popover.onClose();
              handleChangePermission('view');
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Can view
          </MenuItem>

          <MenuItem
            selected={permission === 'edit'}
            onClick={() => {
              popover.onClose();
              handleChangePermission('edit');
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Can edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove
          </MenuItem>
        </>
      </CustomPopover>
    </>
  );
}
