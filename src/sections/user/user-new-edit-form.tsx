import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useMemo, forwardRef, useImperativeHandle } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';
import { FormProvider, RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { IUserInfo } from 'src/types/user';
import { useGetPasswordPolicy } from '../../actions/security/passwordPolicy';

type Props = {
  currentUser?: IUserInfo;
  userLoading?: any;
  suppliers?: any;
  suppliersLoading?: any;
  approvedpersonsLoading: any;
  approvedpersons: any;
  operation: string;
};

export interface UserNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const UserNewEditForm = forwardRef<UserNewEditFormHandle, Props>(
  (
    {
      currentUser,
      operation,
      userLoading,
      approvedpersonsLoading,
      approvedpersons,
      suppliers,
      suppliersLoading,
    },
    ref
  ) => {
    const { t } = useTranslate();
    const router = useRouter();
    const { policy, policyLoading } = useGetPasswordPolicy('1');
    const password = useBoolean();
    const isEdit = operation === 'edit';
    const defaultPasswordRules = {
      minLength: z.string().min(8, t('Password must be at least 8 characters long')),
      minNumbers: z
        .string()
        .regex(/(.*[0-9].*){1}/, t('Password must contain at least one number')),
      minUpperLetters: z
        .string()
        .regex(/(.*[A-Z].*){1}/, t('Password must contain at least one uppercase letter')),
      minLowLetters: z
        .string()
        .regex(/(.*[a-z].*){1}/, t('Password must contain at least one lowercase letter')),
      minSpecialCharacters: z
        .string()
        .regex(/(.*[^a-zA-Z0-9].*){1}/, t('Password must contain at least one special character')),
      repeatCharacters: z
        .string()
        .regex(/^(?!.*(.)\1).*/, t('Password must not contain repeated characters')),
    };
    const passwordRules = useMemo(() => {
      if (policyLoading || !policy) {
        return defaultPasswordRules;
      }
      return {
        minLength: z
          .string()
          .min(
            Number(policy.minLength),
            t(`Password must be at least ${policy.minLength} characters long`)
          ),
        minNumbers: z
          .string()
          .regex(
            new RegExp(`(.*[0-9].*){${policy.minNumbers}}`),
            t(`Password must contain at least ${policy.minNumbers} number(s)`)
          ),
        minUpperLetters: z
          .string()
          .regex(
            new RegExp(`(.*[A-Z].*){${policy.minUpperLetters}}`),
            t(`Password must contain at least ${policy.minUpperLetters} uppercase letter(s)`)
          ),
        minLowLetters: z
          .string()
          .regex(
            new RegExp(`(.*[a-z].*){${policy.minLowLetters}}`),
            t(`Password must contain at least ${policy.minLowLetters} lowercase letter(s)`)
          ),
        minSpecialCharacters: z
          .string()
          .regex(
            new RegExp(`(.*[^a-zA-Z0-9].*){${policy.minSpecialCharacters}}`),
            t(`Password must contain at least ${policy.minSpecialCharacters} special character(s)`)
          ),
        repeatCharacters: policy.acceptRepeatCharacters
          ? z.string()
          : z.string().regex(/^(?!.*(.)\1).*/, t('Password must not contain repeated characters')),
      };
    }, [policyLoading, policy, t]);
    const NewUserSchema = z
      .object({
        userName: z.string().min(1, t('Username is required')),
        userEmail: z
          .string()
          .min(1, t('Email is required'))
          .email(t('Email must be a valid email address'))
          .regex(/^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/, t('Email must be a valid email address.')),
        supplierId: z.any().nullable(),
        personId: z.any().nullable(),
        startDate: z.any().refine((val) => val !== null, t('Start date is required')),
        endDate: z
          .any()
          .nullable()
          .refine(
            (val) => {
              if (!val) return true;
              return true;
            },
            { message: t('End Date must be later than Start Date') }
          ),
        ...(isEdit
          ? {}
          : {
              password: z
                .string()
                .min(1, t('Password is required'))
                .and(passwordRules.minLength)
                .and(passwordRules.minNumbers)
                .and(passwordRules.minUpperLetters)
                .and(passwordRules.minLowLetters)
                .and(passwordRules.minSpecialCharacters)
                .and(passwordRules.repeatCharacters),
              confirmPassword: z.string().min(1, t('Confirm Password is required')),
            }),
        locked: z.boolean(),
        builtIn: z.boolean(),
      })
      .refine((data) => data.password === data.confirmPassword || isEdit, {
        message: t('Passwords must match'),
        path: ['confirmPassword'],
      });
    const defaultValues = useMemo(
      () => ({
        userName: currentUser?.userName || '',
        userEmail: currentUser?.userEmail || '',
        supplierId: currentUser?.supplierId || '',
        personId: currentUser?.personId || '',
        startDate: currentUser?.startDate ? new Date(currentUser.startDate) : new Date(),
        endDate: currentUser?.endDate ? new Date(currentUser.endDate) : null,
        locked: currentUser?.locked === 1,
        builtIn: currentUser?.builtIn === 1,
        loggerEnabled: currentUser?.loggerEnabled === 1,
        password: currentUser?.password || '',
        confirmPassword: currentUser?.password || '',
      }),
      [currentUser]
    );
    const methods = useForm({
      resolver: zodResolver(NewUserSchema),
      defaultValues,
    });
    const { control, handleSubmit, trigger } = methods;
    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(currentUser ? t('Update success!') : t('Create success!'));
        router.push(paths.security.users.list);
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
                  required
                  autoComplete="off"
                  name="userName"
                  label={t('Username')}
                  placeholder={t('Username')}
                  onBlur={() => validateFieldOnBlur('userName')}
                  // disabled={isPending}
                />
                <RHFTextField
                  required
                  autoComplete="off"
                  name="userEmail"
                  onBlur={() => validateFieldOnBlur('userEmail')}
                  label={t('Email')}
                  placeholder={t('Email')}
                />
                <RHFAutocomplete
                  name="personId"
                  label={t('Person')}
                  placeholder={t('Choose a Person')}
                  options={
                    !approvedpersonsLoading
                      ? approvedpersons.map((option: any) => option.personId)
                      : []
                  }
                  getOptionLabel={(option) => {
                    const selectedOption = !approvedpersonsLoading
                      ? approvedpersons.find((item: any) => item.personId === option)
                      : undefined;
                    return selectedOption
                      ? `${selectedOption.firstName} ${selectedOption.lastName}`
                      : '';
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === null || value === undefined ? true : option === value
                  }
                />
                <RHFAutocomplete
                  name="supplierId"
                  label={t('Supplier')}
                  placeholder={t('Choose a Supplier')}
                  options={
                    !suppliersLoading ? suppliers.map((option: any) => option.supplierId) : []
                  }
                  getOptionLabel={(option) => {
                    const selectedOption = !suppliersLoading
                      ? suppliers.find((item: any) => item.supplierId === option)
                      : undefined;
                    return selectedOption ? selectedOption.supplierName : '';
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === null || value === undefined ? true : option === value
                  }
                />

                {!isEdit && (
                  <>
                    <RHFTextField
                      required
                      autoComplete="off"
                      name="password"
                      label={t('Password')}
                      placeholder={t('Password')}
                      onBlur={() => validateFieldOnBlur('password')}
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
                      required
                      name="confirmPassword"
                      label={t('Confirm Password')}
                      placeholder={t('Confirm Password')}
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
                  </>
                )}

                {/* i need help  */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        minDate={new Date()} // Disables past dates
                        label={`${t('Start Date')} *`}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          validateFieldOnBlur('startDate');
                        }}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                            InputLabelProps: { shrink: true },
                          },
                          field: { clearable: true },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        // minDate={startDate}

                        label={t('End Date')}
                        value={field.value}
                        format="dd/MM/yyyy"
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          validateFieldOnBlur('endDate');
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                            InputLabelProps: { shrink: true },
                          },
                          field: { clearable: true },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>

                <Stack justifyContent="space-between" alignItems="center" direction="row">
                  <RHFCheckbox name="builtIn" label={t('Built In')} disabled />
                  <RHFCheckbox name="locked" label={t('Locked')} />
                  <RHFCheckbox name="loggerEnabled" label={t('Log Enable')} />
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default UserNewEditForm;
