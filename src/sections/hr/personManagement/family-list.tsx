import type { IFamilyInfo, IPersonsTableFilters } from 'src/types/persons';

import { z } from 'zod';
import { t } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { Grid, Card, Table, Button, TableBody, TableContainer } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';
import { UseGetpersonfamily } from 'src/actions/Hr/family';

import {Scrollbar} from 'src/components/scrollbar';
import { schemaHelper } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import FamilyDialog from './family-dialog';
import Familytablerow from './family-table-row';

const defaultFilters: IPersonsTableFilters = {
  fullName: '',
  approvalStatus: 'All',
};

type Props = {
  currentFamily?: IFamilyInfo[];
  PersonalLoading?: any;
  MARITAL_STATUSTypesLoading?: any;
  GENDERTypesLoading?: any;
  RELIGIONTypesLoading?: any;
  countriesLoading?: any;
  RELATIONSHIP_TYPELoading?: any;
  EDUCATION_LEVELLoading?: any;
  MARITAL_STATUSTypes?: any;
  RELATIONSHIP_TYPE?: any;
  GENDERTypes?: any;
  RELIGIONTypes?: any;
  countries?: any;
  EDUCATION_LEVEL?: any;
  isNotChanged?: any;
  personfamilyLoading?: any;
  parentPersonId: any;
  operation: string;
  submit: any;
};

