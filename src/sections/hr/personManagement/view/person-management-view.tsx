import type { IPersonsItem, IPersonsFilterValue, IPersonsTableFilters } from 'src/types/persons';

import { useState, useEffect, useCallback } from "react";

import { alpha, Container } from "@mui/system";
import { Tab, Card, Tabs, Table, Button, TableBody, TableContainer } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from 'src/routes/components';

import { UseGetPersons } from "src/actions/Hr/person";
import { useLocales, useTranslate } from "src/locales";
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetOrganizations } from 'src/actions/Hr/organizations';

import {Label} from "src/components/label";
import {Iconify} from 'src/components/iconify';
import {Scrollbar} from "src/components/scrollbar";
import TableToolbar from "src/components/table-toolbar";
import { useSettingsContext } from "src/components/settings";
import {CustomBreadcrumbs} from "src/components/custom-breadcrumbs";
import { useTable, emptyRows, TableNoData, getComparator, TableSkeleton, TableEmptyRows, TableHeadCustom, TablePaginationCustom } from "src/components/table";

import PersonTableRow from '../person-table-row';
import PersonTableToolbar from '../person-table-toolbar';


// ----------------------------------------------------------------------
const defaultFilters: IPersonsTableFilters = {
  fullName:'',
  firstName:[],
  approvalStatus: 'All',

};


// ----------------------------------------------------------------------

export default function PersonManagementView() {
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const { lookups: Location_STATUS_OPTIONS, lookupsLoading: lOCATIONSTATUSLoading } = useGetAllLookups(
    'APPROVAL_STATUS',
    currentLanguage
  );
  const{organizations,organizationsLoading}=UseGetOrganizations(currentLanguage)
   const STATUS_OPTIONS = [{ valueCode: 'All', valueName: 'All',color:"default" }, ...Location_STATUS_OPTIONS];
  const { t } = useTranslate();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const { persons, personsLoading } = UseGetPersons(currentLang.value);

  const [tableData, setTableData] = useState<IPersonsItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    statusOptions: STATUS_OPTIONS, 

  });
  const denseHeight = table.dense ? 56 : 56 + 20;
  
  const canReset = filters.fullName !== '' || filters.approvalStatus !== 'All';
  useEffect(() => {
    if (!personsLoading) {
      setTableData(persons || []);
    } else {
      setTableData([]);
    }
  }, [persons, personsLoading]);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IPersonsFilterValue) => {
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


  const handleCorrectRow = useCallback(
    (personId: string) => {
      
      router.push(paths.hr.personManagement.correct(personId));
    },
    [router]
  );
  
  const handleUpdateRow = useCallback(
    (personId: string) => {
      router.push(paths.hr.personManagement.update(personId));
    },
    [router]
  );
  
   const FirstName_OPTIONS = [
     { value: 'Department 1', label: 'Department 1' },
    { value: 'Department 2', label: 'Department 2' },
    { value: 'Department 3', label: 'Department 3' },
  ];
  const TABLE_HEAD = [
    { id: 'fullName', label: t('Name'),width: 350 },
    { id: 'employeeNumber', label: t('Employee Number'),width: 250 },
    { id: 'depatment', label: t('Department'), width: 250 },
    { id: 'position', label: t('Position'),width: 250 },
    { id: 'active', label: t('status'),width: 250 },
    { id: '', width: 10 },
  ];
  
  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('approvalStatus', newValue);
    },
    [handleFilters]
  );
  const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />)

  return (
    <Container >
        {/* custom first part */}
        <CustomBreadcrumbs
          heading={t('Person Management')}
          links={[
            { name: t('Human Resources'), href: paths.hr.root},
            { name: t('Person Management'), href: paths.hr.personManagement.management },
          ]}
        
          action={
            <Button
              component={RouterLink}
              href={paths.hr.personManagement.new}
              variant="contained"
              startIcon={<Iconify icon="ic:baseline-person-add" width={24} height={24}  />}
            >
              {t('Hire')}
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
{!lOCATIONSTATUSLoading||Location_STATUS_OPTIONS?STATUS_OPTIONS.map((tab) => (
    <Tab
      key={tab.valueCode}
      iconPosition="end"
      value={tab.valueCode}
      label={t(tab.valueName)}
      icon={
        <Label
          variant={
            ((tab.valueName === 'All' || tab.valueCode === filters.approvalStatus) && 'filled') ||
            'soft'
          }
  color={
    (tab.valueCode === "PENDING" && 'warning') ||
    (tab.valueCode === "APPROVED" && 'success') ||
                 (tab.valueCode === "WITHDRAWN" && 'info') ||
                      (tab.valueCode === "PENDING" && 'warning') ||
                      (tab.valueCode === "REJECTED" && 'error') ||
                      'default'
                    }
        >
{tab.valueName === 'All'
                        ? tableData.length
                        : tableData.filter((user) => user.approvalStatus === tab.valueCode).length}
                    </Label>
                  }
                />
  )):[]}
</Tabs>
<div style={{ display: 'flex', alignItems: 'center' }}>
  <div style={{ flex: 0.2}}/>

  <div style={{ flex: 2}}>
  {!organizationsLoading && organizations && (
  <PersonTableToolbar
    filters={filters}
    onFilters={handleFilters}
    firstNameOptions={organizations}
  />
)}

  </div>

  <div style={{ flex: 10}}>
    <TableToolbar<IPersonsTableFilters>
      filterValue="fullName"
      value={filters.fullName}
      filters={filters}
      onFilters={handleFilters}
    />
  </div>
</div>


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
                {personsLoading && render_skelton}
  {dataFiltered
    .slice(
      table.page * table.rowsPerPage,
      table.page * table.rowsPerPage + table.rowsPerPage
    )
        .map((row) => (
              <PersonTableRow
                key={row.personId}
                row={row}
                onUpdateRow={() => handleUpdateRow(row.personId)}
                onCorrectRow={() => handleCorrectRow(row.personId)}
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

      </Container>
      
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
  filters: IPersonsTableFilters;
  statusOptions: any[];
}) {
  const { fullName, approvalStatus, firstName } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (fullName) {
    inputData = inputData.filter(
      (location) =>
        location.fullName.toLowerCase().indexOf(fullName.toLowerCase()) !== -1
    );
  }
  if (approvalStatus !== 'All') {
    inputData = inputData.filter((location) => location.approvalStatus === approvalStatus);
  }
  if (firstName?.length) {
    inputData = inputData.filter((p) => firstName.includes(p.firstName));
  }
  return inputData;
}
