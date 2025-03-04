import type { DialogProps } from '@mui/material/Dialog';

import { z } from 'zod';
import React from 'react';
import { toast } from 'sonner';
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
import { UseAddFamily, UseEditpersonfamily } from 'src/actions/Hr/family';

import  { RHFCheckbox, RHFTextField, schemaHelper, RHFAutocomplete } from 'src/components/hook-form';



type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  row?: any;
  title:any;
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
  parentId?: any;
  operation?: string;
};
// type FormValues = {
//   newPassword: string;
//   confirmPassword: string;
//   userId: string;
// };
export default function FamilyDialog({ row, open,title, onClose,  MARITAL_STATUSTypesLoading,
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
      parentId,
      operation,
      EDUCATION_LEVEL }: Props) {
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



  // const NewSchema = Yup.object().shape({
  //   parentPersonId: Yup.mixed().nullable(),
  //   personId: Yup.mixed().required(),
  //   relationshipType: Yup.mixed().nullable(),
  //   approvalStatus: Yup.string().required(t('Approval Status is required')),
  //   firstName: Yup.string().required(t('First Name is required')),
  //   secondName: Yup.string().nullable(),
  //   thirdName: Yup.string().nullable(),
  //   lastName: Yup.string().required(t('Last Name is required')),
  //   alternativeFirstName: Yup.string().nullable(),
  //   alternativeSecondName: Yup.string().nullable(),
  //   alternativeThirdName: Yup.string().nullable(),
  //   alternativeLastName: Yup.string().nullable(),
  //   dateOfBirth: Yup.date().nullable(),
  //   age: Yup.string().nullable(),
  //   maritalStatus: Yup.string().nullable(),
  //   gender: Yup.string().required(t('Gender is required')),
  //   religion: Yup.string().nullable(),
  //   nationalityCode: Yup.string().nullable(),
  //   registeredDisabled: Yup.boolean().nullable(),
  //   highestEducationLevel: Yup.string().nullable(),
  //   passportNumber: Yup.string().nullable(),
  //   nationalId: Yup.string().nullable(),
  //   personalEmail: Yup.string()
  // .nullable() // Allows null values
  // .notRequired() // Not required
  // .test(
  //   'is-valid-email',
  //   t('Email must be a valid email address.'),
  //   (value) => {
  //     if (!value) return true; // Skip validation if empty (null or "")
  //     return /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(value); // Validate if not empty
  //   }
  // ),

  
  //   personalMobile: Yup.string().nullable(),
  // });
  const NewSchema = z.object({
    parentPersonId: schemaHelper.nullableInput(z.any()),
    personId: z.any().refine((val) => val !== null && val !== undefined, {
      message: t('Person ID is required'),
    }),
    relationshipType: schemaHelper.nullableInput(z.any()),
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
  
  const { 
    parentPersonId,
    personId,
    firstName,
    secondName,
    thirdName,
    lastName,
    alternativeFirstName,  
    alternativeSecondName,  
    alternativeThirdName,
    alternativeLastName,
    dateOfBirth,
    age,
    maritalStatus, 
    gender,
    religion,
    nationalityCode, 
    registeredDisabled, 
    highestEducationLevel, 
    passportNumber,
    nationalId,
    personalEmail, 
    personalMobile, 
    approvalStatus,
    relationshipType 
  } = row || {}; // Destructure row with defaults
  
  // const defaultValues = useMemo(() => ({
  //   parentPersonId: parentPersonId || '',
  //   personId: personId ?? '',
  //   relationshipType: relationshipType ?? '',
  //   approvalStatus: approvalStatus ?? 'DRAFT',
  //   firstName: firstName ?? '',
  //   secondName: secondName ?? '',
  //   thirdName: thirdName ?? '',
  //   lastName: lastName ?? '',
  //   alternativeFirstName: alternativeFirstName ?? '',
  //   alternativeSecondName: alternativeSecondName ?? '',
  //   alternativeThirdName: alternativeThirdName ?? '',
  //   alternativeLastName: alternativeLastName ?? '',
  //   dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
  //   age: age ?? null,
  //   maritalStatus: maritalStatus ?? '',
  //   gender: gender ?? '',
  //   religion: religion ?? '',
  //   nationalityCode: nationalityCode ?? '',
  //   registeredDisabled: registeredDisabled ?? false,
  //   highestEducationLevel: highestEducationLevel ?? '',
  //   passportNumber: passportNumber ?? '',
  //   nationalId: nationalId ?? '',
  //   personalEmail: personalEmail ?? '',
  //   personalMobile: personalMobile ?? '',
  // }), [
  //   parentPersonId, personId, relationshipType, approvalStatus, firstName, secondName, thirdName,
  //   lastName, alternativeFirstName, alternativeSecondName, alternativeThirdName, alternativeLastName,
  //   dateOfBirth, age, maritalStatus, gender, religion, nationalityCode, registeredDisabled, highestEducationLevel,
  //   passportNumber, nationalId, personalEmail, personalMobile
  // ]);
  
  const methods = useForm({
    resolver: zodResolver(NewSchema),
    defaultValues: {
      parentPersonId:     parentPersonId
    
    ||parentId,
      personId: personId ?? '',
      relationshipType: relationshipType ?? '',
      approvalStatus: approvalStatus ?? 'DRAFT',
      firstName: firstName ?? '',
      secondName: secondName ?? '',
      thirdName: thirdName ?? '',
      lastName: lastName ?? '',
      alternativeFirstName: alternativeFirstName ?? '',
      alternativeSecondName: alternativeSecondName ?? '',
      alternativeThirdName: alternativeThirdName ?? '',
      alternativeLastName: alternativeLastName ?? '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      age: age ?? null,
      maritalStatus: maritalStatus ?? '',
      gender: gender ?? '',
      religion: religion ?? '',
      nationalityCode: nationalityCode ?? '',
      registeredDisabled: registeredDisabled ?? false,
      highestEducationLevel: highestEducationLevel ?? '',
      passportNumber: passportNumber ?? '',
      nationalId: nationalId ?? '',
      personalEmail: personalEmail ?? '',
      personalMobile: personalMobile ?? '',
    },
  });
  
  
  const isView=operation==="View Person";
  const ispending=approvalStatus==="PENDING";
  const { handleSubmit,trigger } = methods;
  
  const onSubmit = handleSubmit(async () => {
    const data = formData();
  
    // Ensure `data` is an object before accessing its properties
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const transformedData = {
        ...data,
        registeredDisabled: data.registeredDisabled ? 1 : 0,
      };
  
      console.log('transformedData', transformedData);
  
      try {
        let res;
        if (operation === "Add Family") {
           res = await UseAddFamily([transformedData]);
        }
        else if (operation === "Correct Person") {
          res = await UseEditpersonfamily(transformedData);

        }
  
        if (res && res.status === 200) {
          toast.success(t(`${title} ${t("action completed successfully!")}`));
          onClose();
        }
      } catch (error:any) {
        toast.error(error.message);
      }
    } else {
      console.error('Invalid form data:', data);
    }
  });
  

  const validateFieldOnBlur = async (name:any) => {
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
             <Grid container>
                   <Grid item xs={12} md={12}>
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
                           <RHFAutocomplete
                             name='relationshipType'
                            //  type="relationshipType"
                             label={t('Relationship')}
                             placeholder={t('Choose an Relationship')}
                             onBlur={() => validateFieldOnBlur('relationshipType')}
                             options={
                               !RELATIONSHIP_TYPELoading
                                 ? RELATIONSHIP_TYPE.map((option: any) => option.valueCode)
                                 : []
                             }
                             getOptionLabel={(option) => {
                               const selectedOption = !RELATIONSHIP_TYPELoading
                                 ? RELATIONSHIP_TYPE.find((item: any) => item.valueCode === option)
                                 : undefined;
                               return selectedOption ? selectedOption.valueName : '';
                             }}
                             isOptionEqualToValue={(option, value) =>
                               value === null || value === undefined ? true : option === value
                             }
                              disabled={isView||ispending}
                           />
                         </Box>

                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='approvalStatus'
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
                             name='firstName'
                             label={t('First Name')}
                             placeholder={t('First Name')}
                             onBlur={() => validateFieldOnBlur('firstName')}
                             required
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='secondName'
                             label={t('Second Name')}
                             placeholder={t('Second Name')}
                             onBlur={() => validateFieldOnBlur('secondName')}
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='thirdName'
                             label={t('Third Name')}
                             placeholder={t('Third Name')}
                             onBlur={() => validateFieldOnBlur('thirdName')}
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='lastName'
                             label={t('Last Name')}
                             placeholder={t('Last Name')}
                             onBlur={() => validateFieldOnBlur('lastName')}
                             required
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='alternativeFirstName'
                             label={t('Alternative First Name')}
                             placeholder={t('Alternative First Name')}
                             onBlur={() => validateFieldOnBlur('alternativeFirstName')}
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='alternativeSecondName'
                             label={t('Alternative Second Name')}
                             placeholder={t('Alternative Second Name')}
                             onBlur={() => validateFieldOnBlur('alternativeSecondName')}
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='alternativeThirdName'
                             label={t('Alternative Third Name')}
                             placeholder={t('Alternative Third Name')}
                             onBlur={() => validateFieldOnBlur('alternativeThirdName')}
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='alternativeLastName'
                             label={t('Alternative Last Name')}
                             placeholder={t('Alternative Last Name')}
                             onBlur={() => validateFieldOnBlur('alternativeLastName')}
                             disabled={isView||ispending}
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
                               name='dateOfBirth'
                              // control={control}
                               render={({ field, fieldState: { error } }) => (
                                 <DatePicker
                                   maxDate={new Date()} // Limits the date selection to today or earlier
                                   label={`${t('Date of Birth')} `}
                                   value={field.value}
                                   format="dd/MM/yyyy"
                                   onChange={(newValue) => {
                                     field.onChange(newValue);
                                     validateFieldOnBlur('dateOfBirth');
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
                                   disabled={isView||ispending}
                                   />
                               )}
                             />
                           </LocalizationProvider>
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='age'
                             label={t('Age')}
                             placeholder={t('Age')}
                             onBlur={() => validateFieldOnBlur('age')}
                             type="number"
                             onKeyDown={(e) => {
                               if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                 e.preventDefault();
                               }
                             }}
                             inputProps={{
                               inputMode: 'numeric', // For better numeric keyboard on mobile
                             }}
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFAutocomplete
                             name='highestEducationLevel'
                            //  type="highestEducationLevel"
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
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFAutocomplete
                             name='maritalStatus'
                            //  type="maritalStatus"
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
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFAutocomplete
                             required
                             name='gender'
                            //  type="gender"
                             label={t('Gender')}
                             placeholder={t('Gender')}
                             onBlur={() => validateFieldOnBlur('gender')}
                             options={
                               !GENDERTypesLoading ? GENDERTypes.map((option: any) => option.valueCode) : []
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
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFAutocomplete
                             name='religion'
                            //  type="religion"
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
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFAutocomplete
                             name='nationalityCode'
                            //  type="nationalityCode"
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
                             disabled={isView||ispending}
                             />
                         </Box>

                         <Box gridColumn="span 1">
                           <RHFCheckbox
                             name='registeredDisabled'
                             label={t('Registered')}
                             disabled={isView||ispending}
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
                           sm: 'repeat(2, 1fr)',
                         }}
                       >
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='passportNumber'
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
                             disabled={isView||ispending}
                             />
                         </Box>

                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='personalEmail'
                             label={t('Personal Email')}
                             placeholder={t('Personal Email')}
                             onBlur={() => validateFieldOnBlur('personalEmail')}
                             disabled={isView||ispending}
                             />
                         </Box>

                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='nationalId'
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
                             disabled={isView||ispending}
                             />
                         </Box>
                         <Box gridColumn="span 1">
                           <RHFTextField
                             name='personalMobile'
                             label={t('Personal Mobile')}
                             placeholder={t('Personal Mobile')}
                             onBlur={() => validateFieldOnBlur('personalMobile')}
                             type="text"
                             inputProps={{
                               inputMode: 'tel', // Ensure numeric keypad for mobile
                               maxLength: 15, // Adjust based on expected phone number format
                               pattern: '[0-9]*', // Optional: Restrict to numeric input
                             }}
                             onInput={(e:any) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            disabled={isView||ispending}
                            />
                         </Box>
                       </Box>
                     </Card>
                   </Grid>
                 </Grid>
          </Grid>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        {onClose &&  (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('Close')}
          </Button>
        )}
        {
          operation!=='View Person'&&(
<Button variant="contained" color="success" onClick={onSubmit}                               disabled={isView||ispending}
>
          {t('Save')} 
        </Button>
          )
        }
        
      </DialogActions>
    </Dialog>
  );
}