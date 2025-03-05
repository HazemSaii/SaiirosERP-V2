import type { DialogProps } from '@mui/material/Dialog';

import { z } from 'zod';
import { toast } from 'sonner';
import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Card, Grid } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { useTranslate } from 'src/locales';
import { UserenewContract, UseresignEmployee, UseterminateContract } from 'src/actions/Hr/contract';

import { RHFTextField, schemaHelper, RHFAutocomplete } from 'src/components/hook-form';

type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  row: any;
  
  TIME_UNITSLoading: any;
  TIME_UNITS_Types: any;
  EMPLOYMENT_TYPE: any;
  EMPLOYMENT_TYPELoading: any;
  title: any;
};
// type FormValues = {
//   newPassword: string;
//   confirmPassword: string;
//   userId: string;
// };
export default function RenewDialog({
  row,
  open,
  title,
  onClose,
  TIME_UNITSLoading,
  TIME_UNITS_Types,
  
  EMPLOYMENT_TYPE,
  EMPLOYMENT_TYPELoading,
     
}: Props) {
  const { t } = useTranslate();
  const formData = () => {
    try {
      const data = methods.watch();
      return data;
    } catch (error) {
      console.error('Form data error:', error);
      return false;
    }
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
 const NewSchema = () =>
       z
         .object({
           startDate:z.preprocess(
                 (val) => {
                   if (!val) return undefined; // ✅ Ensure null/undefined triggers required_error
                   return typeof val === "string" ? new Date(val) : val; // Convert string to Date
                 },
                 z.date({ required_error: t("Start date is required") }) // ✅ Show required error when null
                   .refine(
                     (value) =>  value >= today, // If `isCreate`, must be today or later
                     { message: t("Start date must be today or later") }
                   )
               ),
     
           endDate: z
                 .union([z.string(), z.date()])
                 .nullable()
                 .transform((value) =>
                   typeof value === "string" ? new Date(value) : value
                 ) // Ensure it's a Date
     ,
           employmentType:
                 schemaHelper.nullableInput(
                   z
                     .union([z.string(), z.number()])
                     .transform((val) => String(val))
                     .refine((val) => val.trim().length > 0, {
                       message: t("Employment Type is required"),
                     }),
                   {
                     message: t("Employment Type is required"),
                   }
                 ),
     
           probationEndDate: z.union([z.string(), z.date()]).nullable()
             .transform((value) =>
               typeof value === "string" ? new Date(value) : value
             ), // ✅ Make sure it's a Date
     
         })
         .superRefine((data, ctx) => {
             // ✅ Validate endDate
             if (data.endDate && data.startDate && data.endDate <= data.startDate) {
               ctx.addIssue({
                 code: z.ZodIssueCode.custom,
                 message: t("End Date must be later than Start Date"),
                 path: ["endDate"],
               });
             }
     
             // ✅ Validate probationEndDate
             if (
               data.probationEndDate &&
               data.startDate &&
               data.probationEndDate <= data.startDate
             ) {
               ctx.addIssue({
                 code: z.ZodIssueCode.custom,
                 message: t("Probation End Date must be later than Start Date"),
                 path: ["probationEndDate"],
               });
             }
     
           
           
         });
  const { personId = '', contractId = '' } = row || {};

  const defaultValues = useMemo(
    () => ({
      personId: personId || '',
      contractId: contractId || '',
      startDate:new Date(),
      endDate: null,
      employmentType: '',
      probationLength: '',
      probationUnits: '',
      probationEndDate: null,
      employeeNoticeLength: '',
      employeeNoticeUnits: '',
      employerNoticeLength: '',
      employerNoticeUnits: '',
      approvalStatus: 'DRAFT',
      legalEntityId: 1,
      saveOrSubmit:'SUBMITTED',

    }),
    []
  );
  const methods = useForm({
    resolver: zodResolver(NewSchema()),
    defaultValues,
  });
  const { handleSubmit, trigger,control } = methods;

  const onSubmit = handleSubmit(async () => {
    const data = formData();
    console.log('data', data);

    try {
       const res = await UserenewContract(data);
      

      if (res && res.status === 200) {
        toast.success(t(`${title} ${t('action completed successfully!')}`));
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  const validateFieldOnBlur = async (name: any) => {
    try {
      const isValid = await trigger(name);
      return isValid;
    } catch (error) {
      console.error(`Validation error on ${name}:`, error);
      return false;
    }
  };
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Grid container>
              <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
              {/* 1 */}
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: `repeat(${ 6 }, 1fr)`,
                  }}
                >
                  <Box gridColumn="span 3">
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
                            
                            // disabled={isNotChanged || !isFieldsEnabled && !iscreate}

                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Box gridColumn="span 3">
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
                            // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Box gridColumn="span 3">
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>

                  
                    <Box gridColumn="span 3">
                      <RHFTextField
                        name="approvalStatus"
                        label={t('Approval Status')}
                        placeholder={t('Approval Status')}
                        onBlur={() => validateFieldOnBlur('approvalStatus')}
                        required
                        disabled
                      />
                    </Box>
                  
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
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
                            // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
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
                    sm: 'repeat(2, 1fr)',
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
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
                      // disabled={isNotChanged || !isFieldsEnabled && !iscreate}
                      />
                  </Box>
                </Box>
              </Card>
              {/* 4 */}
             
            </Card>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('Close')}
          </Button>
        )}
        <Button variant="contained" color="success" onClick={onSubmit}>
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
