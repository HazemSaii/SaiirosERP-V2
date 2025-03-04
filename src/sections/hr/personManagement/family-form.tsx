import { useState, forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Grid, Card } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { useLocales, useTranslate } from 'src/locales';

import FormSkeleton from 'src/components/Form/form-skelton';
import { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IFamilyInfo } from 'src/types/persons';

interface familyFormProps {
  itemKey: any;
  index: any;
  currentFamily?: IFamilyInfo;
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
  operation: string;
  submit: any;
}

const FamilyForm = forwardRef<HTMLDivElement, familyFormProps>(
  (
    {
      itemKey,
      index,
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
      isNotChanged,
      EDUCATION_LEVEL,
      submit,
    },
    ref
  ) => {
    const { control, watch, trigger } = useFormContext(); // Added control
    const [showFields, setShowFields] = useState(false);
    const toggleFieldsVisibility = () => {
      setShowFields(!showFields);
    };
    const { t } = useTranslate();
    const approvalStatus = watch(`familyDTOS[${index}].approvalStatus`);

    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    const isEdit = operation === 'edit';
    const ispending = approvalStatus === 'PENDING';
    console.log('approvalStatus', approvalStatus);

    const validateFieldOnBlur = async (name: string) => {
      try {
        const isValid = await trigger(name);
        return isValid;
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false;
      }
    };

    const render_skeleton = [...Array(1)].map((_, i) => (
      <FormSkeleton key={index} fields={1} />
    ));
    return (
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
                  name={`familyDTOS[${index}].relationshipType`}
                  // type="relationshipType"
                  label={t('Relationship')}
                  placeholder={t('Choose an Relationship')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].relationshipType`)}
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
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>

              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].approvalStatus`}
                  label={t('Approval Status')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].approvalStatus`)}
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
                  name={`familyDTOS[${index}].firstName`}
                  label={t('First Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].firstName`)}
                  required
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].secondName`}
                  label={t('Second Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].secondName`)}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].thirdName`}
                  label={t('Third Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].thirdName`)}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].lastName`}
                  label={t('Last Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].lastName`)}
                  required
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].alternativeFirstName`}
                  label={t('Alternative First Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].alternativeFirstName`)}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].alternativeSecondName`}
                  label={t('Alternative Second Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].alternativeSecondName`)}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].alternativeThirdName`}
                  label={t('Alternative Third Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].alternativeThirdName`)}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].alternativeLastName`}
                  label={t('Alternative Last Name')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].alternativeLastName`)}
                  disabled={(ispending && isEdit) || isNotChanged}
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
                    name={`familyDTOS[${index}].dateOfBirth`}
                   // control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        maxDate={new Date()} // Limits the date selection to today or earlier
                        label={`${t('Date of Birth')} `}
                        value={field.value}
                        format="dd/MM/yyyy"
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          validateFieldOnBlur(`familyDTOS[${index}].dateOfBirth`);
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
                        disabled={(ispending && isEdit) || isNotChanged}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].age`}
                  label={t('Age')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].age`)}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric', // For better numeric keyboard on mobile
                  }}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFAutocomplete
                  name={`familyDTOS[${index}].highestEducationLevel`}
                  // type="highestEducationLevel"
                  label={t('Highest Education Level')}
                  placeholder={t('Choose an Highest Education Level')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].highestEducationLevel`)}
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
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFAutocomplete
                  name={`familyDTOS[${index}].maritalStatus`}
                  // type="maritalStatus"
                  label={t('Marital Status')}
                  placeholder={t('Marital Status')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].maritalStatus`)}
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
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFAutocomplete
                  required
                  name={`familyDTOS[${index}].gender`}
                  // type="gender"
                  label={t('Gender')}
                  placeholder={t('Gender')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].gender`)}
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
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFAutocomplete
                  name={`familyDTOS[${index}].religion`}
                  // type="religion"
                  label={t('Religion')}
                  placeholder={t('Religion')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].religion`)}
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
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFAutocomplete
                  name={`familyDTOS[${index}].nationalityCode`}
                  // type="nationalityCode"
                  label={t('Nationality')}
                  placeholder={t('Nationality')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].nationalityCode`)}
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
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>

              <Box gridColumn="span 1">
                <RHFCheckbox
                  name={`familyDTOS[${index}].registeredDisabled`}
                  label={t('Registered')}
                  disabled={(ispending && isEdit) || isNotChanged}
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
                  name={`familyDTOS[${index}].passportNumber`}
                  label={t('Passport Number')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].passportNumber`)}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric', // For better numeric keyboard on mobile
                  }}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>

              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].personalEmail`}
                  label={t('Personal Email')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].personalEmail`)}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>

              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].nationalId`}
                  label={t('National ID')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].nationalId`)}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric', // For better numeric keyboard on mobile
                  }}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
              <Box gridColumn="span 1">
                <RHFTextField
                  name={`familyDTOS[${index}].personalMobile`}
                  label={t('Personal Mobile')}
                  onBlur={() => validateFieldOnBlur(`familyDTOS[${index}].personalMobile`)}
                  type="tel"
                  inputProps={{
                    inputMode: 'tel', // Ensure numeric keypad for mobile
                    maxLength: 15, // Adjust based on expected phone number format
                    pattern: '[0-9]*', // Optional: Restrict to numeric input
                  }}
                  disabled={(ispending && isEdit) || isNotChanged}
                />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  }
);

export default FamilyForm;
