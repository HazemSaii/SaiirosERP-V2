import type { IEmploymentInfo } from 'src/types/persons';

import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useMemo, useState, forwardRef,useImperativeHandle } from 'react';

import { Box } from '@mui/system';
import { Grid, Card, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import { ActionsButton } from 'src/components/buttons';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import HistoryDialog from './history-dialog';

type Props = {
  currentEmployment?: IEmploymentInfo;
  ContractLoading?: any;
  ActiveEmploymentid?: any;
  operation: string;
  GradesLoading?: any;
  jobsLoading?: any;
  locationsLoading?: any;
  positionsLoading?: any;
  personsLoading?: any;
  organizationsLoading?: any;
  payrollsLoading?: any;
  Grades?: any;
  jobs?: any;
  locations?: any;
  positions?: any;
  persons?: any;
  organizations?: any;
  payrolls?: any;
  EMPLOYMENT_ACTIONSLoading?: any;
  EMPLOYMENT_ACTIONS?: any;
  submit: any;
  handleUpdateemplHistory?: any;
  handleCorrectemplHistory?: any;
  currentcontacthistoy?: any;
  isNotChanged?: any;
};

export interface EmploymentNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const EmploymentNewEditForm = forwardRef<EmploymentNewEditFormHandle, Props>(
  (
    {
      currentEmployment,
      ActiveEmploymentid,
      ContractLoading,
      operation,
      GradesLoading,
      jobsLoading,
      locationsLoading,
      positionsLoading,
      personsLoading,
      organizationsLoading,
      payrollsLoading,
      Grades,
      jobs,
      locations,
      positions,
      persons,
      organizations,
      payrolls,
      EMPLOYMENT_ACTIONSLoading,
      EMPLOYMENT_ACTIONS,
      submit,
      handleUpdateemplHistory,
      handleCorrectemplHistory,
      currentcontacthistoy,
      isNotChanged,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    const router = useRouter();
    const [showCorrectButton, setShowCorrectButton] = useState(false);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [openDialog, setOpenDialog] = useState(null); // Track which dialog is open
    const handleCloseDialog = () => setOpenDialog(null);

    const handleOpenDialog = (label:any) => {
      if (label === t('Correct Employment')) {
        setIsFieldsEnabled(true);
        setShowCorrectButton(true); 
        setShowUpdateButton(false); 
      }
      if (label === t('Update Employment')) {
        setIsFieldsEnabled(true);
        setShowUpdateButton(true); 
        setShowCorrectButton(false); 
      }
      if (label === t('Cancel')) {
        // Reset state to show ActionsButton again
        setShowCorrectButton(false);
        setShowUpdateButton(false);
        setIsFieldsEnabled(false); 
      }
      setOpenDialog(label);
    };;
    const isEdit = operation === 'edit';
    const iscreate = operation === 'create';
    const [selectedRow, setSelectedRow] = useState(currentEmployment);
    const [isFieldsEnabled, setIsFieldsEnabled] = useState(false);

    const handleRowClick = (dataRow: any) => {

        const isActiveContract = dataRow?.historyId === ActiveEmploymentid;
        // Find the row with the maximum start date
        const maxStartDate = currentcontacthistoy.reduce(
          (max:any, item:any) => (new Date(item.startDate) > max ? new Date(item.startDate) : max),
          new Date(0) // Start with the earliest possible date
        );
        const isMaxStartDate = new Date(dataRow.startDate).getTime() === maxStartDate.getTime();
        setSelectedRow(dataRow);
        setIsFieldsEnabled(isActiveContract);
      methods.reset({
        ...defaultValues,
        startDate: dataRow.startDate ? new Date(dataRow.startDate) : new Date(),
        endDate: dataRow.endDate ? new Date(dataRow.endDate) : null,
        actionCode: dataRow.actionCode || '',
        approvalStatus: dataRow.approvalStatus || 'DRAFT',
        positionId: dataRow.positionId || '',
        organizationId: dataRow.organizationId || '',
        jobId: dataRow.jobId || '',
        gradeId: dataRow.gradeId || '',
        locationId: dataRow.locationId || '',
        payrollId: dataRow.payrollId || '',
        managerId: dataRow.managerId || '',
        contractId: dataRow.contractId || Math.floor(Math.random() * 1000000),
        historyId: dataRow.historyId || Math.floor(Math.random() * 1000000),
        historyKey: dataRow.contractId || Math.floor(Math.random() * 1000000),
      });
      handleCloseDialog();
    };
    // const NewContractSchema = Yup.object().shape({

    //     startDate: Yup.mixed<Date>().when([], {
    //           is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
    //           then: (schema) => {
    //             let newSchema = schema.required(t('Start date is required'));
                
    //             if (iscreate) {
    //               newSchema = newSchema.test(
    //                 'is-future-date',
    //                 t('Start date must be today or later'),
    //                 (value) => !value || new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0))
    //               );
    //             }
                
    //             return newSchema;
    //           },
    //           otherwise: (schema) => schema.notRequired(),
    //         }),
    //         endDate: Yup.mixed<any>()
    //           .nullable()
    //           .when(['startDate'], {
    //             is: (startDate:any) => !(isNotChanged || (!isFieldsEnabled && !iscreate)) && !!startDate,
    //             then: (schema) =>
    //               schema.test(
    //                 'date-min',
    //                 t('End Date must be later than Start Date'),
    //                 (value, { parent }) =>
    //                   !value || (value && parent.startDate && new Date(value) > new Date(parent.startDate))
    //               ),
    //             otherwise: (schema) => schema.notRequired(),
    //           }),
    
    //   actionCode: Yup.string().when([], {
    //     is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
    //     then: (schema) => schema.required(t('Action is required')),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    
    //   approvalStatus: Yup.string().when([], {
    //     is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
    //     then: (schema) => schema.required(t('Approval Status is required')),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    //   // positionId: Yup.string(),
    //   // organizationId: Yup.string(),
    //   // jobId: Yup.string(),
    //   // gradeId: Yup.string(),
    //   // locationId: Yup.string(),
    //   // payroll: Yup.string(),
    //   // managerId: Yup.string(),
    // });
    const NewContractSchema = z.object({
      startDate: z
        .union([z.date(), z.string().transform((val) => new Date(val))])
        .superRefine((date, ctx) => {
          if (!(isNotChanged || (!isFieldsEnabled && !iscreate)) && !date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('Start date is required'),
            });
          }
    
          if (iscreate && date && new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('Start date must be today or later'),
            });
          }
        }),
    
      // endDate: schemaHelper.nullableInput(z.date()).superRefine((date, ctx) => {
      //   if (
      //     !(isNotChanged || (!isFieldsEnabled && !iscreate)) &&
      //     date &&
      //     ctx.parent.startDate &&
      //     new Date(date) <= new Date(ctx.parent.startDate)
      //   ) {
      //     ctx.addIssue({
      //       code: z.ZodIssueCode.custom,
      //       message: t('End Date must be later than Start Date'),
      //     });
      //   }
      // }),
    
      actionCode: z
        .string()
        .min(1, t('Action is required'))
        .optional(),
    
      approvalStatus: z
        .string()
        .min(1, t('Approval Status is required'))
        .optional(),
    })
    const defaultValues: any = useMemo(
      () => ({
        startDate: currentEmployment?.startDate
          ? new Date(currentEmployment.startDate)
          : new Date(),
        endDate: currentEmployment?.endDate ? new Date(currentEmployment.endDate) : null,
        actionCode: currentEmployment?.actionCode || '',
        approvalStatus: currentEmployment?.approvalStatus || 'DRAFT',
        positionId: currentEmployment?.positionId || '',
        organizationId: currentEmployment?.organizationId || '',
        jobId: currentEmployment?.jobId || '',
        gradeId: currentEmployment?.gradeId || '',
        locationId: currentEmployment?.locationId || '',
        payrollId: currentEmployment?.payrollId || '',
        managerId: currentEmployment?.managerId || '',
        uniqueId: Math.floor(Math.random() * 1000000),
        contractId: currentEmployment?.contractId || Math.floor(Math.random() * 1000000),
        historyId: currentEmployment?.historyId || Math.floor(Math.random() * 1000000),
        historyKey: currentEmployment?.contractId || Math.floor(Math.random() * 1000000),
      }),
      [currentEmployment]
    );
    const TABLE_HEAD = [
      { id: 'startDate', label: t('Start Date') },
      { id: 'endDate', label: t('End Date') },
      { id: 'actionCode', label: t('Action') },
    ];
    const methods = useForm<any>({
      resolver: zodResolver(NewContractSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentEmployment ? 'Update success!' : 'Create success!');
        router.push(paths.hr.personManagement.management);
        console.info('Submitted Data:', data);
      } catch (error) {
        console.error('Submission error:', error);
      }
    });

    useImperativeHandle(ref, () => ({
      submit: onSubmit,
      validate: validateForm,
      formData,
    }));

    const validateForm = async () => {
      try {
        const isValid = await trigger();
        return isValid;
      } catch (error) {
        console.error('Form validation error:', error);
        return false;
      }
    };

    const formData = () => {
      try {
        const data = methods.watch();
        return data;
      } catch (error) {
        console.error('Form data error:', error);
        return false;
      }
    };
    const validateFieldOnBlur = async (name: any) => {
      try {
        const isValid = await trigger(name);
        return isValid;
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false;
      }
    };
    const options = [t('Rehire'), t('Promotion'), t('Change Assignment'), t('History'),t('Correct Employment'), t('Update Employment')];
    return (
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} p={1}>
            {!iscreate && !showCorrectButton && !showUpdateButton && (
        <ActionsButton
          handleOpenDialog={handleOpenDialog}
          isCreate={iscreate}
          actions={options}
        />
      )}

      {!iscreate && showCorrectButton && (
        <>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#333' },
          }}
          onClick={handleCorrectemplHistory}
        >
          {t('Submit Correct Employment')}
        </Button>
        {/* Cancel Button */}
    <Button
    variant="outlined"
    sx={{
      borderRadius: '8px',
      fontWeight: 'bold',
      marginLeft: '10px',
    }}
    onClick={() => handleOpenDialog(t('Cancel'))}
  >
    {t('Cancel')}
  </Button>
