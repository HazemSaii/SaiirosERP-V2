import React from 'react';
import dayjs from 'dayjs';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { Table, TableRow, TableBody, TableCell, TableContainer } from '@mui/material';

import { useTranslate } from 'src/locales';

import {Scrollbar} from 'src/components/scrollbar';
import { useTable, TableHeadCustom } from 'src/components/table';

type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  row: any[];
  title: string;
  TABLE_HEAD: any[];
  onRowClick: (dataRow: any) => void;
};

export default function HistoryDialog({
  row,
  open,
  title,
  onClose,
  TABLE_HEAD,
  onRowClick,
}: Props) {
  const { t } = useTranslate();
  const table = useTable();

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 150 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={row.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {row && row.length > 0 ? (
                  row.map((dataRow, index) => (
                    <TableRow
                      hover
                      key={index}
                      onClick={() => onRowClick(dataRow)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                      {dataRow.startDate ? dayjs(dataRow.startDate).format('YYYY-MM-DD') : ''}
                      </TableCell>
                      <TableCell>
                        {dataRow.endDate ? dayjs(dataRow.startDate).format('YYYY-MM-DD')  : ''}
                      </TableCell>{' '}
                      <TableCell>{dataRow.actionCode}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center">
                      {t('No data available')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('Close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
