import type { IDelegationItem } from 'src/types/delegation';

import React from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';

type Props = {
  onEditRow: VoidFunction;
  row: IDelegationItem;
  onDeleteRow: VoidFunction;
  deleteLoading: boolean;
};

export default function DelegationsTableRow({ row, onEditRow, onDeleteRow, deleteLoading }: Props) {
  const {
    fromUserName,
    toUserName,
    dateFrom,
    dateTo,
    delegationScopeName,
    avatarUrl,
    activeName,
    active,
  } = row;
  const { t } = useTranslate();
  const confirm = useBoolean();
  const popover = usePopover();
  const recordInfo = useBoolean();

  return (
    <>
      <TableRow hover>
        <TableCell
          sx={{ display: 'flex', alignItems: 'center' }}
          onClick={() => {
            onEditRow();
          }}
        >
          <Avatar alt={fromUserName} sx={{ mr: 2 }} />
          <ListItemText primary={fromUserName} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{toUserName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {dateFrom ? dateFrom.split('T')[0] : ''}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{dateTo ? dateTo.split('T')[0] : ''}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{delegationScopeName}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(active === 1 && 'success') || (active === 0 && 'error') || 'default'}
          >
            {activeName}
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
    </>
  );
}
