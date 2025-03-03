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
import { UseGetJobFamilies, UseDeleteJobFamilies } from 'src/actions/Hr/jobFamily';

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
  TableSkeleton,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import JobFamiliesTableRow from '../jobFamilies-table-row';

// ----------------------------------------------------------------------
const defaultFilters: any = {
  jobFamilyName: '',
  approvalStatus: 'All',
};

// ----------------------------------------------------------------------

export default function JobFamiliesManagementView() {
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const { lookups: JobFamily_STATUS_OPTIONS, lookupsLoading: JobFamilySTATUSLoading } =
    useGetAllLookups('APPROVAL_STATUS', currentLanguage);
  const STATUS_OPTIONS = [
    { valueCode: 'All', valueName: 'All', color: 'default' },
    ...JobFamily_STATUS_OPTIONS,
  ];
  const confirm = useBoolean();
  const { t } = useTranslate();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();

  const { jobFamilies, jobFamiliesLoading } = UseGetJobFamilies(currentLang.value);

  const [tableData, setTableData] = useState<any[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    statusOptions: STATUS_OPTIONS,
  });
  const denseHeight = table.dense ? 56 : 56 + 20;

  // const canReset = !isEqual(defaultFilters, filters);
  const canReset = filters.jobFamilyName !== '' || filters.approvalStatus !== 'All';

  useEffect(() => {
    if (!jobFamiliesLoading) {
      setTableData(jobFamilies || []);
    } else {
      setTableData([]);
    }
  }, [jobFamilies, jobFamiliesLoading]);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: any) => {
      table.onResetPage();
      setFilters((prevState: any) => ({
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
    async (jobFamilyId: string) => {
      try {
        setDeleteLoading(true);
        const deletelocation = await UseDeleteJobFamilies(jobFamilyId);
        if (deletelocation.status === 200) {
          setDeleteLoading(false);

          const deleteRow = tableData.filter((row) => row.jobFamilyId.toString() !== jobFamilyId);

          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          toast.success(t('Delete success!'));

          confirm.onFalse();
        }
      } catch (error:any) {
        setDeleteLoading(false);
        toast.success(t('This record cannot be deleted'));
      }
    },
    [confirm, dataInPage.length, t, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.jobFamilyId.toString())
    );
    toast.success(t('Delete success!'));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);

  }, [dataFiltered.length, dataInPage.length, t, table, tableData]);

  const handleEditRow = useCallback(
    (jobFamilyId: string) => {
      router.push(paths.hr.jobFamilies.edit(jobFamilyId));
    },
    [router]
  );

  const TABLE_HEAD = [
    { id: 'jobFamilyName', label: t('Job Family Name'), width: 250 },
    { id: 'approvalStatus', label: t('Approval'), width: 150 },
    { id: 'active', label: t('Status'), width: 120 },
    { id: '', width: 10 },
  ];

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('approvalStatus', newValue);
    },
    [handleFilters]
  );
  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <>
      <Container maxWidth='lg'>
        {/* custom first part */}
        <CustomBreadcrumbs
          heading={t('Job Families Management')}
          links={[
            { name: t('Human Resources'), href: paths.hr.root },
            { name: t('Job Families'), href: paths.hr.jobFamilies.management },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.hr.jobFamilies.new}
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
            value={filters.approvalStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {!JobFamilySTATUSLoading
              ? STATUS_OPTIONS.map((tab) => (
                  <Tab
                    key={tab.valueName}
                    iconPosition="end"
                    value={tab.valueName}
                    label={t(tab.valueName)}
                    icon={
                      <Label
                        variant={
                          ((tab.valueName === 'All' || tab.valueName === filters.approvalStatus) &&
                            'filled') ||
                          'soft'
                        }
                        color={tab.text1 || 'default'}
                      >
                        {tab.valueName === 'All'
                          ? tableData.length
                          : tableData.filter((user) => user.approvalStatus === tab.valueName)
                              .length}
                      </Label>
                    }
                  />
                ))
              : []}
          </Tabs>

          {/* da bta3 el search and filter  */}
          <TableToolbar<any>
            filterValue="jobFamilyName"
            value={filters.jobFamilyName}
            filters={filters}
            onFilters={handleFilters}
          />
          {canReset && (
            <TableFiltersResult<any>
              Chipvalue={filters.jobFamilyName}
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
                  {jobFamiliesLoading&&!jobFamilies && render_skelton}

                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <JobFamiliesTableRow
                        key={row.jobFamilyId.toString()}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.jobFamilyId.toString())}
                        deleteLoading={deleteLoading}
                        onEditRow={() => handleEditRow(row.jobFamilyId)}
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
  filters: any;
  statusOptions: any[];
}) {
  const { jobFamilyName, approvalStatus } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (jobFamilyName) {
    inputData = inputData.filter(
      (f) => f.jobFamilyName.toLowerCase().indexOf(jobFamilyName.toLowerCase()) !== -1
    );
  }
  if (approvalStatus !== 'All') {
    inputData = inputData.filter((f) => f.approvalStatus === approvalStatus);
  }
  return inputData;
}
