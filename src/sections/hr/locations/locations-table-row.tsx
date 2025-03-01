import type { ILocationsItem } from 'src/types/locations';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';
import { IMAGE_BASE } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';

type Props = {
  onEditRow: VoidFunction;
  row: ILocationsItem;
  onDeleteRow: VoidFunction;
  deleteLoading: boolean;
};

export default function LocationTableRow({ row, onEditRow, onDeleteRow, deleteLoading }: Props) {
  const {
    locationName,
    avatarUrl,
    countryName,
    approvalStatus,
    active,
    approvalStatusColor,
    activeColor,
  } = row;
  const { t } = useTranslate();
  const confirmDialog = useBoolean();
  const popover = usePopover();
  const recordInfo = useBoolean();
  const renderRecordInfoActions = () => (
    <RecordInfoDialog
      createdBy={row.createdByUserName}
      creationDate={row.createdDate}
      updateBy={row.updatedByUserName}
      updateDate={row.updatedDate}
      open={recordInfo.value}
      onClose={recordInfo.onFalse}
    />
  );
  const renderMenuActions = () => (
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
      sx={{ width: 200 }}
    >
      <MenuItem
        onClick={() => {
          onEditRow();
          popover.onClose();
        }}
      >
        <Iconify icon="solar:pen-bold" />
        {t('Edit')}
      </MenuItem>

      <MenuItem
        onClick={() => {
          confirmDialog.onTrue();
          popover.onClose();
        }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" style={{ color: '#d94545' }} />
        {t('Delete')}
      </MenuItem>
      <Divider />

      <MenuItem disabled={approvalStatus !== 'Pending'}>
        <Iconify icon="eva:arrow-back-outline" />
        {t('WITHDRAWN')}
      </MenuItem>

      <Divider />
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
  );
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );
  return (
    <>
      <TableRow hover>
        <TableCell
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} // Added cursor: 'pointer'
          onClick={() => {
            onEditRow();
          }}
        >
          <Avatar alt={locationName} src={`${IMAGE_BASE}/${avatarUrl}`} sx={{ mr: 2 }} />
          <ListItemText primary={locationName} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}> {countryName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={approvalStatusColor || 'default'}>
            {approvalStatus}
          </Label>
        </TableCell>

        <TableCell>
          <Label variant="soft" color={activeColor || 'default'}>
            {active}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderRecordInfoActions()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
