import { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useTranslate } from 'src/locales';

import { Scrollbar } from 'src/components/scrollbar';
import TableToolbar from 'src/components/table-toolbar';
import TableFiltersResult from 'src/components/table-filters-result';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { IUserItem, IUserTableFilters, IUserTableFilterValue } from 'src/types/user';

import RoleUsersRow from './role-user-row';
// ----------------------------------------------------------------------

const defaultFilters: IUserTableFilters = {
  userName: '',
  userEmail: '',
  status: 'all',
};

type Props = {
  currentRoleUsers?: IUserItem[];
  operation: string;
  users: any;
  usersLoading: any;
};

export interface RoleUsersFormHandle {
  getSelectedUsers: () => IUserItem[];
  getUnSelectedUsers: () => IUserItem[];
}
// ----------------------------------------------------------------------
const RoleUsers = forwardRef<RoleUsersFormHandle, Props>(
  ({ currentRoleUsers, operation, users, usersLoading }, ref) => {
    const { t } = useTranslate();
    const [selectedIds, setSelectedIds] = useState<string[]>(() =>
      currentRoleUsers ? currentRoleUsers.map((user) => user.userId) : []
    );
    const table = useTable({
      defaultSelected: selectedIds,
      defaultOrderBy: 'startDate',
      defaultDense: true,
    });
    const [tableData, setTableData] = useState<IUserItem[]>([]);
    const [filters, setFilters] = useState(defaultFilters);
    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters,
    });
    const denseHeight = table.dense ? 56 : 56 + 20;
    const canReset = !(
      filters.userName === defaultFilters.userName &&
      filters.userEmail === defaultFilters.userEmail &&
      filters.status === defaultFilters.status
    );
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
    const handleFilters = useCallback(
      (name: string, value: IUserTableFilterValue) => {
        table.onResetPage();
        setFilters((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      },
      [table]
    );
    const handleResetFilters = useCallback(() => {
      setFilters(defaultFilters);
    }, []);
    useImperativeHandle(ref, () => ({
      getSelectedUsers: () =>
        tableData
          .filter((user) => table.selected.includes(user.id))
          .map((user) => ({
            ...user,
            userId: user.id,
          })),
      getUnSelectedUsers: () =>
        tableData
          .filter((user) => !table.selected.includes(user.id))
          .map((user) => ({
            ...user,
            userId: user.id,
          })),
    }));
    useEffect(() => {
      if (!usersLoading) {
        setTableData(users || []);
      } else {
        setTableData([]);
      }
    }, [usersLoading, users]);
    useEffect(() => {
      if (currentRoleUsers?.length) {
        table.setSelected(currentRoleUsers.map((user) => user.userId));
      }
    }, []);
    const TABLE_HEAD = [
      { id: '', label: '' },
      { id: 'username', label: t('Username') },
      // { id: 'startDate', label: t('Start Date') },
      // { id: 'endDate', label: t('End Date') },
      // { id: 'autProvision', label: t('Auto Provision'), width: 180 },
    ];

    return (
      <Card>
        <TableToolbar<IUserTableFilters>
          filterValue="userName"
          value={filters.userName}
          filters={filters}
          onFilters={handleFilters}
        />
        {canReset && (
          <TableFiltersResult<IUserTableFilters>
            Chipvalue={filters.userName}
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {[
                  ...dataFiltered.filter((row) => table.selected.includes(row.id)),
                  ...dataFiltered.filter((row) => !table.selected.includes(row.id)),
                ]
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <RoleUsersRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      operation={operation}
                    />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                {dataFiltered.length === 0 && !usersLoading && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    );
  }
);
export default RoleUsers;

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUserItem[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { userName } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (userName) {
    inputData = inputData.filter(
      (user) => user.userName.toLowerCase().indexOf(userName.toLowerCase()) !== -1
    );
  }
  // if (status !== 'all') {
  //   inputData = inputData.filter((user) => user.status === status);
  // }
  // if (role.length) {
  //   inputData = inputData.filter((user) => role.includes(user.role));
  // }
  return inputData;
}
