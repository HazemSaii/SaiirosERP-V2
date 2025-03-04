import { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useTranslate } from 'src/locales';

import { Scrollbar } from 'src/components/scrollbar';
// import { useSnackbar } from 'src/components/snackbar';
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

import { IUserTableFilterValue } from 'src/types/user';
import { IRoleFunctionInfo, IRoleFunctionTableFilters } from 'src/types/role';

import RoleFunctionRow from './role-function-row';
// ----------------------------------------------------------------------

const defaultFilters: IRoleFunctionTableFilters = {
  functionName: '',
};
type Props = {
  currentRoleFunctions?: IRoleFunctionInfo[];
  operation: string;
  rolefunction: any;
  rolefunctionLoading: any;
};
export interface RoleFunctionsFormHandle {
  getSelectedRoleFunctions: () => IRoleFunctionInfo[];
}
// ----------------------------------------------------------------------
const RoleFunctions = forwardRef<RoleFunctionsFormHandle, Props>(
  ({ currentRoleFunctions, operation, rolefunction, rolefunctionLoading }, ref) => {
    const { t } = useTranslate();
    const [selectedIds, setSelectedIds] = useState<string[]>(() =>
      currentRoleFunctions
        ? currentRoleFunctions.map((roleFunction) => roleFunction.functionId)
        : []
    );
    const [accessTypes, setAccessTypes] = useState<{ [key: string]: number }>({});

    const table = useTable({
      defaultSelected: selectedIds,
    });
    const [tableData, setTableData] = useState<IRoleFunctionInfo[]>([]);
    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters,
    });

    const denseHeight = table.dense ? 56 : 56 + 20;
    const canReset = !(filters.functionName === defaultFilters.functionName);
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

    const handleAccessTypeChange = useCallback((functionId: string, accessType: number) => {
      setAccessTypes((prev) => ({ ...prev, [functionId]: accessType }));
    }, []);

    useImperativeHandle(ref, () => ({
      getSelectedRoleFunctions: () =>
        tableData
          .filter((roleFunction) => table.selected.includes(roleFunction.functionId))
          .map((roleFunction) => ({
            ...roleFunction,
            accessType: accessTypes[roleFunction.functionId] || 1,
          })),
    }));

    useEffect(() => {
      if (!rolefunctionLoading) {
        const cleanedRoleFunctions = rolefunction.map(
          ({ applicationCode, ...rest }: IRoleFunctionInfo) => rest
        );
        console.log(cleanedRoleFunctions);
        setTableData(cleanedRoleFunctions || []);
      } else {
        setTableData([]);
      }
    }, [rolefunctionLoading, rolefunction]);

    useEffect(() => {
      if (currentRoleFunctions?.length) {
        table.setSelected(currentRoleFunctions.map((roleFunction) => roleFunction.functionId));
        const initialAccessTypes = currentRoleFunctions.reduce(
          (acc, roleFunction) => ({
            ...acc,
            [roleFunction.functionId]: roleFunction.accessType || 1,
          }),
          {}
        );
        setAccessTypes(initialAccessTypes);
      }
    }, []);

    const TABLE_HEAD = [
      { id: '', label: '' },
      { id: 'functionName', label: t('Function Name') },
      { id: 'accessType', label: t('Access Type'), width: 180 },
    ];

    return (
      <Card>
        <TableToolbar<IRoleFunctionTableFilters>
          filterValue="functionName"
          value={filters.functionName}
          filters={filters}
          onFilters={handleFilters}
        />
        {canReset && (
          <TableFiltersResult<IRoleFunctionTableFilters>
            Chipvalue={filters.functionName}
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
                dataFiltered.map((row) => row.functionId)
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
                  ...dataFiltered.filter((row) => table.selected.includes(row.functionId)),
                  ...dataFiltered.filter((row) => !table.selected.includes(row.functionId)),
                ]
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <RoleFunctionRow
                      key={row.functionId}
                      row={row}
                      selected={table.selected.includes(row.functionId)}
                      onSelectRow={() => table.onSelectRow(row.functionId)}
                      onAccessTypeChange={handleAccessTypeChange}
                      currentAccessType={accessTypes[row.functionId] || 1} // Pass current access type
                    />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                {dataFiltered.length === 0 && !rolefunctionLoading && (
                  <TableNoData notFound={notFound} />
                )}
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

export default RoleFunctions;

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IRoleFunctionInfo[];
  comparator: (a: any, b: any) => number;
  filters: IRoleFunctionTableFilters;
}) {
  const { functionName } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (functionName) {
    inputData = inputData.filter(
      (roleFunction) =>
        roleFunction.functionName.toLowerCase().indexOf(functionName.toLowerCase()) !== -1
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
