import type { IPesonalInfo } from 'src/types/persons';

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
import { RHFCheckbox, RHFTextField, RHFAutocomplete, schemaHelper } from 'src/components/hook-form';

type Props = {
  currentPersonal?: IPesonalInfo;
  PersonalLoading?: any;
  operation: string;
  MARITAL_STATUSTypesLoading?: any;
  GENDERTypesLoading?: any;
  RELIGIONTypesLoading?: any;
  countriesLoading?: any;
  EDUCATION_LEVELLoading?: any;
  MARITAL_STATUSTypes?: any;
  GENDERTypes?: any;
  RELIGIONTypes?: any;
  countries?: any;
  EDUCATION_LEVEL?: any;
  submit?: any;
  isNotChanged?: any;
};

export interface PersonalNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const PersonalNewEditForm = forwardRef<PersonalNewEditFormHandle, Props>(
  (
    {
      currentPersonal,
      PersonalLoading,
      operation,
      MARITAL_STATUSTypesLoading,
      GENDERTypesLoading,
      RELIGIONTypesLoading,
      countriesLoading,
      EDUCATION_LEVELLoading,
      MARITAL_STATUSTypes,
      GENDERTypes,
      RELIGIONTypes,
      countries,
      EDUCATION_LEVEL,
      isNotChanged,
      submit,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [isFieldsEnabled, setIsFieldsEnabled] = useState(false);

    const router = useRouter();

    const iscreate = operation === 'create';
    // const emailValidation = () =>
    //   Yup.string().when([], {
    //     is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)), // ✅ Validate only when this condition is met
    //     then: (schema) =>
    //       schema
    //         .nullable() // Allows null values
    //         .notRequired() // Not required
    //         .test(
    //           'is-valid-email',
    //           t(`Invalid email format`),
    //           (value) => {
    //             if (!value) return true; // Skip validation if empty (null or "")
    //             return /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(value); // Validate if not empty
    //           }
    //         ),
    //     otherwise: (schema) => schema.notRequired(),
    //   });
    

const emailValidation = () => {
  const shouldValidate = !isNotChanged && (isFieldsEnabled || iscreate);

  return shouldValidate
    ? z
        .string()
        .trim()
        .email({ message: t("Invalid email format") }) // ✅ Validate email format
        .or(z.literal("")) // ✅ Allow empty string
        .nullable() // ✅ Allow null
    : z.string().optional();
};


    
    const NewPersonalSchema = z.object({
   // disabled validation of all of this = {isNotChanged || !isFieldsEnabled && !iscreate}

  //  approvalStatus: Yup.string().when([], {
  //   is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
  //   then: (schema) => schema.required(t('Approval Status is required')),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // firstName: z.string().when([], {
  //   is: () => !(isNotChanged || (!isFieldsEnabled && !iscreate)),
  //   then: (schema) => schema.required(t('First Name is required')),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  firstName:isNotChanged || (!isFieldsEnabled && !iscreate)
  ?z.union([z.string(), z.number(), z.null()])
  .transform((val) => (val === null ? "" : String(val)))
  .optional()
  : z.union([z.string(), z.number()])
  .transform((val) => String(val))
  .refine((val) => val.trim().length > 0, {
    message: t("First Name is required"),
  }).refine((val) => val.trim().length > 2, {
    message: t("InValid First Name"),
  }),
  lastName:isNotChanged || (!isFieldsEnabled && !iscreate)
  ?z.union([z.string(), z.number(), z.null()])
  .transform((val) => (val === null ? "" : String(val)))
  .optional()
  : z.union([z.string(), z.number()])
  .transform((val) => String(val))
  .refine((val) => val.trim().length > 0, {
    message: t("Last Name is required"),
  })
  .refine((val) => val.trim().length > 2, {
    message: t("InValid Last Name"),
  }),
  gender:isNotChanged || (!isFieldsEnabled && !iscreate)
  ?z.union([z.string(), z.number(), z.null()])
  .transform((val) => (val === null ? "" : String(val)))
  .optional()
  :schemaHelper.nullableInput( z.union([z.string(), z.number()])
  .transform((val) => String(val))
  .refine((val) => val.trim().length > 0, {
    message: t("Gender is required"),
  }), {
    message: t("Gender is required"),
  }),

  
  

  dateOfBirth: z
  .preprocess(
    (val:any) => (val === "" ? null : new Date(val)), // Convert string to Date or null
    z.date()
      .max(new Date(), { message: t("Date of Birth must be before today") }) // Ensure date is before today
  )
  .nullable(),

  

  personalEmail: emailValidation(),
workEmail: emailValidation(),

      // employeeNumber: Yup.string(),
      // secondName: Yup.string(),
      // thirdName: Yup.string().nullable(),
      // alternativeFirstName: Yup.string().nullable(),
      // alternativeSecondName: Yup.string().nullable(),
      // alternativeThirdName: Yup.string().nullable(),
      // alternativeLastName: Yup.string().nullable(),
      // religion: Yup.string().nullable(),
      // nationalityCode: Yup.string(),
      // maritalStatus: Yup.string(),
      // highestEducationLevel: Yup.string(),
     
      // passportNumber: Yup.string().nullable(),
      // workMobile: Yup.string(),
      // personalMobile: Yup.string().nullable(),
      // nationalId: Yup.string(),
    });


// Email Validation Function
// const emailValidation = () =>
//   z
//     .string()
//     .email(t('Invalid email format'))
//     .nullable()
//     .optional()
//     .refine(
//       (val) => !(isNotChanged || (!isFieldsEnabled && !iscreate)) || !!val,
//       { message: t('Email is required') }
//     );

// New Personal Schema



    const defaultValues: any = useMemo(
      () => ({
        employeeNumber: currentPersonal?.employeeNumber ?? '',
        approvalStatus: currentPersonal?.approvalStatus ?? 'DRAFT',
        firstName: currentPersonal?.firstName ?? '',
        secondName: currentPersonal?.secondName ?? '',
        thirdName: currentPersonal?.thirdName ?? '',
        lastName: currentPersonal?.lastName ?? '',
        alternativeFirstName: currentPersonal?.alternativeFirstName ?? '',
        alternativeSecondName: currentPersonal?.alternativeSecondName ?? '',
        alternativeThirdName: currentPersonal?.alternativeThirdName ?? '',
        alternativeLastName: currentPersonal?.alternativeLastName ?? '',
        dateOfBirth: currentPersonal?.dateOfBirth ? new Date(currentPersonal.dateOfBirth) : null,
        gender: currentPersonal?.gender ?? '',
        religion: currentPersonal?.religion ?? '',
        nationalityCode: currentPersonal?.nationalityCode ?? '',
        maritalStatus: currentPersonal?.maritalStatus ?? '',
        registeredDisabled: currentPersonal?.registeredDisabled === 1,

        highestEducationLevel: currentPersonal?.highestEducationLevel ?? '',
        workEmail: currentPersonal?.workEmail ?? '',
        personalEmail: currentPersonal?.personalEmail ?? '',
        passportNumber: currentPersonal?.passportNumber ?? '',
        workMobile: currentPersonal?.workMobile ?? '',
        personalMobile: currentPersonal?.personalMobile ?? '',
        nationalId: currentPersonal?.nationalId ?? '',
        changeable: currentPersonal?.changeable ?? '',
        uniqueId: Math.floor(Math.random() * 1000000),
      }),
      [currentPersonal]
    );

    const methods = useForm<any>({
      resolver: zodResolver(NewPersonalSchema),
      defaultValues,
    });
    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;
    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentPersonal ? 'Update success!' : 'Create success!');
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
    const handleSubmitProcess = () => {
      setShowSubmitButton(true); 
      setIsFieldsEnabled(true);
    };
    const handleCancel = () => {
      setShowSubmitButton(false); 
      setIsFieldsEnabled(false);    };

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
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} p={1}>
            {!iscreate && (
        <>
          {showSubmitButton ? (
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
              onClick={submit}
            >
              {t('Submit Personal Info')}
            </Button>
            <Button
      variant="outlined"
      sx={{
        borderRadius: '8px',
        fontWeight: 'bold',
        marginLeft: '10px',
      }}
      onClick={handleCancel} // Updates state to show ActionsButton
    >
      {t('Cancel')}
    </Button>                       </>

          ) : (
            <ActionsButton
              handleOpenDialog={handleSubmitProcess}
              isCreate={iscreate}
              actions={[t('Correct Personal Info')]}
            />
          )}
        </>
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
                  <RHFTextField
                    name="employeeNumber"
                    label={t('Employee Number')}
                    placeholder={t('Employee Number')}
                    onBlur={() => validateFieldOnBlur('employeeNumber')}
                    type="number"
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{
                      inputMode: 'numeric', // For better numeric keyboard on mobile
                    }}
                    disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                </Box>
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
                    sm: 'repeat(4, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="firstName"
                      label={t('First Name')}
                      placeholder={t('First Name')}
                      onBlur={() => validateFieldOnBlur('firstName')}
                      required
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="secondName"
                      label={t('Second Name')}
                      placeholder={t('Second Name')}
                      onBlur={() => validateFieldOnBlur('secondName')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="thirdName"
                      label={t('Third Name')}
                      placeholder={t('Third Name')}
                      onBlur={() => validateFieldOnBlur('thirdName')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="lastName"
                      label={t('Last Name')}
                      placeholder={t('Last Name')}
                      onBlur={() => validateFieldOnBlur('lastName')}
                      required
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="alternativeFirstName"
                      label={t('Alternative First Name')}
                      placeholder={t('Alternative First Name')}
                      onBlur={() => validateFieldOnBlur('alternativeFirstName')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="alternativeSecondName"
                      label={t('Alternative Second Name')}
                      placeholder={t('Alternative Second Name')}
                      onBlur={() => validateFieldOnBlur('alternativeSecondName')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="alternativeThirdName"
                      label={t('Alternative Third Name')}
                      placeholder={t('Alternative Third Name')}
                      onBlur={() => validateFieldOnBlur('alternativeThirdName')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="alternativeLastName"
                      label={t('Alternative Last Name')}
                      placeholder={t('Alternative Last Name')}
                      onBlur={() => validateFieldOnBlur('alternativeLastName')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
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
                    sm: 'repeat(4, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            maxDate={new Date()} // Limits the date selection to today or earlier
                            label={`${t('Date of Birth')} `}
                            value={field.value}
                            format="dd/MM/yyyy"
                            onChange={(newValue) => {
                              field.onChange(newValue);
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
                            disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      required
                      name="gender"
                      // type="gender"
                      label={t('Gender')}
                      placeholder={t('Gender')}
                      onBlur={() => validateFieldOnBlur('gender')}
                      options={
                        !GENDERTypesLoading
                          ? GENDERTypes.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !GENDERTypesLoading
                          ? GENDERTypes.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="religion"
                      // type="religion"
                      label={t('Religion')}
                      placeholder={t('Religion')}
                      onBlur={() => validateFieldOnBlur('religion')}
                      options={
                        !RELIGIONTypesLoading
                          ? RELIGIONTypes.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !RELIGIONTypesLoading
                          ? RELIGIONTypes.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="nationalityCode"
                      // type="nationalityCode"
                      label={t('Nationality')}
                      placeholder={t('Nationality')}
                      onBlur={() => validateFieldOnBlur('nationalityCode')}
                      options={
                        !countriesLoading ? countries.map((option: any) => option.countryCode) : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !countriesLoading
                          ? countries.find((item: any) => item.countryCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.countryName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="maritalStatus"
                      // type="maritalStatus"
                      label={t('Marital Status')}
                      placeholder={t('Marital Status')}
                      onBlur={() => validateFieldOnBlur('maritalStatus')}
                      options={
                        !MARITAL_STATUSTypesLoading
                          ? MARITAL_STATUSTypes.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !MARITAL_STATUSTypesLoading
                          ? MARITAL_STATUSTypes.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>

                  <Box gridColumn="span 1">
                    <RHFAutocomplete
                      name="highestEducationLevel"
                      // type="highestEducationLevel"
                      label={t('Highest Education Level')}
                      placeholder={t('Choose an Highest Education Level')}
                      onBlur={() => validateFieldOnBlur('highestEducationLevel')}
                      options={
                        !EDUCATION_LEVELLoading
                          ? EDUCATION_LEVEL.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !EDUCATION_LEVELLoading
                          ? EDUCATION_LEVEL.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFCheckbox
                      name="registeredDisabled"
                      label={t('Registered')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
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
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="workEmail"
                      label={t('Work Email')}
                      placeholder={t('Work Email')}
                      onBlur={() => validateFieldOnBlur('workEmail')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="personalEmail"
                      label={t('Personal Email')}
                      placeholder={t('Personal Email')}
                      onBlur={() => validateFieldOnBlur('personalEmail')}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="passportNumber"
                      label={t('Passport Number')}
                      placeholder={t('Passport Number')}
                      onBlur={() => validateFieldOnBlur('passportNumber')}
                      type="number"
                      onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric', // For better numeric keyboard on mobile
                      }}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>

                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="workMobile"
                      label={t('Work Mobile')}
                      placeholder={t('Work Mobile')}
                      onBlur={() => validateFieldOnBlur('workMobile')}
                      type="text"
                      inputProps={{
                        inputMode: 'tel', // Ensure numeric keypad for mobile
                        maxLength: 15, // Adjust based on expected phone number format
                        pattern: '[0-9]*', // Optional: Restrict to numeric input
                      }}
                      onInput={(e:any) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
                    />
                  </Box>
                  <Box gridColumn="span 1">
                  <RHFTextField
  name="personalMobile"
  label={t('Personal Mobile')}
  placeholder={t('Personal Mobile')}
  onBlur={() => validateFieldOnBlur('personalMobile')}
  type="text" // Use text to preserve leading zeros
  inputProps={{
    inputMode: 'tel', // Ensures numeric keypad on mobile
    maxLength: 15, // Adjust based on expected phone number format
    pattern: '[0-9]*', // Restrict to numeric input
  }}
  onInput={(e:any) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }}
    disabled={isNotChanged || (!isFieldsEnabled && !iscreate)}
/>

                  </Box>
                  <Box gridColumn="span 1">
                    <RHFTextField
                      name="nationalId"
                      label={t('National ID')}
                      placeholder={t('National ID')}
                      onBlur={() => validateFieldOnBlur('nationalId')}
                      type="number"
                      onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric', // For better numeric keyboard on mobile
                      }}
                      disabled= {isNotChanged || !isFieldsEnabled && !iscreate}
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

export default PersonalNewEditForm;
