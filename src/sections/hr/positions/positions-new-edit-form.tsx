import type { IPositionsInfo } from 'src/types/position';

import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, useState, forwardRef, useImperativeHandle } from 'react';

import { Stack } from '@mui/system';
import { Grid, Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales } from 'src/locales';

import FieldSkeleton from 'src/components/Form/field-skelton';
import { RHFGlobalTextField } from 'src/components/hook-form/rhf-global-text-field';
import { RHFCheckbox, RHFTextField, schemaHelper, RHFAutocomplete } from 'src/components/hook-form';

import EmployeesDialog from './employees-list-dialog';

type Props = {
  currentPosition?: IPositionsInfo;
  operation: string;
  positionSTATUS: any;
  positionSTATUSLoading: any;
  organizations?: any;
  organizationsValidating?: boolean;
  jobs?: any;
  jobsLoading?: any;
  locations?: any;
  locationsLoading?: any;
  grades?: any;
  gradesLoading?: any;
};

export interface PositionsNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const PositionsNewEditForm = forwardRef<PositionsNewEditFormHandle, Props>(
  (
    {
      currentPosition,
      operation,
      positionSTATUS,
      positionSTATUSLoading,
      organizations,
      organizationsValidating,
      jobs,
      jobsLoading,
      locations,
      locationsLoading,
      grades,
      gradesLoading,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const employees = useBoolean();
    const currentLanguage = currentLang.value;
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);
    const langSchema = z.object({
      AR:
        currentLanguage === 'ar'
          ? z
              .string()
              .nullable()
              .transform((value) => (value === null || value === undefined ? '' : value)) // Convert null/undefined to ''
              .refine((value) => value.length > 0, { message: t('Position Name is required') }) // Required validation
              .refine((value) => value.length >= 3, { message: t('Invalid Position Name') }) // Minimum length validation
              .refine(
                (value) =>
                  /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/.test(
                    value
                  ),
                { message: t('Invalid Position Name') }
              )
          : z.string().optional(),

      EN:
        currentLanguage === 'en'
          ? z
              .string()
              .nullable()
              .transform((value) => (value === null || value === undefined ? '' : value)) // Convert null/undefined to ''
              .refine((value) => value.length > 0, { message: t('Position Name is required') }) // Required validation
              .refine((value) => value.length >= 3, { message: t('Invalid Position Name') }) // Minimum length validation
              .refine(
                (value) =>
                  /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/.test(
                    value
                  ),
                { message: t('Invalid Position Name') }
              )
          : z.string().optional(),
    });

    const isEdit = operation === 'edit';
    const locationIds = useMemo(
      () => (locationsLoading ? [] : locations.map((loc: any) => loc.locationId)),
      [locations, locationsLoading]
    );
    const jobIds = useMemo(
      () => (jobsLoading ? [] : jobs.map((job: any) => job.jobId)),
      [jobs, jobsLoading]
    );
    const organizationIds = useMemo(
      () => (organizationsValidating ? [] : organizations.map((org: any) => org.organizationId)),
      [organizations, organizationsValidating]
    );

    const isPending = currentPosition?.approvalStatus === 'PENDING';

    const NewPositionSchema = z.object({
      positionName: langSchema,
      organizationsId: schemaHelper.nullableInput(
        z
          .union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? '' : String(val)))
          .refine((val) => val.trim().length > 0, {
            message: t('Organization is required'),
          }),
        {
          message: t('Organization is required'),
        }
      ),
      locationId: schemaHelper.nullableInput(
        z
          .union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? '' : String(val)))
          .refine((val) => val.trim().length > 0, {
            message: t('Location is required'),
          }),
        {
          message: t('Location is required'),
        }
      ),
      jobId: schemaHelper.nullableInput(
        z
          .union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? '' : String(val)))
          .refine((val) => val.trim().length > 0, {
            message: t('Job is required'),
          }),
        {
          message: t('Job is required'),
        }
      ),
      headcounts: schemaHelper.nullableInput(
        z
          .union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? '' : String(val)))
          .refine((val) => val.trim().length > 0, {
            message: t('Head Counts is required'),
          })
          .refine((value) => Number(value) >= 1, {
            message: t('Order must be greater than or equal to 1'),
          }),
        { message: t('Head Counts is required') }
      ),
      active: z.boolean(),
      aplicableGrades: z.array(z.any()), // Assuming this can contain any type of values
    });
    const defaultValues = useMemo(
      () => ({
        id: currentPosition?.id ?? 0,
        positionName: {
          AR:
            currentPosition?.hrPositionsTlDTOS?.find((org) => org.langCode === 'AR')
              ?.positionName || '',
          EN:
            currentPosition?.hrPositionsTlDTOS?.find((org) => org.langCode === 'EN')
              ?.positionName || '',
        },
        approvalStatus: currentPosition?.approvalStatus ?? 'DRAFT',
        organizationsId: organizationIds.includes(currentPosition?.organizationsId)
          ? currentPosition?.organizationsId
          : '',
        locationId: locationIds.includes(currentPosition?.locationId)
          ? currentPosition?.locationId
          : '',
        jobId: jobIds.includes(currentPosition?.jobId) ? currentPosition?.jobId : '',
        headcounts: currentPosition?.headcounts || '',
        aplicableGrades: currentPosition?.hrPositionGradeDTOS?.map((item) => item.gradeId) || [],
        uniqueId: currentPosition?.uniqueId ?? Math.floor(Math.random() * 1000000),

        active: currentPosition?.active === 1 || currentPosition?.active === undefined,
      }),
      [currentPosition]
    );
    console.log(currentPosition);
    const methods = useForm<any>({
      resolver: zodResolver(NewPositionSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentPosition ? 'Update success!' : 'Create success!');
        router.push(paths.hr.positions.management);
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
          console.error('Validation Errors:', errors);
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

    const validateFieldOnBlur = async (name: string) => {
      try {
        const value = methods.getValues(name);
        if (value === '') {
          methods.setValue(name, null, { shouldValidate: true });
        }
        return await trigger(name);
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false;
      }
    };

    const PositionName = currentLanguage === 'en' ? 'positionName.EN' : 'positionName.AR';

    return (
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {/* Position Name (Takes 2 columns on sm+, full width on xs) */}
                <Grid item xs={12} sm={8}>
                  <RHFGlobalTextField
                    required
                    name={PositionName}
                    label={t('Position Name')}
                    onBlur={() => validateFieldOnBlur(PositionName)}
                    fieldName="positionName"
                    dialogTitle={t('Position Name')}
                    placeholder={t('Position Name')}
                    disabled={isPending}
                    validate
                  />
                </Grid>

                {/* Approval Status (Takes 1 column on sm+, full width on xs) */}
                <Grid item xs={12} sm={4}>
                  <RHFTextField
                    required
                    name="approvalStatus"
                    label={t('Approval Status')}
                    onBlur={() => validateFieldOnBlur('approvalStatus')}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  {!organizationsValidating && organizations ? (
                    <RHFAutocomplete
                      name="organizationsId"
                      label={t('Organization')}
                      placeholder={t('Choose Organization')}
                      onBlur={() => validateFieldOnBlur('organizationsId')}
                      options={
                        !organizationsValidating
                          ? organizations.map((option: any) => option.organizationId)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !organizationsValidating
                          ? organizations.find((item: any) => item.organizationId === option)
                          : undefined;
                        return selectedOption ? selectedOption.organizationName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                      disabled={isPending}
                      required
                    />
                  ) : (
                    <FieldSkeleton />
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  {!jobsLoading && jobs ? (
                    <RHFAutocomplete
                      name="jobId"
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
                      disabled={isPending}
                      required
                    />
                  ) : (
                    <FieldSkeleton />
                  )}
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  {!locationsLoading && locations ? (
                    <RHFAutocomplete
                      name="locationId"
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
                      disabled={isPending}
                      required
                    />
                  ) : (
                    <FieldSkeleton />
                  )}
                </Grid>

                {/* Applicable Grades (Full Width) */}
                <Grid item xs={12}>
                  {!gradesLoading && grades ? (
                    <RHFAutocomplete
                      name="aplicableGrades"
                      label={t('Aplicable Grades')}
                      placeholder={t('Aplicable Grades')}
                      multiple
                      disabled={isPending}
                      options={!gradesLoading ? grades.map((option: any) => option.gradeId) : []}
                      getOptionLabel={(option) => {
                        const selectedOption = !gradesLoading
                          ? grades.find((item: any) => item.gradeId === option)
                          : undefined;
                        return selectedOption ? selectedOption.gradeName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        typeof option === 'string' ? option === value : option === value
                      }
                    />
                  ) : (
                    <FieldSkeleton />
                  )}
                </Grid>

                {/* Headcounts + Button (2:1 Ratio) */}
                <Grid item xs={12} sm={8}>
                  <RHFTextField
                    required
                    name="headcounts"
                    label={t('Head Counts')}
                    placeholder={t('Head Counts')}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        methods.setValue('headcounts', '', { shouldValidate: true });
                      }
                      validateFieldOnBlur('headcounts');
                    }}
                    type="number"
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{
                      inputMode: 'numeric', // For better numeric keyboard on mobile
                    }}
                    disabled={isPending}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Button onClick={handleOpenDialog} variant="contained" fullWidth>
                    {t('Existing Employees')}
                  </Button>
                </Grid>

                {/* Active Checkbox */}
                <Grid item xs={12}>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <RHFCheckbox name="active" label={t('Active')} disabled={isPending} />
                  </Stack>
                </Grid>

                {/* Employees Dialog */}
                <EmployeesDialog
                  open={open}
                  onClose={handleCloseDialog}
                  title={t('Existing Employees')}
                />
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default PositionsNewEditForm;
