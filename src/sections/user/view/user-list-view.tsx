import type { IUserItem, IUserTableFilters } from 'src/types/user';
import { useState, useEffect, useCallback } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'minimal-shared/utils';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUsers, useDeleteUser } from 'src/actions/security/user';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useGetAllLookups } from 'src/actions/shared/shared';
import UserTableRow from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { RouterLink } from 'src/routes/components/router-link';
// ----------------------------------------------------------------------

export function UserListView() {
  const { t } = useTranslate();
  const router = useRouter();
  const table = useTable();
  const { users, usersLoading } = useGetUsers();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tableData, setTableData] = useState<IUserItem[]>([]);
  const confirmDialog = useBoolean();
  const defaultFilters: IUserTableFilters = {
    userName: '',
    status: 'All',
  };

  const filters = useSetState<IUserTableFilters>(defaultFilters);
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [table, updateFilters]
  );

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });
  const { currentLang } = useLocales();
  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;

  // Add this to get status options from API
  const { lookups: USER_STATUS_OPTIONS, lookupsLoading: USER_STATUSLoading } = useGetAllLookups(
    'USER_STATUS',
    currentLanguage
  );

  const STATUS_OPTIONS = [
    { valueCode: 'All', valueName: 'All', color: 'default' },
    ...USER_STATUS_OPTIONS,
  ];
  const TABLE_HEAD = [
    { id: 'userName', label: t('Username') },
    { id: 'userEmail', label: t('Email'), width: 180 },
    { id: 'supplier', label: t('Name'), width: 220 },
    { id: 'status', label: t('Status'), width: 220 },
    { id: '', width: 88 },
  ];
  // ----------------------------------------------------------------------
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = !!currentFilters.userName || currentFilters.status !== 'All';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  // Add useEffect to load users data
  useEffect(() => {
    if (!usersLoading) {
      setTableData(users || []);
    } else {
      setTableData([]);
    }
  }, [usersLoading, users]);

  // Update handleDeleteRow to use API
  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        setDeleteLoading(true);
        const deletedUser = await useDeleteUser(id);
        if (deletedUser.status === 200) {
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
      router.push(paths.security.users.edit(id));
    },
    [router]
  );
  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('User Management')}
          links={[
            { name: t('Security'), href: paths.security.root },
            { name: t('Users'), href: paths.security.users.management },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.security.users.new}
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
                    key={tab.valueName}
                    iconPosition="end"
                    value={tab.valueName}
                    label={t(tab.valueName)}
                    icon={
                      <Label
                        variant={
                          ((tab.valueName === 'All' || tab.valueName === currentFilters.status) &&
                            'filled') ||
                          'soft'
                        }
                        color={tab.text1 || 'default'}
                      >
                        {tab.valueName === 'All'
                          ? tableData.length
                          : tableData.filter((user) => user.status === tab.valueName).length}
                      </Label>
                    }
                  />
                ))
              : []}
          </Tabs>
          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: [] }}
          />
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
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
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
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
                  {usersLoading && render_skelton}
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        deleteLoading={deleteLoading}
                      />
                    ))}
                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IUserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { userName, status } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (userName) {
    inputData = inputData.filter((user) =>
      user.userName.toLowerCase().includes(userName.toLowerCase())
    );
  }

  if (status !== 'All') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
