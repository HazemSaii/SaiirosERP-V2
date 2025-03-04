import type { DialogProps } from '@mui/material/Dialog';

import * as z from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Card, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { useResetPassword } from 'src/actions/security/user';

import { Iconify } from 'src/components/iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';

import { useGetPasswordPolicy } from '../../actions/security/passwordPolicy';

type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  row: any;
};
// type FormValues = {
//   newPassword: string;
//   confirmPassword: string;
//   userId: string;
// };
export default function ResetPasswordDialog({ row, open, onClose }: Props) {
  const password = useBoolean();
  const { policy, policyLoading } = useGetPasswordPolicy('1');
  const { t } = useTranslate();
  const formData = () => {
    try {
      const data = methods.watch();
      return data;
    } catch (error) {
      console.error('Form data error:', error);
      return false;
    }
  };
  const defaultPasswordRules = {
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
  };
  const passwordRules = useMemo(() => {
    if (policyLoading || !policy) {
      return defaultPasswordRules;
    }
    return { ...defaultPasswordRules };
  }, [policyLoading, policy]);
  const NewUserSchema = z.object({
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
  const { id } = row;
  const defaultValues = useMemo(
    () => ({
      userId: id || '',
      newPassword: '',
      confirmPassword: '',
    }),
    []
  );
  const methods = useForm({
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });
  const { handleSubmit, trigger } = methods;

  const onSubmit = handleSubmit(async () => {
    const data = formData();
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const res = await useResetPassword(data);
      if (res.status === 200) {
        toast.success(t('Password Changed successfully!'));
        onClose();
      }
    } catch (e) {
      toast.error((e as Error).message || 'An error occurred');
    }
  });
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
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{t('Reset Password')}</DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container>
            <Grid item xs={12} md={12}>
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
                    name="newPassword"
                    label={t('Password')}
                    onBlur={() => validateFieldOnBlur('newPassword')}
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={password.onToggle} edge="end">
                            <Iconify
                              icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <RHFTextField
                    name="confirmPassword"
                    label={t('Confirm Password')}
                    onBlur={() => validateFieldOnBlur('confirmPassword')}
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={password.onToggle} edge="end">
                            <Iconify
                              icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('Close')}
          </Button>
        )}
        <Button variant="contained" color="success" onClick={onSubmit}>
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
