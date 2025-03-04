import type { IJobFamiliesInfo } from 'src/types/jobsFamilies';

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

import FormSkeleton from 'src/components/Form/form-skelton';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import {RHFGlobalTextField} from 'src/components/hook-form/rhf-global-text-field';

type Props = {
  currentjobfamily?: IJobFamiliesInfo;
  operation: string;
  familySTATUS: any;
  familySTATUSLoading: any;
};

export interface JobFamiliesNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const JobFamiliesNewEditForm = forwardRef<JobFamiliesNewEditFormHandle, Props>(
  ({ currentjobfamily, operation, familySTATUS, familySTATUSLoading }, ref) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;

    const router = useRouter();

    const isEdit = operation === 'edit';
    const langSchema = z.object({
      AR:
        currentLanguage === 'ar'
          ? z
              .string()
              .min(1, { message: t('Job Family Name is required') })
              .min(3, { message: t('Invalid Family Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Family Name'),
                }
              )
              .nonempty({ message: t('Job Family Name is required') }) // Equivalent to `required`
          : z.string().optional(),

      EN:
        currentLanguage === 'en'
          ? z
              .string()
              .min(1, { message: t('Job Family Name is required') })

              .min(3, { message: t('Invalid Job Family Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Family Name'),
                }
              )
              .nonempty({ message: t('Job Family Name is required') })
          : z.string().optional(),
    });
    const NewApprovalSchema = z.object({
      jobFamilyName: langSchema,

      active: z.boolean().optional(), // Optional boolean value
    });

    const isPending = currentjobfamily?.approvalStatus === 'PENDING';

    const defaultValues = useMemo(() => {
      const family = currentjobfamily?.jobFamiliesTlDTO || [];

      return {
        id: currentjobfamily?.id ?? 0,

        jobFamilyName: {
          AR:
            currentjobfamily?.jobFamiliesTlDTO?.find((org) => org.langCode === 'AR')
              ?.jobFamilyName || '',
          EN:
            currentjobfamily?.jobFamiliesTlDTO?.find((org) => org.langCode === 'EN')
              ?.jobFamilyName || '',
        },
        approvalStatus: currentjobfamily?.approvalStatus ?? 'DRAFT',
        uniqueId: currentjobfamily?.uniqueId ?? Math.floor(Math.random() * 1000000),

        active: currentjobfamily?.active === 1 || currentjobfamily?.active === undefined,
      };
    }, [currentjobfamily]);

    const methods = useForm<any>({
      resolver: zodResolver(NewApprovalSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentjobfamily ? 'Update success!' : 'Create success!');
        router.push(paths.hr.jobFamilies.management);
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

    const jobFamilyName = currentLanguage === 'en' ? 'jobFamilyName.EN' : 'jobFamilyName.AR';

    const render_skeleton = [...Array(1)].map((_, index) => (
      <FormSkeleton key={index} fields={7} />
    ));

    return (
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
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
                    name={jobFamilyName}
                    label={t('Job Family Name')}
                    onBlur={() => validateFieldOnBlur(jobFamilyName)}
                    fieldName="jobFamilyName"
                    dialogTitle={t('Job Family Name')}
                    placeholder={t('Job Family Name')}
                    disabled={isPending}
                    validate
                    required
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 1' } }}>
                  <RHFTextField
                    name="approvalStatus"
                    label={t('Approval Status')}
                    onBlur={() => validateFieldOnBlur('approvalStatus')}
                    disabled
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <RHFCheckbox name="active" label={t('Active')} disabled={isPending} />
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

export default JobFamiliesNewEditForm;
