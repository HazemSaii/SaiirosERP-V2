import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import { Box, Card, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { useGetPasswordPolicy } from '../../actions/security/passwordPolicy';
import { useBoolean } from 'minimal-shared/hooks';
import { useTranslate } from 'src/locales';
import { useResetPassword } from 'src/api/security/user';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { IUserItem } from 'src/types/user';

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
    minLength: Yup.string().min(8, t('Password must be at least 8 characters long')),
    minNumbers: Yup.string().matches(
      /(.*[0-9].*){1}/,
      t('Password must contain at least one number')
    ),
    minUpperLetters: Yup.string().matches(
      /(.*[A-Z].*){1}/,
      t('Password must contain at least one uppercase letter')
    ),
    minLowLetters: Yup.string().matches(
      /(.*[a-z].*){1}/,
      t('Password must contain at least one lowercase letter')
    ),
    minSpecialCharacters: Yup.string().matches(
      /(.*[^a-zA-Z0-9].*){1}/,
      t('Password must contain at least one special character')
    ),
    repeatCharacters: Yup.string().matches(
      /^(?!.*(.)\1).*/,
      t('Password must not contain repeated characters')
    ),
  };

  const passwordRules = useMemo(() => {
    if (policyLoading || !policy) {
      return defaultPasswordRules;
    }
    return {
      minLength: Yup.string().min(
        Number(policy.minLength),
        t(`Password must be at least ${policy.minLength} characters long`)
      ),
      minNumbers: Yup.string().matches(
        new RegExp(`(.*[0-9].*){${policy.minNumbers}}`),
        t(`Password must contain at least ${policy.minNumbers} number(s)`)
      ),
      minUpperLetters: Yup.string().matches(
        new RegExp(`(.*[A-Z].*){${policy.minUpperLetters}}`),
        t(`Password must contain at least ${policy.minUpperLetters} uppercase letter(s)`)
      ),
      minLowLetters: Yup.string().matches(
        new RegExp(`(.*[a-z].*){${policy.minLowLetters}}`),
        t(`Password must contain at least ${policy.minLowLetters} lowercase letter(s)`)
      ),
      minSpecialCharacters: Yup.string().matches(
        new RegExp(`(.*[^a-zA-Z0-9].*){${policy.minSpecialCharacters}}`),
        t(`Password must contain at least ${policy.minSpecialCharacters} special character(s)`)
      ),
      repeatCharacters: policy.acceptRepeatCharacters
        ? Yup.string()
        : Yup.string().matches(
            /^(?!.*(.)\1).*/,
            t('Password must not contain repeated characters')
          ),
    };
  }, [policyLoading, policy]);
  const NewUserSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required(t('Password is required'))
      .concat(passwordRules.minLength)
      .concat(passwordRules.minNumbers)
      .concat(passwordRules.minUpperLetters)
      .concat(passwordRules.minLowLetters)
      .concat(passwordRules.minSpecialCharacters)
      .concat(passwordRules.repeatCharacters),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), ''], t('Passwords must match'))
      .required(t('Confirm Password is required')),
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
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const { handleSubmit, trigger } = methods;

  const onSubmit = handleSubmit(async () => {
    const data = formData();
    try {
      const res = await useResetPassword(data);
      if (res.status === 200) {
        enqueueSnackbar(t('Password Changed successfully!'));
        onClose();
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
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
