import * as Yup from 'yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';

import { Box, Stack } from '@mui/system';
import { Grid, Card } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import {
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
  RHFGlobalTextField,
} from 'src/components/hook-form';

import { IOrganizationsInfo } from 'src/types/organization';

type Props = {
  currentOrganization?: IOrganizationsInfo;
  organizationLoading?: any;
  operation: string;
  locations: any;
  organizations: any;
  persons: any;
  locationsLoading: any;
  organizationsLoading: any;
  personsLoading: any;
};

export interface OrganizationNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const OrganizationNewEditForm = forwardRef<OrganizationNewEditFormHandle, Props>(
  (
    {
      currentOrganization,
      organizationLoading,
      operation,
      locations,
      organizations,
      persons,
      locationsLoading,
      organizationsLoading,
      personsLoading,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const langSchema = Yup.object().shape({
      ...(currentLanguage === 'ar' && {
        AR: Yup.string().required(t('Organization Name is required'))
        .min(3, t('Invalid Organization Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/, t('Invalid Organization Name')),
      }),
      ...(currentLanguage === 'EN' && {
        EN: Yup.string().required(t('Organization Name is required'))
        .min(3, t('Invalid Organization Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/, t('Invalid Organization Name')),
      }),
    });
    const isPending = currentOrganization?.approvalStatus === 'PENDING';

    const isEdit = operation === 'edit';
    const locationIds = useMemo(() => locations.map((loc: any) => loc.locationId), [locations]);

    const NewApprovalSchema = Yup.object().shape({
      organizationName: Yup.mixed().when([], {
        is: () => !isPending,
        then: () => langSchema,
        otherwise: () => Yup.mixed().notRequired(),
      }),
      locationId: Yup.string().when([], {
        is: () => !isPending,
        then: (schema) => schema.required(t('Location is required')),
      }),
      active: Yup.boolean(),
    });

    const defaultValues: any = useMemo(
      () => ({
        organizationId: currentOrganization?.organizationId ?? '',
        organizationName: {
          AR:
            currentOrganization?.organizationsTlDTOS?.find((org) => org.langCode === 'AR')
              ?.organizationName || currentOrganization?.organizationName?.AR,
          EN:
            currentOrganization?.organizationsTlDTOS?.find((org) => org.langCode === 'EN')
              ?.organizationName || currentOrganization?.organizationName?.EN,
        },
        approvalStatus: currentOrganization?.approvalStatus ?? 'DRAFT',
        locationId: locationIds.includes(currentOrganization?.locationId) ? currentOrganization?.locationId : '',

        parentOrgId: currentOrganization?.parentOrgId ?? '',
        managerPersonId: currentOrganization?.managerPersonId ?? '',
        uniqueId:currentOrganization?.uniqueId?? Math.floor(Math.random() * 1000000),

        active: currentOrganization?.active === 1 || currentOrganization?.active === undefined,
      }),
      [currentOrganization]
    );

    const methods = useForm<any>({
      resolver: yupResolver(NewApprovalSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(currentOrganization ? 'Update success!' : 'Create success!');
        router.push(paths.hr.organizations.management);
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

    const organizationName =
      currentLanguage === 'EN' ? 'organizationName.EN' : 'organizationName.AR';

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
                  md: 'repeat(4, 1fr)', // 3 columns on medium screens
                  lg: 'repeat(4, 1fr)', // 4 columns on large screens
                },
              }}
            >
          <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 3' } }}>
          <RHFGlobalTextField
                    InputLabelProps={{ shrink: true }}
                    required
                    name={organizationName}
                    label={t('Organization Name')}
                    onBlur={() => validateFieldOnBlur(organizationName)}
                    fieldName="organizationName"
                    dialogTitle={t('Organization Name')}
                    placeholder={t('Organization Name')}
                    validate={!isPending}
                    disabled={isPending}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 1' } }}>
                <RHFTextField
                    name="approvalStatus"
                    label={t('Approval Status')}
                    required
                    onBlur={() => validateFieldOnBlur('approvalStatus')}
                    disabled
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                <RHFAutocomplete
                  required
                    name="locationId"
                    type="locationId"
                    label={t('Location')}
                    onBlur={() => validateFieldOnBlur('locationId')}
                    placeholder={t('Choose a Location')}
                    options={locations.map((option: any) => option.locationId)}
                    getOptionLabel={(option) => {
                      const selectedOption = locations.find(
                        (item: any) => item.locationId === option
                      );
                      return selectedOption ? selectedOption.locationName : '';
                    }}
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
                    disabled={isPending}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                <RHFAutocomplete
                    name="parentOrgId"
                    type="parentOrgId"
                    label={t('Parent Organization')}
                    onBlur={() => validateFieldOnBlur('parentOrgId')}
                    placeholder={t('Choose a Parent Organization')}
                    options={organizations.map((option: any) => option.organizationId)}
                    getOptionLabel={(option) => {
                      const selectedOption = organizations.find(
                        (item: any) => item.organizationId === option
                      );
                      return selectedOption ? selectedOption.organizationName : '';
                    }}
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
                    disabled={isPending}
                  />
                </Box>
                
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1',md: 'span 2'  } }}>
                <RHFAutocomplete
                    name="managerPersonId"
                    type="managerPersonId"
                    label={t('Manager')}
                    onBlur={() => validateFieldOnBlur('managerPersonId')}
                    placeholder={t('Choose a Manager')}
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
                    disabled={isPending}
                  />
                </Box>
                <Grid sx={{ gridColumn: { xs: 'span 4', sm: 'span 1',md: 'span 2'  } }}>

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

export default OrganizationNewEditForm;
