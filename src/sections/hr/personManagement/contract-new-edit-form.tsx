import type { IContractInfo } from 'src/types/persons';

import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { usePopover } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useMemo, useState, forwardRef, useImperativeHandle } from 'react';

import { Box } from '@mui/system';
import { Grid, Card, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker , LocalizationProvider } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {  useLocales } from 'src/locales';

import { ActionsButton } from 'src/components/buttons';
import {
  RHFTextField,
  schemaHelper,
  RHFAutocomplete,
} from 'src/components/hook-form';

import HistoryDialog from './history-dialog';
import ResignationDialog from './resignation-dialog';

type Props = {
  currentContract?: IContractInfo;
  ContractLoading?: any;
  ActiveContractid?: any;
  TIME_UNITSLoading?: any;
  TIME_UNITS_Types?: any;
  END_CONTRACT_REASONS?: any;
  END_CONTRACT_REASONSLoading?: any;
  EMPLOYMENT_TYPE?: any;
  EMPLOYMENT_TYPELoading?: any;
  operation: string;
  submit: any;
  handleUpdateContract?: any;
  handleCorrectContract?: any;
  currenthistoy?: any;
  isNotChanged?: any;
};

export interface ContractNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const ContractNewEditForm = forwardRef<ContractNewEditFormHandle, Props>(
  (
    {
      currentContract,
      ContractLoading,
      operation,
      TIME_UNITSLoading,
      TIME_UNITS_Types,
      END_CONTRACT_REASONS,
      END_CONTRACT_REASONSLoading,
      EMPLOYMENT_TYPE,
      EMPLOYMENT_TYPELoading,
      submit,
      handleUpdateContract,
      handleCorrectContract,
      currenthistoy,
      isNotChanged,
      ActiveContractid
    },
    ref
  ) => {
      const popover = usePopover();
    
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    const router = useRouter();
    const isEdit = operation === 'edit';
    const iscreate = operation === 'create';
    const [openDialog, setOpenDialog] = useState(null);
    const [showCorrectButton, setShowCorrectButton] = useState(false);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const handleCloseDialog = () => setOpenDialog(null);
    const [selectedRow, setSelectedRow] = useState(currentContract);
    const [isFieldsEnabled, setIsFieldsEnabled] = useState(false);

    const handleRowClick = (dataRow: any) => {
        const isActiveContract = dataRow.contractId === ActiveContractid;
              
        const maxStartDate = currenthistoy.reduce(
          (max:any, item:any) => (new Date(item.startDate) > max ? new Date(item.startDate) : max),
          new Date(0) // Start with the earliest possible date
        );
      
        // Determine if the clicked row is the one with the maximum start date
        const isMaxStartDate = new Date(dataRow.startDate).getTime() === maxStartDate.getTime();
      
        // Update selected row and enable/disable fields
        setSelectedRow(dataRow);
        setIsFieldsEnabled(isActiveContract);
      
      
    
      methods.reset({
        ...defaultValues, // Reset form fields with updated values
        startDate: dataRow.startDate ? new Date(dataRow.startDate) : new Date(),
        endDate: dataRow.endDate ? new Date(dataRow.endDate) : null,
        employmentType: dataRow.employmentType || '',
        approvalStatus: dataRow.approvalStatus || 'DRAFT',
        probationLength: dataRow.probationLength || '',
        probationUnits: dataRow.probationUnits || '',
        probationEndDate: dataRow.probationEndDate
          ? new Date(dataRow.probationEndDate)
          : null,
        employeeNoticeLength: dataRow.employeeNoticeLength || '',
        employeeNoticeUnits: dataRow.employeeNoticeUnits || '',
        employerNoticeLength: dataRow.employerNoticeLength || '',
        employerNoticeUnits: dataRow.employerNoticeUnits || '',
        finalProcessDate: dataRow.finalProcessDate ? new Date(dataRow.finalProcessDate) : null,
        reason: dataRow.reason || '',
        notes: dataRow.notes || '',
        contractId: dataRow.contractId || Math.floor(Math.random() * 1000000),
      });
    
      handleCloseDialog(); // Close the dialog
    };
    
    
    // const NewContractSchema = Yup.object().shape({
    //   startDate: Yup.mixed<Date>().when([], {
    //     is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
    //     then: (schema) => {
    //       let newSchema = schema.required(t('Start date is required'));
          
    //       if (iscreate) {
    //         newSchema = newSchema.test(
    //           'is-future-date',
    //           t('Start date must be today or later'),
    //           (value) => !value || new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0))
    //         );
    //       }
          
    //       return newSchema;
    //     },
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    //   endDate: Yup.mixed<any>()
    //     .nullable()
    //     .when(['startDate'], {
    //       is: (startDate:any) => !(isNotChanged || (!isFieldsEnabled && !iscreate)) && !!startDate,
    //       then: (schema) =>
    //         schema.test(
    //           'date-min',
    //           t('End Date must be later than Start Date'),
    //           (value, { parent }) =>
    //             !value || (value && parent.startDate && new Date(value) > new Date(parent.startDate))
    //         ),
    //       otherwise: (schema) => schema.notRequired(),
    //     }),
    
    //   employmentType: Yup.string().when([], {
    //     is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
    //     then: (schema) => schema.required(t('Employment Type is required')),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    
    //   approvalStatus: Yup.string().when([], {
    //     is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
    //     then: (schema) => schema.required(t('Approval Status is required')),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    
    //   probationEndDate: Yup.string().nullable(),
    //   finalProcessDate: Yup.mixed<any>().nullable(),
    //   // notes: Yup.string().nullable(),
    //   // probationLength: Yup.string(),
    //   // probationUnits: Yup.string(),
    //   // employeeNoticeLength: Yup.string(),
    //   // employerNoticeLength: Yup.string(),
    //   // employerNoticeUnits: Yup.string(),
    //   // employeeNoticeUnits: Yup.string(),
    //   // reason: Yup.string(),
    // });
    const NewContractSchema = z.object({
      startDate: z
        .union([z.date(), z.string().transform((val) => new Date(val))])
        .refine(
          (date) => isNotChanged || (!isFieldsEnabled && !iscreate) || !!date,
          { message: t('Start date is required') }
        )
        .refine(
          (date) =>
            !iscreate || !date || new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
          { message: t('Start date must be today or later') }
        ),
    
      // endDate: schemaHelper.nullableInput(z.date()).refine(
      //   (date, ctx) =>
      //     !date ||
      //     (ctx.parent.startDate && new Date(date) > new Date(ctx.parent.startDate)),
      //   { message: t('End Date must be later than Start Date') }
      // ),
    
      employmentType: z
        .string()
        .min(1, t('Employment Type is required'))
        .optional(),
    
      approvalStatus: z
        .string()
        .min(1, t('Approval Status is required'))
        .optional(),
    
      probationEndDate: schemaHelper.nullableInput(z.string()),
      finalProcessDate: schemaHelper.nullableInput(z.date()),
    });
    
    const TABLE_HEAD = [
      { id: 'startDate', label: t('Start Date') },
      { id: 'endDate', label: t('End Date') },
      { id: 'Action', label: t('Action') },
    ];
    const defaultValues: any = useMemo(
      () => ({
        startDate: currentContract?.startDate ? new Date(currentContract.startDate) : new Date(),
        endDate: currentContract?.endDate ? new Date(currentContract.endDate) : null,
        employmentType: currentContract?.employmentType || '',
        //    employmentType:  Math.floor(Math.random() * 1000000),
        approvalStatus: currentContract?.approvalStatus || 'DRAFT',
        probationLength: currentContract?.probationLength || '',
        probationUnits: currentContract?.probationUnits || '',
        probationEndDate: currentContract?.probationEndDate
          ? new Date(currentContract.probationEndDate)
          : null,
        employeeNoticeLength: currentContract?.employeeNoticeLength || '',
        employeeNoticeUnits: currentContract?.employeeNoticeUnits || '',
        employerNoticeLength: currentContract?.employerNoticeLength || '',
        employerNoticeUnits: currentContract?.employerNoticeUnits || '',
        finalProcessDate: currentContract?.finalProcessDate
          ? new Date(currentContract.finalProcessDate)
          : null,
        reason: currentContract?.reason || '',
        notes: currentContract?.notes || '',
        legalEntityId: 1,
        contractKey: Math.floor(Math.random() * 1000000),
        uniqueId: Math.floor(Math.random() * 1000000),
        contractId: currentContract?.contractId || Math.floor(Math.random() * 1000000),
      }),
      [currentContract]
    );

    const methods = useForm<any>({
      resolver: zodResolver(NewContractSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField,setValue } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentContract ? 'Update success!' : 'Create success!');
        router.push(paths.hr.personManagement.management);
        console.info('Submitted Data:', data);
      } catch (error) {
        console.error('Submission error:', error);
      }
    });
    const handleOpenDialog = (label: any) => {
      if (label === t('Correct Contract')) {
        setIsFieldsEnabled(true);
        setShowCorrectButton(true); 
        setShowUpdateButton(false); 
      }
      if (label === t('Update Contract')) {
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
    };
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

    const options = [t('ReNew'), t('Resignation'), t('Termination'), t('History'), t('Transfer'),t('Correct Contract'), t('Update Contract')];

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
      onClick={handleCorrectContract}
    >
      {t('Submit Correct Contract')}
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
      onClick={handleUpdateContract}
    >
      {t('Submit Update Contract')}
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
              {openDialog === t('Resignation') && (
                <ResignationDialog
                END_CONTRACT_REASONS={END_CONTRACT_REASONS}
                END_CONTRACT_REASONSLoading={END_CONTRACT_REASONSLoading}
                  row={currentContract}
                  open
                  onClose={handleCloseDialog}
                  title={t('Resignation')}
                />
              )}
              {openDialog === t('Termination') && (
                <ResignationDialog
                END_CONTRACT_REASONS={END_CONTRACT_REASONS}
                END_CONTRACT_REASONSLoading={END_CONTRACT_REASONSLoading}
                  row={currentContract}
                  open
                  onClose={handleCloseDialog}
                  title={t('Termination')}
                />
              )}
              {openDialog === t('History') && (
                <HistoryDialog
                onRowClick={handleRowClick}
                  row={currenthistoy}
                  TABLE_HEAD={TABLE_HEAD}
                  open
                  onClose={handleCloseDialog}
                  title={t('History')}
                />
              )}
              {/* Submit button */}
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
                    sm: `repeat(${iscreate ? 3 : 2}, 1fr)`,
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

                  <Box gridColumn="span 1">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            minDate={new Date()}
                            label={`${t('End Date')}`}
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

                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                    required
                      name="employmentType"
                      // type="employmentType"
                      label={t('Employment Type')}
                      placeholder={t('Choose an Employment Type')}
                      onBlur={() => validateFieldOnBlur('employmentType')}
                      options={
                        !EMPLOYMENT_TYPELoading && Array.isArray(EMPLOYMENT_TYPE)
                          ? EMPLOYMENT_TYPE.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption =
                          !EMPLOYMENT_TYPELoading && Array.isArray(EMPLOYMENT_TYPE)
                            ? EMPLOYMENT_TYPE.find((item: any) => item.valueCode === option)
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
                        name="approvalStatus"
                        label={t('Approval Status')}
                        placeholder={t('Approval Status')}
                        onBlur={() => validateFieldOnBlur('approvalStatus')}
                        required
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
                    <RHFTextField
                      name="probationLength"
                      label={t('Probation Length')}
                      placeholder={t('Probation Length')}
                      onBlur={() => validateFieldOnBlur('probationLength')}
                      type="number"
                      onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric', // For better numeric keyboard on mobile
                      }}
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="probationUnits"
                      // type="probationUnits"
                      label={t('Probation Units')}
                      placeholder={t('Choose Probation Units')}
                      onBlur={() => validateFieldOnBlur('probationUnits')}
                      options={
                        !TIME_UNITSLoading
                          ? TIME_UNITS_Types.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !TIME_UNITSLoading
                          ? TIME_UNITS_Types.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name="probationEndDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            minDate={new Date()}
                            label={`${t('Probation End Date')} `}
                            value={field.value}
                            format="dd/MM/yyyy"
                            onChange={(newValue) => {
                              field.onChange(newValue);
                              validateFieldOnBlur('probationEndDate');
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
                    sm: 'repeat(4, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="employeeNoticeLength"
                      label={t('Employee Notice Length')}
                      placeholder={t('Employee Notice Length')}
                      onBlur={() => validateFieldOnBlur('employeeNoticeLength')}
                      type="number"
                      onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric', // For better numeric keyboard on mobile
                      }}
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="employeeNoticeUnits"
                      // type="employeeNoticeUnits"
                      label={t('Employee Notice Units')}
                      placeholder={t('Choose Employee Notice Units')}
                      onBlur={() => validateFieldOnBlur('employeeNoticeUnits')}
                      options={
                        !TIME_UNITSLoading
                          ? TIME_UNITS_Types.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !TIME_UNITSLoading
                          ? TIME_UNITS_Types.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>

                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="employerNoticeLength"
                      placeholder={t('Employer Notice Length')}
                      label={t('Employer Notice Length')}
                      onBlur={() => validateFieldOnBlur('employerNoticeLength')}
                      type="number"
                      onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric', // For better numeric keyboard on mobile
                      }}
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>

                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="employerNoticeUnits"
                      // type="employerNoticeUnits"
                      label={t('Employer Notice Units')}
                      placeholder={t('Choose Employer Notice Units')}
                      onBlur={() => validateFieldOnBlur('employerNoticeUnits')}
                      options={
                        !TIME_UNITSLoading
                          ? TIME_UNITS_Types.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !TIME_UNITSLoading
                          ? TIME_UNITS_Types.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                </Box>
              </Card>
              {/* 4 */}
              <Box mt={1} />
              {!iscreate && (
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
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          name="finalProcessDate"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <DatePicker
                              minDate={new Date()}
                              label={`${t('Final Process Date')} `}
                              value={field.value}
                              format="dd/MM/yyyy"
                              onChange={(newValue) => {
                                field.onChange(newValue);
                                validateFieldOnBlur('finalProcessDate');
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
                    <Box gridColumn="span 1">
                      <RHFAutocomplete
                        name="reason"
                        // type="reason"
                        label={t('Reason')}
                        placeholder={t('Choose a Reason')}
                        onBlur={() => validateFieldOnBlur('reason')}
                        options={
                          !END_CONTRACT_REASONSLoading
                            ? END_CONTRACT_REASONS.map((option: any) => option.valueCode)
                            : []
                        }
                        getOptionLabel={(option) => {
                          const selectedOption = !END_CONTRACT_REASONSLoading
                            ? END_CONTRACT_REASONS.find((item: any) => item.valueCode === option)
                            : undefined;
                          return selectedOption ? selectedOption.valueName : '';
                        }}
                        isOptionEqualToValue={(option, value) =>
                          value === null || value === undefined ? true : option === value
                        }
                        disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                        />
                    </Box>
                    <Box gridColumn="span 1">
                      <RHFTextField
                        name="notes"
                        label={t('Notes')}
                        placeholder={t('Notes')}
                        onBlur={() => validateFieldOnBlur('notes')}
                        disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                        />
                    </Box>
                  </Box>
                </Card>
              )}
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default ContractNewEditForm;
