import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { toast } from 'src/components/snackbar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useTranslate } from 'src/locales';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { IPasswordPolicy } from 'src/types/password_policy';


export interface PasswordEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const PasswordPolicyEditForm = forwardRef<PasswordEditFormHandle, { policyData?: IPasswordPolicy }>(
  ({ policyData }, ref) => {
    const { t } = useTranslate();
    const PasswordPolicySchema = z.object({
      minLength: z
        .string()
        .nonempty(t('This field is required'))
        .transform((val) => (val === '' ? 0 : Number(val)))
        .refine((val) => !isNaN(val), t('Must be a valid number'))
        .refine((val) => val >= 0, t('Password length must be a positive number')),
      minNumbers: z
        .string()
        .nonempty(t('This field is required'))
        .transform((val) => (val === '' ? 0 : Number(val)))
        .refine((val) => !isNaN(val), t('Must be a valid number'))
        .refine((val) => val >= 0, t('Number of numbers must be a positive number')),
      minUpperLetters: z
        .string()
        .nonempty(t('This field is required'))
        .transform((val) => (val === '' ? 0 : Number(val)))
        .refine((val) => !isNaN(val), t('Must be a valid number'))
        .refine((val) => val >= 0, t('Number of uppercase letters must be a positive number')),
      minLowLetters: z
        .string()
        .nonempty(t('This field is required'))
        .transform((val) => (val === '' ? 0 : Number(val)))
        .refine((val) => !isNaN(val), t('Must be a valid number'))
        .refine((val) => val >= 0, t('Number of lowercase letters must be a positive number')),
      minSpecialCharacters: z
        .string()
        .nonempty(t('This field is required'))
        .transform((val) => (val === '' ? 0 : Number(val)))
        .refine((val) => !isNaN(val), t('Must be a valid number'))
        .refine((val) => val >= 0, t('Number of special characters must be a positive number')),
      acceptRepeatCharacters: z.boolean(),
      passwordExpiryDate: z
        .string()
        .nonempty(t('This field is required'))
        .transform((val) => (val === '' ? 0 : Number(val)))
        .refine((val) => !isNaN(val), t('Must be a valid number'))
        .refine((val) => val >= 0, t('Password expiry days must be a positive number')),
    });

    const methods = useForm({
      resolver: zodResolver(PasswordPolicySchema),
      defaultValues: {
        minLength: policyData?.minLength?.toString() || '0',
        minNumbers: policyData?.minNumbers?.toString() || '0',
        minUpperLetters: policyData?.minUpperLetters?.toString() || '0',
        minLowLetters: policyData?.minLowLetters?.toString() || '0',
        minSpecialCharacters: policyData?.minSpecialCharacters?.toString() || '0',
        acceptRepeatCharacters: policyData?.acceptRepeatCharacters === 1 ? true : false || false,
        passwordExpiryDate: policyData?.passwordExpiryDate?.toString() || '0',
      },
    });
    const { control, handleSubmit, reset, trigger } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(t('Update success!'));
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
        const isValid = await methods.trigger();
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
    return (
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField
                  autoComplete="off"
                  name="minLength"
                  type="number"
                  label={t('Minimum Length')}
                  placeholder="0"
                  onBlur={() => validateFieldOnBlur('minLength')}
                />
                <RHFTextField
                  autoComplete="off"
                  name="minNumbers"
                  type="number"
                  label={t('Minimum Numbers')}
                  placeholder="0"
                  onBlur={() => validateFieldOnBlur('minNumbers')}
                />
                <RHFTextField
                  autoComplete="off"
                  name="minUpperLetters"
                  type="number"
                  label={t('Minimum Upper Letters')}
                  placeholder="0"
                  onBlur={() => validateFieldOnBlur('minUpperLetters')}
                />
                <RHFTextField
                  autoComplete="off"
                  name="minLowLetters"
                  type="number"
                  label={t('Minimum Low Letters')}
                  placeholder="0"
                  onBlur={() => validateFieldOnBlur('minLowLetters')}
                />
                <RHFTextField
                  autoComplete="off"
                  name="minSpecialCharacters"
                  type="number"
                  label={t('Minimum Special Characters')}
                  placeholder="0"
                  onBlur={() => validateFieldOnBlur('minSpecialCharacters')}
                />
                <RHFTextField
                  autoComplete="off"
                  name="passwordExpiryDate"
                  type="number"
                  label={t('Password Expiry Days')}
                  placeholder="0"
                  onBlur={() => validateFieldOnBlur('passwordExpiryDate')}
                />
                <RHFCheckbox name="acceptRepeatCharacters" label={t('Accept Repeat Characters')} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default PasswordPolicyEditForm;
