import * as Yup from 'yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, useState, forwardRef, useImperativeHandle } from 'react';

import { Box, Stack } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import { Grid, Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales } from 'src/locales';

import FormSkeleton from 'src/components/Form/form-skelton';
import {
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
  RHFGlobalTextField,
} from 'src/components/hook-form';

import { IPositionsInfo } from 'src/types/position';

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
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);
    const langSchema = Yup.object().shape({
      ...(currentLanguage === 'ar' && {
        AR: Yup.string().required(t('Position Name is required'))
        .min(3, t('Invalid Position Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/, t('Invalid Position Name')),
      }),
      ...(currentLanguage === 'EN' && {
        EN: Yup.string().required(t('Position Name is required'))
        .min(3, t('Invalid Position Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/, t('Invalid Position Name')),
      }),
    });
    const isEdit = operation === 'edit';
    const locationIds = useMemo(() => locations.map((loc: any) => loc.locationId), [locations]);
    const jobIds = useMemo(() => jobs.map((job: any) => job.jobId), [jobs]);
    const organizationIds = useMemo(() => organizations.map((org: any) => org.organizationId), [organizations]);
    

    const NewPositionSchema = Yup.object().shape({
      positionName: langSchema,
      organizationsId: Yup.string().required(t('Organization is required')),
      locationId: Yup.string().required(t('Location is required')),
      jobId: Yup.string().required(t('Job is required')),
      headcounts: Yup.string().required(t('Head Counts is required')).min(1, t('order must be greater than or equal to 1'))  ,
      active: Yup.boolean(),
      aplicableGrades: Yup.array(),
    });
    const isPending = currentPosition?.approvalStatus === 'PENDING';
    const defaultValues = useMemo(
      () => ({
        id: currentPosition?.id ?? 0,
        positionName: {
          AR:
            currentPosition?.hrPositionsTlDTOS?.find((org) => org.langCode === 'AR')
              ?.positionName || currentPosition?.positionName?.AR,
          EN:
            currentPosition?.hrPositionsTlDTOS?.find((org) => org.langCode === 'EN')
              ?.positionName || currentPosition?.positionName?.EN,
        },
        approvalStatus: currentPosition?.approvalStatus ?? 'DRAFT',
        organizationsId: organizationIds.includes(currentPosition?.organizationsId) ? currentPosition?.organizationsId : '',
        locationId: locationIds.includes(currentPosition?.locationId) ? currentPosition?.locationId : '',
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
      resolver: yupResolver(NewPositionSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(currentPosition ? 'Update success!' : 'Create success!');
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

    const positionName = currentLanguage === 'EN' ? 'positionName.EN' : 'positionName.AR';

    const render_skeleton = [...Array(1)].map((_, index) => (
      <FormSkeleton key={index} fields={7} />
    ));

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
              name={positionName}
              label={t('Position Name')}
              onBlur={() => validateFieldOnBlur(positionName)}
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

          {/* Organization, Job, Location (Responsive Row) */}
          <Grid item xs={12} sm={6} md={4}>
                        <RHFAutocomplete
                          name="organizationsId"
                          label={t('Organization')}
                          placeholder={t('Choose Organization')}
                          onBlur={() => validateFieldOnBlur('organizationsId')}
                          options={!organizationsValidating ? organizations.map((option: any) => option.organizationId) : []}
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
            
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
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
           
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
          <RHFAutocomplete
                          name="locationId"
                          label={t('Location')}
                          placeholder={t('Choose Location')}
                          onBlur={() => validateFieldOnBlur('locationId')}
                          options={!locationsLoading ? locations.map((option: any) => option.locationId) : []}
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
            
            
          </Grid>
          

          {/* Applicable Grades (Full Width) */}
          <Grid item xs={12}>
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
          <EmployeesDialog open={open} onClose={handleCloseDialog} title={t('Existing Employees')} />
        </Grid>
      </Card>
    </Grid>
  </Grid>
</FormProvider>

    );
  }
);

export default PositionsNewEditForm;
