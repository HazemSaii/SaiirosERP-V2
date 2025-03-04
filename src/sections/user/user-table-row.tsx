import type { IUserItem } from 'src/types/user';
import { useBoolean, usePopover } from 'minimal-shared/hooks';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { useTranslate } from 'src/locales';
import { Divider, ListItemText, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';
import ResetPasswordDialog from './reset-password-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: IUserItem;
  onDeleteRow: () => void;
  onEditRow: () => void;
  deleteLoading: boolean;
};

export default function UserTableRow({ row, onEditRow, onDeleteRow, deleteLoading }: Props) {
  const { userName, status, statusCode, userEmail } = row;
  const { t } = useTranslate();
  const confirm = useBoolean();
  const popover = usePopover();
  const recordInfo = useBoolean();
  const resetPassword = useBoolean();
  const renderMenuActions = () => (
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
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
            confirm.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" style={{ color: '#d94545' }} />
          {t('Delete')}
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            resetPassword.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:password-reset" />
          {t('Reset Password')}
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
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }} onClick={() => onEditRow()}>
          <Avatar alt={userName} sx={{ mr: 2 }} />
          <ListItemText primary={<Typography variant="body2">{userName}</Typography>} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{userEmail}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{userEmail}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (statusCode === 1 && 'success') ||
              (statusCode === 2 && 'warning') ||
              (statusCode === 3 && 'error') ||
              'default'
            }
          >
            {t(status)}
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

      <ResetPasswordDialog row={row} open={resetPassword.value} onClose={resetPassword.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('Delete')}
        content={t('Are you sure want to delete?')}
        action={
          <LoadingButton
            loading={deleteLoading}
            color="error"
            onClick={onDeleteRow}
            variant="contained"
          >
            {t('Delete')}
          </LoadingButton>
        }
      />
      {renderMenuActions()}
    </>
  );
}
