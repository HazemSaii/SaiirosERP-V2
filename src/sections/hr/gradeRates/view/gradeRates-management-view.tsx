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
import { UseGetGradeRates, UseDeleteGradeRate } from 'src/actions/Hr/gradeRates';

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

import GradeRatesTableRow from '../gradeRates-table-row';

// ----------------------------------------------------------------------
const defaultFilters: any = {
  gradeRateName: '',
  approvalStatusDesc: 'All',
};

// ----------------------------------------------------------------------

export default function GradeRatesManagementView() {
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
  const { gradeRates, gradeRatesLoading } = UseGetGradeRates(currentLang.value);

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

  const canReset = filters.gradeRateName !== '' || filters.approvalStatusDesc !== 'All';
  useEffect(() => {
    if (!gradeRatesLoading) {
      setTableData(gradeRates || []);
    } else {
      setTableData([]);
    }
  }, [gradeRates, gradeRatesLoading]);

  const notFound = ((!dataFiltered.length && canReset) || !dataFiltered.length)&&!gradeRatesLoading;

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
    async (gradeRateId: string) => {
      try {
        setDeleteLoading(true);
        const deletegradeRate = await UseDeleteGradeRate(gradeRateId);
        if (deletegradeRate.status === 200) {
          setDeleteLoading(false);

          const deleteRow = tableData.filter((row) => row.gradeRateId.toString() !== gradeRateId);

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
      (row) => !table.selected.includes(row.gradeRateId.toString())
    );
    toast.success(t('Delete success!'));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);

  }, [dataFiltered.length, dataInPage.length, t, table, tableData]);

  const handleEditRow = useCallback(
    (gradeRateId: string) => {
      router.push(paths.hr.gradeRates.edit(gradeRateId));
    },
    [router]
  );

  const TABLE_HEAD = [
    { id: 'gradeRateName', label: t('Grade Rate Type'), width: 250 },
    { id: 'gradeRateUnit', label: t('Units'), width: 150 },
    { id: 'gradeRateType', label: t('Type'), width: 150 },
    { id: 'approvalStatusDesc', label: t('Approval'), width: 120 },
    { id: 'activeDesc', label: t('Status'), width: 120 },
    { id: '', width: 10 },
  ];

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('approvalStatusDesc', newValue);
    },
    [handleFilters]
  );
  const render_skelton = [...Array(2)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <>
      <Container >
        {/* custom first part */}
        <CustomBreadcrumbs
          heading={t('Grade Rates Management')}
          links={[
            { name: t('Human Resources'), href: paths.hr.root },
            { name: t('Grade Rates'), href: paths.hr.gradeRates.management },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.hr.gradeRates.new}
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
          <TableToolbar<any>
            filterValue="gradeRateName"
            value={filters.gradeRateName}
            filters={filters}
            onFilters={handleFilters}
            // roleOptions={_roles}
          />
          {canReset && (
            <TableFiltersResult<any>
              Chipvalue={filters.gradeRateName}
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
                  {gradeRatesLoading && render_skelton}

                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <GradeRatesTableRow
                        key={row.gradeRateId.toString()}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.gradeRateId.toString())}
                        deleteLoading={deleteLoading}
                        onEditRow={() => handleEditRow(row.gradeRateId)}
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
  filters: any;
  statusOptions: any[];
}) {
  const { gradeRateName, approvalStatusDesc } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (gradeRateName) {
    inputData = inputData.filter(
      (location) => location.gradeRateName.toLowerCase().indexOf(gradeRateName.toLowerCase()) !== -1
    );
  }
  if (approvalStatusDesc !== 'All') {
    inputData = inputData.filter((location) => location.approvalStatusDesc === approvalStatusDesc);
  }
  return inputData;
}
