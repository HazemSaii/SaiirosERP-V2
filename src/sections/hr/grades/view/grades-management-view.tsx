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
import { UseGetGrades, UseDeleteGrades } from 'src/actions/Hr/grades';

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

import GradesTableRow from '../Grades-table-row';

//-------------------------------------
const defaultFilters: any = {
  gradeName: '',
  approvalStatus: 'All',
};

//--------------------------------------

export default function GradesManagementView() {
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  // el api bta3 approval w lsa ma7atsh el api
  const { lookups: Grades_STATUS_OPTIONS, lookupsLoading: GradesSTATUSLoading } = useGetAllLookups(
    'APPROVAL_STATUS',
    currentLanguage
  );

  const STATUS_OPTIONS = [
    { valueCode: 'All', valueName: 'All', color: 'default' },
    ...Grades_STATUS_OPTIONS,
  ];
  const confirm = useBoolean();
  const { t } = useTranslate();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();

  const { Grades, GradesLoading } = UseGetGrades(currentLang.value);

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

  const canReset = filters.gradeName !== '' || filters.approvalStatus !== 'All';

  useEffect(() => {
    if (!GradesLoading) {
      setTableData(Grades || []);
    } else {
      setTableData([]);
    }
  }, [Grades, GradesLoading]);

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

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('approvalStatus', newValue);
    },
    [handleFilters]
  );

  const handleDeleteRow = useCallback(
    async (gradeId: string) => {
      try {
        setDeleteLoading(true);
        const deleteGrades = await UseDeleteGrades(gradeId);
        if (deleteGrades.status === 200) {
          setDeleteLoading(false);

          const deleteRow = tableData.filter((row) => row.gradeId.toString() !== gradeId);

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
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.gradeId.toString()));
    toast.success(t('Delete success!'));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);

  }, [dataFiltered.length, dataInPage.length, t, table, tableData]);

  const handleEditRow = useCallback(
    (gradeId: string) => {
      router.push(paths.hr.grades.edit(gradeId));
    },
    [router]
  );

  const TABLE_HEAD = [
    { id: 'gradeName', label: t('Grade Name'), width: 250 },
    { id: 'approvalStatus', label: t('Approval'), width: 150 },
    { id: 'active', label: t('Status'), width: 120 },
    { id: '', width: 10 },
  ];

  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);

  return (
    <Container >
      <CustomBreadcrumbs
        heading={t('Grades  Management')}
        links={[
          { name: t('Human Resources'), href: paths.hr.root },
          { name: t('Grades'), href: paths.hr.grades.management },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.hr.grades.new}
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
          {!GradesSTATUSLoading
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
                        : tableData.filter((user) => user.approvalStatus === tab.valueName).length}
                    </Label>
                  }
                />
              ))
            : []}
        </Tabs>

        <TableToolbar<any>
          filterValue="gradeName"
          value={filters.gradeName}
          filters={filters}
          onFilters={handleFilters}
        />
        {canReset && (
          <TableFiltersResult<any>
            Chipvalue={filters.gradeName}
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
                {GradesLoading && render_skelton}

                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <GradesTableRow
                      key={row.gradeId.toString()}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.gradeId.toString())}
                      deleteLoading={deleteLoading}
                      onEditRow={() => handleEditRow(row.gradeId)}
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
    </Container>
  );
}

//-------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: any;
  statusOptions: any[];
}) {
  const { gradeName, approvalStatus } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (gradeName) {
    inputData = inputData.filter(
      (g) => g.gradeName.toLowerCase().indexOf(gradeName.toLowerCase()) !== -1
    );
  }
  if (approvalStatus !== 'All') {
    inputData = inputData.filter((f) => f.approvalStatus === approvalStatus);
  }
  return inputData;
}
