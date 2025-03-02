import type {
  IOrganizationsItem,
  IOrganizationFilterValue,
  IOrganizationTableFilters,
} from 'src/types/organization';

import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

import { alpha, Container } from '@mui/system';
import { Tab, Card, Tabs, Table, Button, TableBody, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetOrganizations, UseDeleteOrganization } from 'src/actions/Hr/organizations';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import TableToolbar from 'src/components/table-toolbar';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';
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

import OrganizationTableRow from '../organizations-table-row';

// ----------------------------------------------------------------------
const defaultFilters: IOrganizationTableFilters = {
  organizationName: '',
  approvalStatusDesc: 'All',
};

// ----------------------------------------------------------------------

export default function OrganizationsManagementView() {
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const { lookups: Location_STATUS_OPTIONS, lookupsLoading: lOCATIONSTATUSLoading } =
    useGetAllLookups('APPROVAL_STATUS', currentLanguage);
  const STATUS_OPTIONS = [
    { valueCode: 'All', valueName: 'All', color: 'default' },
    ...Location_STATUS_OPTIONS,
  ];

  const confirm = useBoolean();
  const { t } = useTranslate();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const { organizations, organizationsLoading } = UseGetOrganizations(currentLang.value);

  const [tableData, setTableData] = useState<IOrganizationsItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    statusOptions: STATUS_OPTIONS,
  });
  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = filters.organizationName !== '' || filters.approvalStatusDesc !== 'All';
  useEffect(() => {
    if (!organizationsLoading) {
      setTableData(organizations || []);
    } else {
      setTableData([]);
    }
  }, [organizations, organizationsLoading]);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IOrganizationFilterValue) => {
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

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const handleDeleteRow = useCallback(
    async (organizationId: string) => {
      try {
        setDeleteLoading(true);
        const deletelocation = await UseDeleteOrganization(organizationId);
        if (deletelocation.status === 200) {
          setDeleteLoading(false);

          const deleteRow = tableData.filter(
            (row) => row.organizationId.toString() !== organizationId
          );

          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          toast.success(t('Delete success!'));

          confirm.onFalse();
        }
      } catch (error) {
        setDeleteLoading(false);
        toast.info(t('This record cannot be deleted'));

      }
    },
    [confirm, dataInPage.length, t, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.organizationId.toString())
    );
    toast.success(t('Delete success!'));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);

  }, [dataFiltered.length, dataInPage.length, t, table, tableData]);

  const handleEditRow = useCallback(
    (organizationId: string) => {
      router.push(paths.hr.organizations.edit(organizationId));
    },
    [router]
  );

  const TABLE_HEAD = [
    { id: 'organizationName', label: t('Organization Name'), width: 250 },
    { id: 'managerName', label: t('Manager'), width: 150 },
    { id: 'approvalStatusDesc', label: t('Approval'), width: 150 },
    { id: 'activeDesc', label: t('Status'), width: 120 },
    { id: '', width: 10 },
  ];

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('approvalStatusDesc', newValue);
    },
    [handleFilters]
  );
  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <>
      <Container >
        {/* custom first part */}
        <CustomBreadcrumbs
          heading={t('Organizations Management')}
          links={[
            { name: t('Human Resources'), href: paths.hr.root },
            { name: t('Organizations'), href: paths.hr.organizations.management },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.hr.organizations.new}
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
            value={filters.approvalStatusDesc}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {!lOCATIONSTATUSLoading || Location_STATUS_OPTIONS
              ? STATUS_OPTIONS.map((tab) => (
                  <Tab
                    key={tab.valueCode}
                    iconPosition="end"
                    value={tab.valueName}
                    label={t(tab.valueName)}
                    icon={
                      <Label
                        variant={
                          ((tab.valueName === 'All' ||
                            tab.valueName === filters.approvalStatusDesc) &&
                            'filled') ||
                          'soft'
                        }
                        color={tab.text1 || 'default'}
                      >
                        {tab.valueName === 'All'
                          ? tableData.length
                          : tableData.filter((user) => user.approvalStatusDesc === tab.valueName)
                              .length}
                      </Label>
                    }
                  />
                ))
              : []}
          </Tabs>

          {/* da bta3 el search and filter  */}
          <TableToolbar<IOrganizationTableFilters>
            filterValue="organizationName"
            value={filters.organizationName}
            filters={filters}
            onFilters={handleFilters}
            // roleOptions={_roles}
          />
          {canReset && (
            <TableFiltersResult<IOrganizationTableFilters>
              Chipvalue={filters.organizationName}
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
                  {organizationsLoading && render_skelton}

                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrganizationTableRow
                        key={row.organizationId.toString()}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.organizationId.toString())}
                        deleteLoading={deleteLoading}
                        onEditRow={() => handleEditRow(row.organizationId)}
                      />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  {dataFiltered.length === 0 && <TableNoData notFound={notFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* dense */}
          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  statusOptions,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: IOrganizationTableFilters;
  statusOptions: any[];
}) {
  const { organizationName, approvalStatusDesc } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (organizationName) {
    inputData = inputData.filter(
      (location) =>
        location.organizationName.toLowerCase().indexOf(organizationName.toLowerCase()) !== -1
    );
  }
  if (approvalStatusDesc !== 'All') {
    inputData = inputData.filter((location) => location.approvalStatusDesc === approvalStatusDesc);
  }
  return inputData;
}