</>
      )}

      {!iscreate && showUpdateButton && (
        <>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#333' },
          }}
          onClick={handleUpdateemplHistory}
        >
          {t('Submit Update Employment')}
        </Button>
        {/* Cancel Button */}
    <Button
    variant="outlined"
    sx={{
      borderRadius: '8px',
      fontWeight: 'bold',
      marginLeft: '10px',
    }}
    onClick={() => handleOpenDialog(t('Cancel'))}
  >
    {t('Cancel')}
  </Button>
</>
      )}
               {openDialog === t('History') && (
                <HistoryDialog
                  row={currentcontacthistoy}
                  onRowClick={handleRowClick}
                  TABLE_HEAD={TABLE_HEAD}
                  open
                  onClose={handleCloseDialog}
                  title={t('History')}
                />
              )}

            </Box>
            <Card sx={{ p: 3 }}>
              {/* 1 */}
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            minDate={new Date()}
                            label={`${t('Start Date')} *`}
                            value={field.value}
                            format="dd/MM/yyyy"
                            onChange={(newValue) => {
                              field.onChange(newValue);
                              validateFieldOnBlur('startDate');
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                                InputLabelProps: { shrink: true },
                              },
                              field: { clearable: true },
                            }}
                            disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  {!iscreate && (
                    <Box gridColumn="span 1">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          name="endDate"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <DatePicker
                              minDate={new Date()}
                              label={`${t('End Date')} `}
                              value={field.value}
                              format="dd/MM/yyyy"
                              onChange={(newValue) => {
                                field.onChange(newValue);
                                validateFieldOnBlur('endDate');
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!error,
                                  helperText: error?.message,
                                  InputLabelProps: { shrink: true },
                                },
                                field: { clearable: true },
                              }}
                              disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                              />
                          )}
                        />
                      </LocalizationProvider>
                    </Box>
                  )}

                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                    required
                      name="actionCode"
                      // type="actionCode"
                      label={t('Action')}
                      placeholder={t('Choose Action')}
                      onBlur={() => validateFieldOnBlur('actionCode')}
                      options={
                        !EMPLOYMENT_ACTIONSLoading
                          ? EMPLOYMENT_ACTIONS.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !EMPLOYMENT_ACTIONSLoading
                          ? EMPLOYMENT_ACTIONS.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  {!iscreate && (
                    <Box gridColumn="span 1">
                      <RHFTextField
                      required
                        name="approvalStatus"
                        label={t('Approval Status')}
                        onBlur={() => validateFieldOnBlur('approvalStatus')}
                        disabled
                      />
                    </Box>
                  )}
                </Box>
              </Card>
              <Box mt={1} />
              {/* 2 */}

              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="positionId"
                      // type="positionId"
                      label={t('Position')}
                      placeholder={t('Choose Position')}
                      onBlur={() => validateFieldOnBlur('positionId')}
                      options={
                        !positionsLoading ? positions.map((option: any) => option.positionId) : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !positionsLoading
                          ? positions.find((item: any) => item.positionId === option)
                          : undefined;
                        return selectedOption ? selectedOption.positionName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="organizationId"
                      // type="organizationId"
                      label={t('Organization')}
                      placeholder={t('Choose Organization')}
                      onBlur={() => validateFieldOnBlur('organizationId')}
                      options={
                        !organizationsLoading
                          ? organizations.map((option: any) => option.organizationId)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !organizationsLoading
                          ? organizations.find((item: any) => item.organizationId === option)
                          : undefined;
                        return selectedOption ? selectedOption.organizationName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="jobId"
                      // type="jobId"
                      label={t('Job')}
                      placeholder={t('Choose Job')}
                      onBlur={() => validateFieldOnBlur('jobId')}
                      options={!jobsLoading ? jobs.map((option: any) => option.jobId) : []}
                      getOptionLabel={(option) => {
                        const selectedOption = !jobsLoading
                          ? jobs.find((item: any) => item.jobId === option)
                          : undefined;
                        return selectedOption ? selectedOption.jobName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                </Box>
              </Card>
              <Box mt={1} />
              {/* 3 */}
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="gradeId"
                      // type="gradeId"
                      label={t('Grade')}
                      placeholder={t('Choose Grade')}
                      onBlur={() => validateFieldOnBlur('gradeId')}
                      options={!GradesLoading ? Grades.map((option: any) => option.gradeId) : []}
                      getOptionLabel={(option) => {
                        const selectedOption = !GradesLoading
                          ? Grades.find((item: any) => item.gradeId === option)
                          : undefined;
                        return selectedOption ? selectedOption.gradeName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="locationId"
                      // type="locationId"
                      label={t('Location')}
                      placeholder={t('Choose Location')}
                      onBlur={() => validateFieldOnBlur('locationId')}
                      options={
                        !locationsLoading ? locations.map((option: any) => option.locationId) : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !locationsLoading
                          ? locations.find((item: any) => item.locationId === option)
                          : undefined;
                        return selectedOption ? selectedOption.locationName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="payrollId"
                      // type="payrollId"
                      label={t('Payroll')}
                      placeholder={t('Choose Payroll')}
                      onBlur={() => validateFieldOnBlur('payrollId')}
                      options={
                        !payrollsLoading ? payrolls.map((option: any) => option.payrollId) : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !payrollsLoading
                          ? payrolls.find((item: any) => item.payrollId === option)
                          : undefined;
                        return selectedOption ? selectedOption.payrollName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                </Box>
              </Card>
              <Box mt={1} />

              {/* 4 */}

              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="managerId"
                      // type="managerId"
                      label={t('Manager')}
                      placeholder={t('Choose a Manager')}
                      onBlur={() => validateFieldOnBlur('managerId')}
                      options={!personsLoading ? persons.map((option: any) => option.personId) : []}
                      getOptionLabel={(option) => {
                        const selectedOption = !personsLoading
                          ? persons.find((item: any) => item.personId === option)
                          : undefined;
                          return selectedOption ? `${selectedOption.firstName} ${selectedOption.lastName}` : '';
                        }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                </Box>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default EmploymentNewEditForm;
