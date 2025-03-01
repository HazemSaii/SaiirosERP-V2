import type { ILocationsInfo } from 'src/types/locations';

import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';

import { Box, Stack } from '@mui/system';
import { Grid, Card } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import RHFGlobalTextField from 'src/components/hook-form/rhf-global-text-field';
import { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

type Props = {
  currentLocation?: ILocationsInfo;
  locationLoading?: any;
  operation: string;
  countries: any;
  countriesLoading: any;
};

export interface LocationNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const LocationNewEditForm = forwardRef<LocationNewEditFormHandle, Props>(
  ({ currentLocation, operation, countries, countriesLoading }, ref) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    console.log('currentLanguage', currentLanguage);

    const router = useRouter();
    const langSchema = z.object({
      AR:
        currentLanguage === 'ar'
          ? z
              .string()
              .min(1, { message: t('Location Name is required') })

              .min(3, { message: t('Invalid Location Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Location Name'),
                }
              )
              .nonempty({ message: t('Location Name is required') }) // Equivalent to `required`
          : z.string().optional(),

      EN:
        currentLanguage === 'en'
          ? z
              .string()
              .min(1, { message: t('Location Name is required') })
              .min(3, { message: t('Invalid Location Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Location Name'),
                }
              )
              .nonempty({ message: t('Location Name is required') })
          : z.string().optional(),
    });

    const isPending = currentLocation?.approvalStatus === 'PENDING';
    const isEdit = operation === 'edit';

    const NewApprovalSchema = z.object({
      locationName: langSchema, // approvalStatus: z.string().min(1, { message: t('Approval Status is required') }),
      countryCode: z.string().min(1, { message: t('Country is required') }),
      // city: z.string().min(1, { message: t('City is required') }),
      addressLine1: z.string().min(1, { message: t('Address Line 1 is required') }),
      addressLine2: z
        .string()
        .nullable()
        .optional()
        .refine(
          (value) => {
            if (!value || value.trim() === '') return true; // Skip validation if empty/null
            return /^[A-Za-z0-9\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s]{2}[A-Za-z0-9\u0600-\u06FF\s@#$%^&*()]*$/.test(
              value
            );
          },
          { message: t('Invalid Address') }
        ),

      active: z.boolean().optional(), // Optional boolean value
    });

    // Default values

    const defaultValues = useMemo(
      () => ({
        locationId: currentLocation?.locationId ?? 0,
        locationName: {
          AR:
            currentLocation?.locationTlDTOS?.find((loc) => loc.langCode === 'AR')?.locationName ||
            '',
          EN:
            currentLocation?.locationTlDTOS?.find((loc) => loc.langCode === 'EN')?.locationName ||
            '',
        },
        approvalStatus: currentLocation?.approvalStatus ?? 'DRAFT',
        countryCode: currentLocation?.countryCode ?? '',
        city: currentLocation?.city ?? '',
        addressLine1: currentLocation?.addressLine1 ?? '',
        addressLine2: currentLocation?.addressLine2 ?? '',
        poBox: currentLocation?.poBox ?? '',
        active: currentLocation?.active === 1 || currentLocation?.active === undefined,
        uniqueId: currentLocation?.uniqueId ?? Math.floor(Math.random() * 1000000),
      }),
      [currentLocation]
    );

    const methods = useForm<any>({
      resolver: zodResolver(NewApprovalSchema),
      defaultValues,
    });

    const { reset, handleSubmit, trigger } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentLocation ? 'Update success!' : 'Create success!');
        router.push(paths.hr.locations.management);
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
        return await trigger();
      } catch (error) {
        console.error('Form validation error:', error);
        return false;
      }
    };

    const formData = () => {
      try {
        return methods.watch();
      } catch (error) {
        console.error('Form data error:', error);
        return false;
      }
    };

    // const validateFieldOnBlur = async (name: any) => {
    //   try {
    //     return await trigger(name);
    //   } catch (error) {
    //     console.error(`Validation error on ${name}:`, error);
    //     return false;
    //   }
    // };
    const validateFieldOnBlur = useMemo(
      () => async (name: string) => {
        try {
          return await trigger(name);
        } catch (error) {
          console.error(`Validation error on ${name}:`, error);
          return false;
        }
      },
      [trigger]
    );

    const LocationName = currentLanguage === 'en' ? 'locationName.EN' : 'locationName.AR';
    console.log('LocationName', LocationName);

    return (
      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                display="grid"
                gap={2}
                sx={{
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)', // 1 column on extra-small screens
                    sm: 'repeat(2, 1fr)', // 2 columns on small screens
                    md: 'repeat(3, 1fr)', // 3 columns on medium screens
                    lg: 'repeat(4, 1fr)', // 4 columns on large screens
                  },
                }}
              >
                {/* Location Name - Expands on larger screens */}
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 2', md: 'span 3' } }}>
                  <RHFGlobalTextField
                    name={LocationName}
                    label={t('Location Name')}
                    onBlur={() => validateFieldOnBlur(LocationName)}
                    fieldName="locationName"
                    dialogTitle={t('Location Name')}
                    placeholder={t('Location Name')}
                    validate
                    disabled={isPending || isEdit}
                    required
                  />
                </Box>

                {/* Approval Status */}
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 2', md: 'span 1' } }}>
                  <RHFTextField
                    name="approvalStatus"
                    label={t('Approval Status')}
                    required
                    onBlur={() => validateFieldOnBlur('approvalStatus')}
                    disabled
                  />
                </Box>

                {/* Country Code - Stretches on large screens */}
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 2', md: 'span 2' } }}>
                  <RHFAutocomplete
                    required
                    name="countryCode"
                    label={t('Country')}
                    placeholder={t('Choose Country')}
                    onBlur={() => validateFieldOnBlur('countryCode')}
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
                    disabled={isPending}
                  />
                </Box>

                {/* City - Adjusts based on screen size */}
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 2', md: 'span 2' } }}>
                  <RHFTextField
                    name="city"
                    label={t('City')}
                    onBlur={() => validateFieldOnBlur('city')}
                    disabled={isPending}
                  />
                </Box>

                {/* Address Line 1 - Always full width */}
                <Box sx={{ gridColumn: 'span 4' }}>
                  <RHFTextField
                    name="addressLine1"
                    label={t('Address Line 1')}
                    placeholder={t('Address Line 1')}
                    onBlur={() => validateFieldOnBlur('addressLine1')}
                    disabled={isPending}
                    required
                  />
                </Box>

                {/* Address Line 2 - Full width, optional */}
                <Box sx={{ gridColumn: 'span 4' }}>
                  <RHFTextField
                    name="addressLine2"
                    label={t('Address Line 2')}
                    placeholder={t('Address Line 2')}
                    onBlur={() => validateFieldOnBlur('addressLine2')}
                    disabled={isPending}
                  />
                </Box>

                {/* PO Box - Smaller but still responsive */}
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 2', md: 'span 2' } }}>
                  <RHFTextField
                    name="poBox"
                    label={t('PO Box')}
                    placeholder={t('PO Box')}
                    onBlur={() => validateFieldOnBlur('poBox')}
                    disabled={isPending}
                  />
                </Box>

                {/* Checkbox - Takes a full row */}
                <Grid sx={{ gridColumn: { xs: 'span 4', sm: 'span 2', md: 'span 2' } }}>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <RHFCheckbox name="active" label={t('Active')} disabled={isPending} />
                  </Stack>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default LocationNewEditForm;
