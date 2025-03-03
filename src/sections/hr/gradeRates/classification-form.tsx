import dayjs from 'dayjs';
import { forwardRef } from 'react';
import { usePopover } from 'minimal-shared/hooks';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import {Iconify} from 'src/components/iconify';
import FormSkeleton from 'src/components/Form/form-skelton';
import { CustomPopover } from 'src/components/custom-popover';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';
import { RHFSelect, RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

interface ClassificationFormProps {
  itemKey: any;
  index: any;
  organizations: any[];
  organizationsValidating?: boolean;
  operation?: string;
  current?: any;
  gradeRateType?: string;
  gradeRateUnit?: string;
}

const ClassificationForm = forwardRef<HTMLDivElement, ClassificationFormProps>(
  (
    {
      itemKey,
      index,
      organizations,
      organizationsValidating,
      operation,
      current,
      gradeRateType,
      gradeRateUnit,
    },
    ref
  ) => {
    const { control, watch, trigger } = useFormContext(); // Added control
    const popover = usePopover();
    const recordInfo = useBoolean();
    const isEdit = operation === 'edit';
    const isPending = current?.approvalStatus === 'PENDING';
    const { t } = useTranslate();

    // Watch all the classification codes to get selected values
    const selectedClassificationCodes = watch('gradeRatesDetailsDTOS').map(
      (item: any) => item.currencyCode
    );

    const currencyCode = watch(`gradeRatesDetailsDTOS[${index}].currencyCode`);

    // Conditionally filter only in edit mode
    const availableOrganizations = organizations.filter(
      (org) =>
        !selectedClassificationCodes.includes(org.currencyCode) || org.currencyCode === currencyCode
    );
    const {setValue } = useFormContext(); // Ensure setValue is used

const validateFieldOnBlur = async (name: string) => {
  try {
    const value = watch(name);

    if (!value) {
      setValue(name, "", { shouldValidate: true }); // Force validation on empty field
    }

    await trigger(name); // Ensure validation runs
  } catch (error) {
    console.error(`Validation error on ${name}:`, error);
  }
};

    
    
    
    

    // Watch the values of the form fields
    const createdByUserName = watch(`gradeRatesDetailsDTOS[${index}].createdByUserName`);
    const updatedByUserName = watch(`gradeRatesDetailsDTOS[${index}].updatedByUserName`);
    const createdDate = watch(`gradeRatesDetailsDTOS[${index}].createdDate`);
    const updatedDate = watch(`gradeRatesDetailsDTOS[${index}].updatedDate`);
    const render_skeleton = [...Array(1)].map((_, i) => (
      <FormSkeleton key={i} fields={2} />
    ));

    return (
      <Stack alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
        {organizationsValidating ? (
          render_skeleton
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', mb: 3 }}>
            <Controller
  control={control}
  name={`gradeRatesDetailsDTOS[${index}].startDate`}
  render={({ field, fieldState: { error } }) => (
    <DatePicker
      disabled={isPending}
      minDate={dayjs()} // Ensure minDate is a Dayjs instance
      label={`${t('Date From')} *`}
      value={field.value ? dayjs(field.value) : null} // Convert Date to Dayjs
      format="DD/MM/YYYY"
      onChange={(newValue) => {
        field.onChange(newValue ? newValue.toDate() : null); // Convert Dayjs back to Date
        validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].startDate`);
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!error,
          helperText: error?.message,
        },
        field: { clearable: true },
      }}
    />
  )}
/>

<Controller
  control={control}
  name={`gradeRatesDetailsDTOS[${index}].endDate`}
  render={({ field, fieldState: { error } }) => (
    <DatePicker
      disabled={isPending}
      minDate={dayjs()} // Use dayjs() for minDate
      label={t('Date TO')}
      value={field.value ? dayjs(field.value) : null} // Convert Date to Dayjs
      format="DD/MM/YYYY"
      onChange={(newValue) => {
        field.onChange(newValue ? newValue.toDate() : null); // Convert Dayjs to Date
        validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].endDate`);
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!error,
          helperText: error?.message,
        },
        field: { clearable: true },
      }}
    />
  )}
/>

            {gradeRateUnit === 'Money' ? (
              <RHFAutocomplete
              required
              name={`gradeRatesDetailsDTOS[${index}].currencyCode`}
              label={t('Currency')}
              placeholder={t('Currency')}
              onBlur={() => validateFieldOnBlur('countryCode')}
              options={
                !organizationsValidating ? availableOrganizations.map((option: any) => option.currencyCode) : []
              }
              getOptionLabel={(option) => {
                const selectedOption = !organizationsValidating
                  ? availableOrganizations.find((item: any) => item.currencyCode === option)
                  : undefined;
                return selectedOption ? selectedOption.currencyName : '';
              }}
              isOptionEqualToValue={(option, value) =>
                value === null || value === undefined ? true : option === value
              }
              disabled={isPending}
            />
              // <RHFAutocomplet
              //   required
              //   name={`gradeRatesDetailsDTOS[${index}].currencyCode`}
              //   size="small"
              //   label={t('Currency')}
              //   InputLabelProps={{ shrink: true }}
              //   onBlur={() => validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].currencyCode`)}
              //   disabled={isPending}
              //   sx={{
              //     height: 50,
              //     '& .MuiInputBase-root': {
              //       height: '100%',
              //     },
              //   }}
              // >
              //   {availableOrganizations.map((org) => (
              //     <MenuItem key={org.currencyCode} value={org.currencyCode}>
              //       {org.currencyName}
              //     </MenuItem>
              //   ))}
              // </RHFAutocomplet>
            ) : null}
            {gradeRateType === 'VALUE' ? (
              <RHFTextField
                required
                disabled={isPending}
                name={`gradeRatesDetailsDTOS[${index}].gradeRateValue`}
                label={t('Value')}
                type="number"
                onKeyDown={(e) => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                    e.preventDefault();
                  }
                }}
                inputProps={{
                  inputMode: 'numeric', // For better numeric keyboard on mobile
                }}
                onBlur={() => validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].gradeRateValue`)}
              />
            ) : null}
            {gradeRateType === 'RANGE' ? (
              <>
                <RHFTextField
                  required
                  disabled={isPending}
                  type="number"
                  name={`gradeRatesDetailsDTOS[${index}].gradeRateFrom`}
                  label={t('From')}
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric', // For better numeric keyboard on mobile
                  }}
                  onBlur={() =>
                    validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].gradeRateFrom`)
                  }
                />
                <RHFTextField
                  required
                  disabled={isPending}
                  name={`gradeRatesDetailsDTOS[${index}].gradeRateTo`}
                  label={t('To')}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric', // For better numeric keyboard on mobile
                  }}
                  onBlur={() => validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].gradeRateTo`)}
                />
                <RHFTextField
                  required
                  disabled={isPending}
                  name={`gradeRatesDetailsDTOS[${index}].midValue`}
                  label={t('Mid')}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{
                    inputMode: 'numeric', // For better numeric keyboard on mobile
                  }}
                  onBlur={() => validateFieldOnBlur(`gradeRatesDetailsDTOS[${index}].midValue`)}
                />
              </>
            ) : null}

            <RHFCheckbox
              name={`gradeRatesDetailsDTOS[${index}].active`}
              label={t('Active')}
              disabled={isPending}
            />
            <RecordInfoDialog
              createdBy={createdByUserName}
              creationDate={createdDate}
              updateBy={updatedByUserName}
              updateDate={updatedDate}
              open={recordInfo.value}
              onClose={recordInfo.onFalse}
            />

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>

            <CustomPopover
              anchorEl={popover.anchorEl}
              open={popover.open}
              onClose={popover.onClose}
              slotProps={{ arrow: { placement: 'right-top' } }}
              sx={{ width: 200 }}
            >
              <Divider />
              <MenuItem
                onClick={() => {
                  recordInfo.onTrue();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:info-circle-bold" />
                {t('Record Info')}
              </MenuItem>
            </CustomPopover>
          </Stack>
        )}
      </Stack>
    );
  }
);

export default ClassificationForm;
