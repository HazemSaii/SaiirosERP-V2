import * as Yup from 'yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';

import { Box, Grid, Card, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import FormSkeleton from 'src/components/Form/form-skelton';
import {
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
  RHFGlobalTextField,
} from 'src/components/hook-form';

import { IJobsInfo, IJobsItem } from 'src/types/jobs';

type Props = {
  currentjobName?: IJobsInfo;
  operation: string;
  familySTATUS: any;
  familySTATUSLoading: any;
  jobFamiliesLoading: any;
  jobFamilies: any;
  jobs: any;
  jobsLoading: any;
};

export interface JobsNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const JobsNewEditForm = forwardRef<JobsNewEditFormHandle, Props>(
  (
    {
      currentjobName,
      operation,
      familySTATUS,
      familySTATUSLoading,
      jobFamiliesLoading,
      jobFamilies,
      jobs,
      jobsLoading,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const langSchema = Yup.object().shape({
      ...(currentLanguage === 'ar' && { AR: Yup.string().required(t('Job Name is required'))
        .min(3, t('Invalid Jobs Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,t('Invalid Jobs Name'))
       }),
      ...(currentLanguage === 'EN' && { EN: Yup.string().required(t('Job Name is required'))
        .min(3, t('Invalid Jobs Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,t('Invalid Jobs Name'))
       }),
    });

    const NewApprovalSchema = Yup.object().shape({
      jobName: langSchema,
      approvalStatus: Yup.string().required(t('Approval Status is required')),
      jobFamily: Yup.string().required(t('Job Family is required')),
      active: Yup.boolean(),
    });
    const isPending = currentjobName?.approvalStatus === 'PENDING';

    const isEdit = operation === 'edit';
    const jobFamilyIds = useMemo(() => jobFamilies.map((family: any) => family.jobFamilyId), [jobFamilies]);

    const defaultValues: any = useMemo(
      () => ({
        id: currentjobName?.id ?? 0,
        jobName: {
          AR:
            currentjobName?.jobTlDTO?.find((org) => org.langCode === 'AR')?.jobName ||
            currentjobName?.jobName?.AR,
          EN:
            currentjobName?.jobTlDTO?.find((org) => org.langCode === 'EN')?.jobName ||
            currentjobName?.jobName?.EN,
        },
        approvalStatus: currentjobName?.approvalStatus ?? 'DRAFT',
        uniqueId:currentjobName?.uniqueId?? Math.floor(Math.random() * 1000000),

        progressingJobId: currentjobName?.progressingJobId ?? '',
        active: currentjobName?.active === 1 || currentjobName?.active === undefined,
        jobFamily: jobFamilyIds.includes(currentjobName?.jobFamily) ? currentjobName?.jobFamily : '',
      }),
      [currentjobName]
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
        enqueueSnackbar(currentjobName ? 'Update success!' : 'Create success!');
        router.push(paths.hr.jobs.management);
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

    const validateFieldOnBlur = async (name: any) => {
      try {
        const isValid = await trigger(name);
        return isValid;
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false;
      }
    };

    const render_skeleton = [...Array(1)].map((_, index) => (
      <FormSkeleton key={index} fields={7} />
    ));

    const jobName = currentLanguage === 'EN' ? 'jobName.EN' : 'jobName.AR';

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
                    required
                    name={jobName}
                    label={t('Job Name')}
                    onBlur={() => validateFieldOnBlur(jobName)}
                    fieldName="jobName"
                    dialogTitle={t('Job Name')}
                    placeholder={t('Job Name')}
                    validate
                    disabled={isPending}
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 1' } }}>
                  <RHFTextField
                    required
                    name="approvalStatus"
                    label={t('Approval Status')}
                    onBlur={() => validateFieldOnBlur('approvalStatus')}
                    disabled
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  <RHFAutocomplete
                    required
                    name="jobFamily"
                    type="jobFamily"
                    label={t('Job Family Name')}
                    placeholder={t('Job Family Name')}
                    onBlur={() => validateFieldOnBlur('jobFamily')}
                    options={
                      !jobFamiliesLoading
                        ? jobFamilies.map((option: any) => option.jobFamilyId)
                        : []
                    }
                    getOptionLabel={(option) => {
                      const selectedOption = !jobFamiliesLoading
                        ? jobFamilies.find((item: any) => item.jobFamilyId === option)
                        : undefined;
                      return selectedOption ? selectedOption.jobFamilyName : '';
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === null || value === undefined ? true : option === value
                    }
                    disabled={isPending}
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  <RHFAutocomplete
                    
                    name="progressingJobId"
                    type="progressingJobId"
                    label={t('Progressing Job')}
                    onBlur={() => validateFieldOnBlur('progressingJobId')}
                    placeholder={t('Choose a Progressing Jobs')}
                    options={!jobsLoading ? jobs.map((job: IJobsItem) => job.jobId) : []}
                    getOptionLabel={(option) => {
                      const selectedJob = !jobsLoading
                        ? jobs.find((job: IJobsItem) => job.jobId === option)
                        : undefined;
                      return selectedJob ? selectedJob.jobName : '';
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === null || value === undefined ? true : option === value
                    }
                    disabled={isPending}
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <RHFCheckbox name="active" checked label={t('Active')} disabled={isPending} />
                  </Stack>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default JobsNewEditForm;
