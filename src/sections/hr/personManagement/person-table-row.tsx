import type { IPersonsItem } from 'src/types/persons';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { Box } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';
import { IMAGE_BASE } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';

type Props = {
  onCorrectRow: VoidFunction;
  onUpdateRow: VoidFunction;
  row: IPersonsItem;
};

export default function PersonTableRow({ row, onCorrectRow, onUpdateRow }: Props) {
  const {
    fullName,
    avatarUrl,
    employeeNumber,
    approvalStatus,
    department,
    position,
    firstName,
    lastName,
    workEmail,
  } = row;
  const { t } = useTranslate();
  const confirm = useBoolean();
  const popover = usePopover();
  const recordInfo = useBoolean();
  function getColorByStatus(status: any) {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DRAFT':
        return 'default';
      case 'WITHDRAWN':
        return 'info';
      case 'REJECTED':
        return 'error';
      case 'APPROVED':
        return 'success';
      default:
        return 'default';
    }
  }

  return (
    <>
      <TableRow hover>
        <TableCell
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={onCorrectRow}
        >
          <Avatar alt={firstName} src={`${IMAGE_BASE}/${avatarUrl}`} sx={{ mr: 2 }} />
          <Box>
            <ListItemText
              primary={`${firstName} ${lastName}`}
              primaryTypographyProps={{ typography: 'body2' }}
            />

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {workEmail}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>{employeeNumber}</TableCell>
        <TableCell>{/* {department} */}-</TableCell>
        <TableCell>{/* {position} */}-</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={getColorByStatus(approvalStatus)}>
            {/* {getLabelByStatus(approvalStatus)} */}
            {approvalStatus}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <RecordInfoDialog
        createdBy={row.createdByUserName}
        creationDate={row.createdDate}
        updateBy={row.updatedByUserName}
        updateDate={row.updatedDate}
        open={recordInfo.value}
        onClose={recordInfo.onFalse}
      />

      <CustomPopover
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 200 }}
      >
        {/* <MenuItem
          onClick={() => {
            onUpdateRow();
            popover.onClose();
          }}
        >
          <Iconify icon="material-symbols:add-circle-outline" />
          {t('Update')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onCorrectRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('Correct')}
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            recordInfo.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:info-circle-bold" />
          {t('Record Info')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
