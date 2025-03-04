import type { IOrganizationsInfo } from 'src/types/organization';

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

import FieldSkeleton from 'src/components/Form/field-skelton';
import {RHFGlobalTextField} from 'src/components/hook-form/rhf-global-text-field';
import {
  RHFCheckbox,
  RHFTextField,
  schemaHelper,
  RHFAutocomplete,
} from 'src/components/hook-form';

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
    const langSchema = z.object({
      AR:
        currentLanguage === 'ar'
          ? z
              .string()
              .min(1, { message: t('Organization Name is required') })

              .min(3, { message: t('Invalid Organization Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Organization Name'),
                }
              )
              .nonempty({ message: t('Organization Name is required') }) // Equivalent to `required`
          : z.string().optional(),

      EN:
        currentLanguage === 'en'
          ? z
              .string()
              .min(1, { message: t('Organization Name is required') })
              .min(3, { message: t('Invalid Organization Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Organization Name'),
                }
              )
              .nonempty({ message: t('Organization Name is required') })
          : z.string().optional(),
    });
   
    const isPending = currentOrganization?.approvalStatus === 'PENDING';

    const isEdit = operation === 'edit';
    const locationIds = useMemo(() =>locationsLoading?[]: locations.map((loc: any) => loc.locationId), [locationsLoading,locations]); 
    const NewApprovalSchema = z.object({
      organizationName: isPending ? z.any().optional() : langSchema, // Conditionally apply langSchema
      locationId: schemaHelper.nullableInput(
        isPending
          ? z.string().optional()
          : z.union([z.string(), z.number()]).refine(
              (val) => val !== null && String(val).trim() !== "",
              { message: t("Location is required") }
            ),
            { message: t("Location is required") }
      ),
      
      active: z.boolean(),
    });

    const defaultValues: any = useMemo(
      () => ({
        organizationId: currentOrganization?.organizationId ?? '',
        organizationName: {
          AR:
            currentOrganization?.organizationsTlDTOS?.find((org) => org.langCode === 'AR')
              ?.organizationName || currentOrganization?.organizationName?.AR||'',
          EN:
            currentOrganization?.organizationsTlDTOS?.find((org) => org.langCode === 'EN')
              ?.organizationName || currentOrganization?.organizationName?.EN||'',
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
      resolver: zodResolver(NewApprovalSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentOrganization ? 'Update success!' : 'Create success!');
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
        const isValid = await methods.trigger(undefined, { shouldFocus: true });
    
        if (!isValid) {
          const errors = methods.formState.errors;
          console.error("Validation Errors:", errors);
        }
    
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
      currentLanguage === 'en' ? 'organizationName.EN' : 'organizationName.AR';

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
                {(!locationsLoading&&locations)?(             

                <RHFAutocomplete
                  required
                    name="locationId"
                    // type="locationId"
                    label={t('Location')}
                    onBlur={() => validateFieldOnBlur('locationId')}
                    placeholder={t('Choose a Location')}
                    options={!locationsLoading?locations.map((option: any) => option.locationId):[]}
                    getOptionLabel={(option) => {
                      const selectedOption =!locationsLoading? locations.find(
                        (item: any) => item.locationId === option
                      ):undefined;
                      return selectedOption ? selectedOption.locationName : '';
                    }}
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
                    disabled={isPending}
                  />
                ):
                ( <FieldSkeleton />)
                }
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  {(!organizationLoading&&organizations)?(
                <RHFAutocomplete
                    name="parentOrgId"
                    // type="parentOrgId"
                    label={t('Parent Organization')}
                    onBlur={() => validateFieldOnBlur('parentOrgId')}
                    placeholder={t('Choose a Parent Organization')}
                    options={!organizationLoading?organizations.map((option: any) => option.organizationId):[]}
                    getOptionLabel={(option) => {
                      const selectedOption = !organizationLoading?organizations.find(
                        (item: any) => item.organizationId === option
                      ):undefined;
                      return selectedOption ? selectedOption.organizationName : '';
                    }}
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
                    disabled={isPending}
                  />
                ):
                ( <FieldSkeleton />)
                }
                </Box>
                
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1',md: 'span 2'  } }}>
                  {(!personsLoading&&persons)?(
                <RHFAutocomplete
                    name="managerPersonId"
                    // type="managerPersonId"
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
                ):
                ( <FieldSkeleton />)
                }
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
