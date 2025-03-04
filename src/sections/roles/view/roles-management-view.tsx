import type { IRoleItem, IRoleTableFilters, IRoleTableFilterValue } from 'src/types/role';

import { varAlpha } from 'minimal-shared/utils';
import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Tab, Tabs } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useLocales, useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { useGetRoles, UseDeleteRole } from 'src/actions/security/role';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import TableToolbar from 'src/components/table-toolbar';
import { useSettingsContext } from 'src/components/settings';
import TableFiltersResult from 'src/components/table-filters-result';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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

import RolesTableRow from 'src/sections/roles/roles-table-row';

// ----------------------------------------------------------------------
const defaultFilters: IRoleTableFilters = {
  roleName: '',
  status: 'All',
};

// ----------------------------------------------------------------------

export default function RolesManagementView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;

  const { lookups: USER_STATUS_OPTIONS, lookupsLoading: USER_STATUSLoading } = useGetAllLookups(
    'ACTIVE',
    currentLanguage
  );
  const STATUS_OPTIONS = [
    { valueCode: 'All', valueName: 'All', color: 'default' },
    ...USER_STATUS_OPTIONS,
  ];
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { roles, rolesLoading } = useGetRoles(currentLanguage);
  const [tableData, setTableData] = useState<IRoleItem[]>([]);
  const [deleteLoaing, setDeleteLoading] = useState(false);
  const filters = useSetState<IRoleTableFilters>(defaultFilters);
  const { state: currentFilters, setState: updateFilters } = filters;
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  useEffect(() => {
    if (!rolesLoading) {
      setTableData(roles || []);
    } else {
      setTableData([]);
    }
  }, [rolesLoading, roles]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !!currentFilters.roleName || currentFilters.status !== 'All';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  // Updated handleFilters to use updateFilters from useSetState
  const handleFilters = useCallback(
    (name: string, value: IRoleTableFilterValue) => {
      table.onResetPage();
      updateFilters({ [name]: value });
    },
    [table, updateFilters]
  );

  const handleResetFilters = useCallback(() => {
    updateFilters(defaultFilters);
  }, [updateFilters]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [table, updateFilters]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        setDeleteLoading(true);
        const deletedRole = await UseDeleteRole(id);
        if (deletedRole.status === 200) {
          setDeleteLoading(false);
          toast.success(t('Delete success!'));
          const deleteRow = tableData.filter((row) => row.id !== id);
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
  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.security.roles.edit(id));
    },
    [router]
  );

  const TABLE_HEAD = [
    { id: 'roleName', label: t('Rolename') },
    { id: 'applicationCode', label: t('Application'), width: 180 },
    { id: 'startDate', label: t('Start Date'), width: 220 },
    { id: 'endDate', label: t('End Date'), width: 100 },
    { id: 'status', label: t('Status'), width: 100 },
    { id: '', width: 88 },
  ];

  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <DashboardContent>
        <Container>
          {/* custom first part */}
          <CustomBreadcrumbs
            heading={t('Role Management')}
            links={[
              { name: t('Security'), href: paths.security.root },
              { name: t('Roles'), href: paths.security.roles.root },
            ]}
            action={
              <Button
                component={RouterLink}
                href={paths.security.roles.create}
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
              value={currentFilters.status}
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
                      key={tab.valueCode}
                      iconPosition="end"
                      value={tab.valueCode}
                      label={t(tab.valueName)}
                      icon={
                        <Label
                          variant={
                            ((tab.valueName === 'All' || tab.valueName === currentFilters.status) &&
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
                            : tableData.filter((user) => String(user.status) === tab.valueCode)
                                .length}
                        </Label>
                      }
                    />
                  ))
                : []}
            </Tabs>

            {/* Table toolbar for search and filter */}
            <TableToolbar<IRoleTableFilters>
              filterValue="roleName"
              value={currentFilters.roleName}
              filters={currentFilters}
              onFilters={handleFilters}
            />

            {canReset && (
              <TableFiltersResult<IRoleTableFilters>
                Chipvalue={currentFilters.roleName}
                filters={currentFilters}
                onFilters={handleFilters}
                onResetFilters={handleResetFilters}
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}
            <Box sx={{ position: 'relative' }}>
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
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
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
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <RolesTableRow
                          key={row.id}
                          row={row}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          deleteLoading={deleteLoaing}
                        />
                      ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />
                    {dataFiltered.length === 0 && !rolesLoading && (
                      <TableNoData notFound={notFound} />
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </Box>

            {/* Pagination */}
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
  const { roleName, status } = filters;
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
  if (status !== 'All') {
    inputData = inputData.filter((f) => String(f.status) === String(status));
  }
  return inputData;
}
