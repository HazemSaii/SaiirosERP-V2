import { isEqual } from 'es-toolkit';
import { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { _roles } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { useGetRoles } from 'src/actions/security/role';
import { Scrollbar } from 'src/components/scrollbar';
import TableToolbar from 'src/components/table/table-toolbar-custom';
import TableFiltersResults from 'src/components/table/table-filters-results';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { IRoleItem, IRoleTableFilters, IRoleTableFilterValue } from 'src/types/role';
import { useLocales } from 'src/locales';
import UserRolesRow from './user-roles-row';

// ----------------------------------------------------------------------

const defaultFilters: IRoleTableFilters = {
  roleName: '',
  active: 'all',
};

type Props = {
  currentUserRoles?: IRoleItem[];
  operation: string;
};

export interface UserRolesFormHandle {
  getSelectedRoles: () => IRoleItem[];
}

const UserRols = forwardRef<UserRolesFormHandle, Props>(({ currentUserRoles, operation }, ref) => {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;

  const { roles, rolesLoading } = useGetRoles(currentLanguage);
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    currentUserRoles ? currentUserRoles.map((role) => role.roleId) : []
  );
  const table = useTable({
    defaultSelected: selectedIds,
  });
  const [tableData, setTableData] = useState<IRoleItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const handleFilters = useCallback(
    (name: string, value: IRoleTableFilterValue) => {
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
    getSelectedRoles: () =>
      tableData
        .filter((role) => table.selected.includes(role.id))
        .map((role) => ({
          ...role,
          roleId: role.id,
        })),
  }));
  useEffect(() => {
    if (!rolesLoading) {
      setTableData(roles || []);
    } else {
      setTableData([]);
    }
  }, [rolesLoading, roles]);
  useEffect(() => {
    if (currentUserRoles?.length) {
      table.setSelected(currentUserRoles.map((role) => role.roleId));
    }
  }, []);
  const TABLE_HEAD = [
    { id: '', label: '' },
    { id: 'role', label: t('Role') },
    // { id: 'start-date', label: t('Start Date'), width: 180 },
    // { id: 'end-date', label: t('End Date'), width: 220 },
  ];
  const render_skelton = [...Array(4)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <Card>
      <TableToolbar<IRoleTableFilters>
        filterValue="roleName"
        value={filters.roleName}
        filters={filters}
        onFilters={handleFilters}
      />
      {canReset && (
        <TableFiltersResults
          totalResults={dataFiltered.length}
          Chipvalue={filters.roleName}
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
              {rolesLoading && render_skelton}
              {[
                ...dataFiltered.filter((row) => table.selected.includes(row.id)),
                ...dataFiltered.filter((row) => !table.selected.includes(row.id)),
              ]
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <UserRolesRow
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
              {dataFiltered.length === 0 && !rolesLoading && <TableNoData notFound={notFound} />}
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
});

export default UserRols;

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IRoleItem[];
  comparator: (a: any, b: any) => number;
  filters: IRoleTableFilters;
}) {
  const { roleName } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (roleName) {
    inputData = inputData.filter(
      (role) => role.roleName.toLowerCase().indexOf(roleName.toLowerCase()) !== -1
    );
  }
  return inputData;
}
