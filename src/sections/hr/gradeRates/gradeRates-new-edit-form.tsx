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
  RHFAutocomplete,
} from 'src/components/hook-form';

type Props = {
  currentGradeRates?: any;
  GradeRatesLoading?: any;
  GRADE_RATE_UNIT: any;
  GRADE_RATE_TYPE: any;
  GRADE_RATE_TYPELoading: any;
  GRADE_RATE_UNITLoading: any;
  operation: string;
};

export interface GradeRatesGradeRatesNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const GradeRatesNewEditForm = forwardRef<GradeRatesGradeRatesNewEditFormHandle, Props>(
  ({ currentGradeRates, GradeRatesLoading, GRADE_RATE_UNIT, GRADE_RATE_TYPE,GRADE_RATE_TYPELoading,GRADE_RATE_UNITLoading, operation }, ref) => {
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;
    const router = useRouter();
    console.log('currentGradeRates', currentGradeRates);
    
    const langSchema = z.object({
      AR:
        currentLanguage === 'ar'
          ? z
              .string()
              .min(1, { message: t('Grade Rate Name is required') })

              .min(3, { message: t('Invalid Grade Rate Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Grade Rate Name'),
                }
              )
              .nonempty({ message: t('Grade Rate Name is required') }) // Equivalent to `required`
          : z.string().optional(),

      EN:
        currentLanguage === 'en'
          ? z
              .string()
              .min(1, { message: t('Grade Rate Name is required') })
              .min(3, { message: t('Invalid Grade Rate Name') })
              .regex(
                /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/,
                {
                  message: t('Invalid Grade Rate Name'),
                }
              )
              .nonempty({ message: t('Grade Rate Name is required') })
          : z.string().optional(),
    });
    

    const isEdit = operation === 'edit';
    const isPending = currentGradeRates?.approvalStatus === 'PENDING';


const NewApprovalSchema = z.object({
  gradeName: isPending ? z.any().optional() : langSchema, // Conditionally apply langSchema
  gradeRateType: isPending
    ? z.string().optional()
    : z.string().min(1, { message: t('Type is required') }), // Required when not pending
  gradeRateUnit: isPending
    ? z.string().optional()
    : z.string().min(1, { message: t('Unit is required') }), // Required when not pending
  approvalStatus: isPending
    ? z.string().optional()
    : z.string().min(1, { message: t('Approval is required') }), // Required when not pending
  active: z.boolean(),
});

    

    const defaultValues: any = useMemo(
      () => ({
        gradeName: {
          AR:
            currentGradeRates?.gradeRatesTlsDTOS?.find((org: any) => org.langCode === 'AR')
              ?.gradeName || currentGradeRates?.gradeName?.AR||'',
          EN:
            currentGradeRates?.gradeRatesTlsDTOS?.find((org: any) => org.langCode === 'EN')
              ?.gradeName || currentGradeRates?.gradeName?.EN||'',
        },
        approvalStatus: currentGradeRates?.approvalStatus ?? 'DRAFT',
        gradeRateType: currentGradeRates?.gradeRateType ?? '',
        gradeRateUnit: currentGradeRates?.gradeRateUnit ?? '',
        uniqueId:currentGradeRates?.uniqueId?? Math.floor(Math.random() * 1000000),

        active: currentGradeRates?.active === 1 || currentGradeRates?.active === undefined,
      }),
      [currentGradeRates]
    );
console.log('defaultValues', defaultValues);

    const methods = useForm<any>({
      resolver: zodResolver(NewApprovalSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentGradeRates ? 'Update success!' : 'Create success!');
        router.push(paths.hr.gradeRates.management);
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

    const gradeName = currentLanguage === 'en' ? 'gradeName.EN' : 'gradeName.AR';

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
                    required
                    name={gradeName}
                    label={t('Grade Rate Name')}
                    onBlur={() => validateFieldOnBlur(gradeName)}
                    fieldName="gradeName"
                    dialogTitle={t('Grade Rate Name')}
                    placeholder={t('Grade Rate Name')}
                    validate
                    disabled={isEdit && isPending}
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
                {(!GRADE_RATE_UNITLoading&&GRADE_RATE_UNIT)?(             

                  <RHFAutocomplete
                    required
                    name="gradeRateUnit"
                    // type="gradeRateUnit"
                    label={t('Unit')}
                    onBlur={() => validateFieldOnBlur('gradeRateUnit')}
                    placeholder={t('Choose a Unit')}
                    disabled={isEdit || isPending}
                    options={!GRADE_RATE_UNITLoading?GRADE_RATE_UNIT.map((option: any) => option.valueCode):[]}
                    getOptionLabel={(option) => {
                      const selectedOption =!GRADE_RATE_UNITLoading?GRADE_RATE_UNIT.find(
                        (item: any) => item.valueCode === option
                      ):undefined;
                      return selectedOption ? selectedOption.valueName : '';
                    }}
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
                    
                  />
                ):
                ( <FieldSkeleton />)
                }
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 1', md: 'span 2' } }}>
                  {(!GRADE_RATE_TYPELoading && GRADE_RATE_TYPE)?(
                  <RHFAutocomplete
                    required
                    name="gradeRateType"
                    // type="gradeRateType"
                    label={t('Type')}
                    onBlur={() => validateFieldOnBlur('gradeRateType')}
                    placeholder={t('Choose a Type')}
                    disabled={isEdit || isPending}
                    options={!GRADE_RATE_TYPELoading?GRADE_RATE_TYPE.map((option: any) => option.valueCode):[]}
                    getOptionLabel={(option) => {
                      const selectedOption = !GRADE_RATE_TYPELoading?GRADE_RATE_TYPE.find(
                        (item: any) => item.valueCode === option
                      ):undefined;
                      return selectedOption ? selectedOption.valueName : '';
                    }}
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
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

export default GradeRatesNewEditForm;