export interface FamilyListNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}
const FamilyList = forwardRef<FamilyListNewEditFormHandle, Props>(
  (
    {
      currentFamily,
      PersonalLoading,
      operation,
      MARITAL_STATUSTypesLoading,
      GENDERTypesLoading,
      RELIGIONTypesLoading,
      countriesLoading,
      RELATIONSHIP_TYPELoading,
      EDUCATION_LEVELLoading,
      MARITAL_STATUSTypes,
      GENDERTypes,
      RELIGIONTypes,
      countries,
      RELATIONSHIP_TYPE,
      EDUCATION_LEVEL,
      parentPersonId,
      isNotChanged,
      submit,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    const router = useRouter();
    const {
      personfamily,
      personfamilyValidating,
      personfamilyLoading,
      refetch: refetchpersonfamily,
    } = UseGetpersonfamily(parentPersonId);
    const table = useTable();
    const settings = useSettingsContext();
    const isEdit = operation === 'edit';
    const iscreate = operation === 'create';
    const [openDialog, setOpenDialog] = useState(null); // Track which dialog is open

    const [tableData, setTableData] = useState<IFamilyInfo[]>([]);
    const [filters, setFilters] = useState();
   
    const handleOpenDialog = (label: any) => setOpenDialog(label);
    const handleCloseDialog = () => {
      setOpenDialog(null);
      refetchpersonfamily(); // Fetch latest data after dialog is closed
    };
        const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
    });
    const denseHeight = table.dense ? 56 : 56 + 20;

    useEffect(() => {
      if (!personfamilyLoading) {
        setTableData(personfamily || []);
      } else {
        setTableData([]);
      }
    }, [personfamily, personfamilyLoading]);

    const notFound = !dataFiltered.length || !dataFiltered.length;

    const TABLE_HEAD = [
      { id: 'fullName', label: t('Name'), width: 350 },
      { id: 'relationshipType', label: t('Relationship Type'), width: 350 },
      { id: 'approvalStatus', label: t('Approval Status'), width: 350 },
      { id: '', width: 10 },
    ];
    // const NewFamilySchema = Yup.object().shape({
    //   familyDTOS: Yup.array().of(
    //     Yup.object().shape({
    //       parentPersonId: Yup.string(),
    //       personId: Yup.string(),
    //       // //4 relationshipType: Yup.string(),
    //       approvalStatus: Yup.string().required(t('Approval Status is required')),
    //       firstName: Yup.string().required(t('First Name is required')),
    //       secondName: Yup.string(),
    //       thirdName: Yup.string(),
    //       lastName: Yup.string().required(t('Last Name is required')),
    //       alternativeFirstName: Yup.string(),
    //       alternativeSecondName: Yup.string(),
    //       alternativeThirdName: Yup.string(),
    //       alternativeLastName: Yup.string(),
    //       dateOfBirth: Yup.date().nullable(),
    //       age: Yup.string(),
    //       maritalStatus: Yup.string(),
    //       gender: Yup.string().required(t('Gender is required')),
    //       religion: Yup.string(),
    //       nationalityCode: Yup.string(),
    //       registeredDisabled: Yup.boolean(),
    //       highestEducationLevel: Yup.string(),
    //       passportNumber: Yup.string(),
    //       nationalId: Yup.string(),
    //       personalEmail: Yup.string(),
    //       personalMobile: Yup.string(),
    //     })
    //   ),
    // });

    // const defaultValues: any = useMemo(
    //   () => ({

    //       parentPersonId: currentFamily?.parentPersonId || '',
    //       personId: currentFamily?.personId || '',
    //   relationshipType: currentFamily?.relationshipType || '',
    //   approvalStatus: currentFamily?.approvalStatus || 'DRAFT',
    //   firstName: currentFamily?.firstName || '',
    //   secondName: currentFamily?.secondName || '',
    //   thirdName: currentFamily?.thirdName || '',
    //   lastName: currentFamily?.lastName || '',
    //   alternativeFirstName: currentFamily?.alternativeFirstName || '',
    //   alternativeSecondName: currentFamily?.alternativeSecondName || '',
    //   alternativeThirdName: currentFamily?.alternativeThirdName || '',
    //   alternativeLastName: currentFamily?.alternativeLastName || '',
    //   dateOfBirth: currentFamily?.dateOfBirth || null,
    //   age: currentFamily?.age || null,
    //   maritalStatus: currentFamily?.maritalStatus || '',
    //   gender: currentFamily?.gender || '',
    //   religion: currentFamily?.religion || '',
    //   nationalityCode: currentFamily?.nationalityCode || '',
    //     registeredDisabled: currentFamily?.registeredDisabled === 1,
    //   highestEducationLevel: currentFamily?.highestEducationLevel || '',
    //   passportNumber: currentFamily?.passportNumber || '',
    //   nationalId: currentFamily?.nationalId || '',
    //   personalEmail: currentFamily?.personalEmail || '',
    //   personalMobile: currentFamily?.personalMobile || '',

    //   }),
    //   [currentFamily]
    // );
    // console.log('defaultValues',defaultValues);
    const FamilyMemberSchema = z.object({
      parentPersonId: schemaHelper.nullableInput(z.string()),
      personId: schemaHelper.nullableInput(z.string()),
      approvalStatus: z.string().min(1, t('Approval Status is required')),
      firstName: z.string().min(1, t('First Name is required')),
      secondName: schemaHelper.nullableInput(z.string()),
      thirdName: schemaHelper.nullableInput(z.string()),
      lastName: z.string().min(1, t('Last Name is required')),
      alternativeFirstName: schemaHelper.nullableInput(z.string()),
      alternativeSecondName: schemaHelper.nullableInput(z.string()),
      alternativeThirdName: schemaHelper.nullableInput(z.string()),
      alternativeLastName: schemaHelper.nullableInput(z.string()),
      dateOfBirth: schemaHelper.nullableInput(z.date()),
      age: schemaHelper.nullableInput(z.string()),
      maritalStatus: schemaHelper.nullableInput(z.string()),
      gender: z.string().min(1, t('Gender is required')),
      religion: schemaHelper.nullableInput(z.string()),
      nationalityCode: schemaHelper.nullableInput(z.string()),
      registeredDisabled: schemaHelper.nullableInput(z.boolean()),
      highestEducationLevel: schemaHelper.nullableInput(z.string()),
      passportNumber: schemaHelper.nullableInput(z.string()),
      nationalId: schemaHelper.nullableInput(z.string()),
    
      personalEmail: schemaHelper.nullableInput(z.string()).superRefine((value, ctx) => {
        if (value && !/^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('Email must be a valid email address.'),
          });
        }
      }),
    
      personalMobile: schemaHelper.nullableInput(z.string()),
    });
    
    const NewFamilySchema = z.object({
      familyDTOS: z.array(FamilyMemberSchema),
    });
    const methods = useForm<any>({
      resolver: zodResolver(NewFamilySchema),
    });

    // const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    // const onSubmit = handleSubmit(async (data) => {
    //   try {
    //     await new Promise((resolve) => setTimeout(resolve, 500));
    //     reset();
    //     enqueueSnackbar(currentFamily ? 'Update success!' : 'Create success!');
    //     router.push(paths.hr.personManagement.management);
    //     console.info('Submitted Data:', data);
    //   } catch (error) {
    //     console.error('Submission error:', error);
    //   }
    // });

    // useImperativeHandle(ref, () => ({
    //   submit: onSubmit,
    //   validate: validateForm,
    //   formData,
    // }));

    // const validateForm = async () => {
    //   try {
    //     const isValid = await trigger();
    //     return isValid;
    //   } catch (error) {
    //     console.error('Form validation error:', error);
    //     return false;
    //   }
    // };

    // const formData = () => {
    //   try {
    //     const data = methods.watch();
    //     return data;
    //   } catch (error) {
    //     console.error('Form data error:', error);
    //     return false;
    //   }
    // };

    // const validateFieldOnBlur = async (name: any) => {
    //   try {
    //     const isValid = await trigger(name);
    //     return isValid;
    //   } catch (error) {
    //     console.error(`Validation error on ${name}:`, error);
    //     return false;
    //   }
    // };
    const render_skelton = [...Array(20)].map((_, index) => <TableSkeleton key={index} />);

    return (
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box
              display="flex"
              justifyContent="flex-end" // Aligns the button to the far right
              gap={2}
              p={1}
            >
              <Button
                onClick={() => handleOpenDialog('Add Family')} // Pass label to determine which dialog to open
                variant="contained"
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#333' },
                }}
              >
                {t('Add Person Family')}{' '}
              </Button>
            </Box>
          </Grid>
          {openDialog === 'Add Family' && (
            <FamilyDialog
              parentId={parentPersonId}
              operation="Add Family"
              open
              onClose={handleCloseDialog}
              title={t('Add Person Family')}
              MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
              GENDERTypesLoading={GENDERTypesLoading}
              RELIGIONTypesLoading={RELIGIONTypesLoading}
              RELATIONSHIP_TYPELoading={RELATIONSHIP_TYPELoading}
              countriesLoading={countriesLoading}
              EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
              MARITAL_STATUSTypes={MARITAL_STATUSTypes}
              GENDERTypes={GENDERTypes}
              RELIGIONTypes={RELIGIONTypes}
              countries={countries}
              RELATIONSHIP_TYPE={RELATIONSHIP_TYPE}
              EDUCATION_LEVEL={EDUCATION_LEVEL}
            />
          )}
        </Grid>
        <Card sx={{ p: 3 }}>
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
                  {personfamilyLoading && render_skelton}

                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <Familytablerow
                        key={row.personId}
                        row={row}
                        MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
                        GENDERTypesLoading={GENDERTypesLoading}
                        RELIGIONTypesLoading={RELIGIONTypesLoading}
                        RELATIONSHIP_TYPELoading={RELATIONSHIP_TYPELoading}
                        countriesLoading={countriesLoading}
                        EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
                        MARITAL_STATUSTypes={MARITAL_STATUSTypes}
                        GENDERTypes={GENDERTypes}
                        RELIGIONTypes={RELIGIONTypes}
                        countries={countries}
                        RELATIONSHIP_TYPE={RELATIONSHIP_TYPE}
                        EDUCATION_LEVEL={EDUCATION_LEVEL}
                        //  onCorrectRow={() => handleCorrectRow(row.personId)}
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
        </Card>
      </FormProvider>
    );
  }
);
function applyFilter({
  inputData,
  comparator,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
}) {
  // Ensure inputData is always an array
  if (!Array.isArray(inputData)) {
    console.error("applyFilter error: inputData is not an array", inputData);
    return [];
  }

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

export default FamilyList;
