import * as Yup from 'yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';

import { Box, Card, Grid, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import FormSkeleton from 'src/components/Form/form-skelton';
import { RHFCheckbox, RHFTextField, RHFGlobalTextField } from 'src/components/hook-form';

import { IGradesInfo } from 'src/types/grades';

//---------------------------------------
type Props = {
  currentGrades?: IGradesInfo;
  familySTATUS: any;
  familySTATUSLoading: any;
  operation: string;
};

export interface GradesNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}
const GradesNewEditForm = forwardRef<GradesNewEditFormHandle, Props>(
  ({ currentGrades, operation, familySTATUS, familySTATUSLoading }, ref) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const langSchema = Yup.object().shape({
      ...(currentLanguage === 'ar' && { AR: Yup.string().required(t('Grade Name is required')) .min(3, t('Invalid Grade Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/, t('Invalid Grade Name')) }),
      ...(currentLanguage === 'EN' && { EN: Yup.string().required(t('Grade Name is required')) 
        .min(3, t('Invalid Grade Name'))

        .matches(/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,t('Invalid Grade Name'))
      }),
    });
    const NewApprovalSchema = Yup.object().shape({
      gradeName: langSchema,
      approvalStatus: Yup.string().required('Approval Status is required'),
      active: Yup.boolean(),
    });

    const isPending = currentGrades?.approvalStatus === 'PENDING';

    const defaultValues = useMemo(
      () => ({
        id: currentGrades?.id ?? 0,
        gradeName: {
          AR:
            currentGrades?.gradeTlDTOS?.find((g) => g.langCode === 'AR')?.gradeName ||
            currentGrades?.gradeName?.AR,
          EN:
            currentGrades?.gradeTlDTOS?.find((g) => g.langCode === 'EN')?.gradeName ||
            currentGrades?.gradeName?.EN,
        },
        approvalStatus: currentGrades?.approvalStatus ?? 'DRAFT',
        uniqueId:currentGrades?.uniqueId?? Math.floor(Math.random() * 1000000),

        active: currentGrades?.active === 1 || currentGrades?.active === undefined,
      }),
      [currentGrades]
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
        enqueueSnackbar(currentGrades ? 'Update success!' : 'Create success!');
        router.push(paths.hr.grades.management);
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
    const gradeName = currentLanguage === 'EN' ? 'gradeName.EN' : 'gradeName.AR';

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
                    required
                    name={gradeName}
                    label={t('Grade Name')}
                    onBlur={() => validateFieldOnBlur(gradeName)}
                    fieldName="gradeName"
                    dialogTitle={t('Grade Name')}
                    placeholder={t('Grade Name')}
                    disabled={isPending}
                    validate
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

export default GradesNewEditForm;
