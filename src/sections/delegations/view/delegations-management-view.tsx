import type {
  IDelegationItem,
  IDelegationTableFilters,
  IDelegationTableFilterValue,
} from 'src/types/delegation';
import { useState, useEffect, useCallback } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { useGetDelegations, UseDeleteDelegation } from 'src/actions/security/delegation';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import TableToolbar from 'src/components/table-toolbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import TableFiltersResult from 'src/components/table-filters-result';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import DelegationsTableRow from '../delegations-table-row';

// Default filters
const defaultFilters: IDelegationTableFilters = {
  fromUserName: '',
  activeName: 'All',
};

export default function DelegationsManagementView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const table = useTable();

  const { lookups: USER_STATUS_OPTIONS, lookupsLoading: USER_STATUSLoading } = useGetAllLookups(
    'ACTIVE',
    currentLanguage
  );

  const STATUS_OPTIONS = [
    { valueCode: 'All', valueName: 'All', color: 'default' },
    ...USER_STATUS_OPTIONS,
  ];

  const { delegations, delegationsLoading } = useGetDelegations(currentLanguage);

  const [tableData, setTableData] = useState<any[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!delegationsLoading) {
      setTableData(delegations || []);
    } else {
      setTableData([]);
    }
  }, [delegations, delegationsLoading]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = filters.fromUserName !== '' || filters.activeName !== 'All';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IDelegationTableFilterValue) => {
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

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        setDeleteLoading(true);
        const deleteddelegation = await UseDeleteDelegation(id);
        if (deleteddelegation.status === 200) {
          setDeleteLoading(false);
          toast.success(t('Delete success!'));
          const deleteRow = tableData.filter((row) => row.id.toString() !== id);
          setTableData(deleteRow);
          table.onUpdatePageDeleteRow(dataInPage.length);
        }
      } catch (error) {
        setDeleteLoading(false);
        toast.error(t('This record cannot be deleted'));
      }
    },
    [dataInPage.length, t, table, tableData]
  );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row.id.toString()));
  //   toast.success(t('Delete success!'));
  //   setTableData(deleteRows);
  //   table.onUpdatePageDeleteRows({
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, t, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.security.delegations.edit(id));
    },
    [router]
  );

  const TABLE_HEAD = [
    { id: 'fromUser', label: t('From User') },
    { id: 'toUser', label: t('To User') },
    { id: 'dateFrom', label: t('Date From') },
    { id: 'dateTo', label: t('Date To') },
    { id: 'delegationScopeName', label: t('Scope') },
    { id: 'activeName', label: t('Active') },
    { id: '', width: 88 },
  ];

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('activeName', newValue);
    },
    [handleFilters]
  );

  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Delegations Management')}
          links={[
            { name: t('security'), href: paths.security.root },
            { name: t('Delegations'), href: paths.security.delegations.root },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.security.delegations.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('New')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.activeName}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {!USER_STATUSLoading
              ? STATUS_OPTIONS.map((tab) => (
                  <Tab
                    key={tab.valueName}
                    iconPosition="end"
                    value={tab.valueName}
                    label={t(tab.valueName)}
                    icon={
                      <Label
                        variant={
                          ((tab.valueName === 'All' || tab.valueName === filters.activeName) &&
                            'filled') ||
                          'soft'
                        }
                        color={
                          (tab.valueCode === '1' && 'success') ||
                          (tab.valueCode === '2' && 'warning') ||
                          (tab.valueCode === '3' && 'error') ||
                          'default'
                        }
                      >
                        {tab.valueName === 'All'
                          ? tableData.length
                          : tableData.filter((user) => user.activeName === tab.valueName).length}
                      </Label>
                    }
                  />
                ))
              : []}
          </Tabs>

          <TableToolbar<IDelegationTableFilters>
            filterValue="fromUserName"
            value={filters.fromUserName}
            filters={filters}
            onFilters={handleFilters}
          />

          {canReset && (
            <TableFiltersResult<IDelegationTableFilters>
              Chipvalue={filters.fromUserName}
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                  {delegationsLoading && render_skelton}
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <DelegationsTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id.toString())}
                        onEditRow={() => handleEditRow(row.id.toString())}
                        deleteLoading={deleteLoading}
                      />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  {dataFiltered.length === 0 && !delegationsLoading && (
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
      </Container>
    </DashboardContent>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IDelegationItem[];
  comparator: (a: any, b: any) => number;
  filters: IDelegationTableFilters;
}) {
  const { fromUserName, activeName } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (fromUserName) {
    inputData = inputData.filter(
      (delegation) =>
        delegation.fromUserName.toLowerCase().indexOf(fromUserName.toLowerCase()) !== -1
    );
  }
  if (activeName !== 'All') {
    inputData = inputData.filter((f) => f.activeName === activeName);
  }
  return inputData;
}
