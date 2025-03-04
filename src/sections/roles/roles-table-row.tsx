import MenuList from '@mui/material/MenuList';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { useBoolean, usePopover } from 'minimal-shared/hooks';
import { Divider, ListItemText, Typography } from '@mui/material';
import { Label } from 'src/components/label';
import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';
import { IRoleItem } from 'src/types/role';

type Props = {
  onEditRow: VoidFunction;
  row: IRoleItem;
  onDeleteRow: VoidFunction;
  deleteLoading: boolean;
};

export default function RolesTableRow({ row, onEditRow, onDeleteRow, deleteLoading }: Props) {
  const { roleName, statusCode, applicationCode, startDate, endDate, status } = row;
  const { t } = useTranslate();
  const confirm = useBoolean();
  const popover = usePopover();
  const recordInfo = useBoolean();

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
          <Avatar alt={roleName} sx={{ mr: 2 }} />
          <ListItemText primary={<Typography variant="body2">{roleName}</Typography>} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{applicationCode}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{startDate ? startDate.toString() : ''}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{endDate ? endDate.toString() : ''}</TableCell>

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
        createdBy={row.updatedByUserName}
        creationDate={row.createdDate}
        updateBy={row.updatedByUserName}
        updateDate={row.updatedDate}
        open={recordInfo.value}
        onClose={recordInfo.onFalse}
      />

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
