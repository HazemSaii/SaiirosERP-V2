import type { IJobsInfo, IJobsItem } from 'src/types/jobs';

import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';

import { Box, Grid, Card, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import FieldSkeleton from 'src/components/Form/field-skelton';
import { RHFGlobalTextField } from 'src/components/hook-form/rhf-global-text-field';
import { RHFCheckbox, RHFTextField, schemaHelper, RHFAutocomplete } from 'src/components/hook-form';

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
    const langSchema = z.object({
      AR:
        currentLanguage === 'ar'
          ? z
              .string()
              .min(1, { message: t('Job Name is required') })

              .min(3, { message: t('Invalid Jobs Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Jobs Name'),
                }
              )
              .nonempty({ message: t('Job Name is required') }) // Equivalent to `required`
          : z.string().optional(),

      EN:
        currentLanguage === 'en'
          ? z
              .string()
              .min(1, { message: t('Job Name is required') })
              .min(3, { message: t('Invalid Jobs Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Jobs Name'),
                }
              )
              .nonempty({ message: t('Job Name is required') })
          : z.string().optional(),
    });

    const NewApprovalSchema = z.object({
      jobName: langSchema,
      approvalStatus: z.string().min(1, { message: t('Approval Status is required') }),
      jobFamily: schemaHelper.nullableInput(
        z
          .union([z.string(), z.number(), z.null()])
          .refine((val) => val !== null && String(val).trim() !== '', {
            message: t('Job Family is required'),
          })
      ),
      active: z.boolean().optional(), // Optional boolean value
    });
    const isPending = currentjobName?.approvalStatus === 'PENDING';

    const isEdit = operation === 'edit';
    const jobFamilyIds = useMemo(
      () => (jobFamiliesLoading ? [] : jobFamilies.map((family: any) => family.jobFamilyId)),
      [jobFamiliesLoading, jobFamilies]
    );

    const defaultValues: any = useMemo(
      () => ({
        id: currentjobName?.id ?? 0,
        jobName: {
          AR:
            currentjobName?.jobTlDTO?.find((org) => org.langCode === 'AR')?.jobName ||
            currentjobName?.jobName?.AR ||
            '',
          EN:
            currentjobName?.jobTlDTO?.find((org) => org.langCode === 'EN')?.jobName ||
            currentjobName?.jobName?.EN ||
            '',
        },
        approvalStatus: currentjobName?.approvalStatus ?? 'DRAFT',
        uniqueId: currentjobName?.uniqueId ?? Math.floor(Math.random() * 1000000),

        progressingJobId: currentjobName?.progressingJobId ?? '',
        active: currentjobName?.active === 1 || currentjobName?.active === undefined,
        jobFamily: jobFamilyIds.includes(currentjobName?.jobFamily)
          ? currentjobName?.jobFamily
          : '',
      }),
      [currentjobName]
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
        toast.success(currentjobName ? 'Update success!' : 'Create success!');
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

    const jobName = currentLanguage === 'en' ? 'jobName.EN' : 'jobName.AR';

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
                  {!jobFamiliesLoading && jobFamilies ? (
                    <RHFAutocomplete
                      required
                      name="jobFamily"
                      // type="jobFamily"
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
                  ) : (
                    <FieldSkeleton />
                  )}
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  {!jobsLoading && jobs ? (
                    <RHFAutocomplete
                      name="progressingJobId"
                      // type="progressingJobId"
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
                  ) : (
                    <FieldSkeleton />
                  )}
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
