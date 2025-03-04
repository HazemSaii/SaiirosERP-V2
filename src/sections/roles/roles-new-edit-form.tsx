import { useForm, Controller } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { toast } from 'src/components/snackbar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';
import FormSkeleton from 'src/components/Form/form-skelton';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
  RHFGlobalTextField,
} from 'src/components/hook-form';

import { IApplicationItem } from 'src/types/shared';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type FormValues = {
  id: number;
  applicationCode: string;
  roleCode: string;
  startDate: Date | null;
  endDate?: any;
  builtIn: number;
  lang: {
    EN?: string;
    AR?: string;
  };
  roleName?: string;
};

type Props = {
  currentRole?: FormValues;
  rolesLoading?: any;
  operation: string;
  applicationsData: any;
  applicationsLoading: any;
};

export interface RoleNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const RolesNewEditForm = forwardRef<RoleNewEditFormHandle, Props>(
  ({ currentRole, rolesLoading, operation, applicationsData, applicationsLoading }, ref) => {
    const currentLanguage = localStorage.getItem('i18nextLng');
    const { t } = useTranslate();
    const isEdit = operation === 'edit';
    const router = useRouter();
    const createLangSchema = () => {
      if (currentLanguage === 'EN') {
        return z.object({
          EN: z.string().min(1, t('Role name is required')),
          AR: z.string().optional(),
        });
      } else if (currentLanguage === 'ar') {
        return z.object({
          EN: z.string().optional(),
          AR: z.string().min(1, t('Role name is required')),
        });
      } else {
        return z.object({
          EN: z.string().optional(),
          AR: z.string().optional(),
        });
      }
    };
    const NewRoleSchema = z.object({
      id: z.number(),
      roleCode: z.string().min(1, t('Role code is required')),
      lang: createLangSchema(),
      applicationCode: z.string().min(1, t('Application is required')),
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
      builtIn: z.boolean(),
      roleName: z.string().optional(),
    });

    const defaultValues = useMemo(
      () => ({
        id: Number(currentRole?.id) || 0,
        applicationCode: currentRole?.applicationCode || '',
        roleCode: currentRole?.roleCode || '',
        startDate: currentRole?.startDate ? new Date(currentRole.startDate) : new Date(),
        endDate: currentRole?.endDate ? new Date(currentRole.endDate) : null,
        builtIn: currentRole?.builtIn === 1,
        lang: {
          ...(currentRole?.lang.EN && { EN: currentRole.lang.EN }),
          ...(currentRole?.lang.AR && { AR: currentRole.lang.AR }),
        },
        roleName:
          currentLanguage === 'EN' ? currentRole?.lang?.EN || '' : currentRole?.lang?.AR || '',
      }),
      [currentRole]
    );
    console.log('defaultValues', defaultValues);
    let roleName: any;
    switch (currentLanguage) {
      case 'EN':
        roleName = 'lang.EN';
        break;
      case 'ar':
        roleName = 'lang.AR';
        break;
      default:
        roleName = 'lang.EN';
    }
    const methods = useForm({
      resolver: zodResolver(NewRoleSchema),
      defaultValues,
    });
    useEffect(() => {
      console.log(currentLanguage);
    }, []);
    const { reset, control, handleSubmit, trigger } = methods;

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentRole ? 'Update success!' : 'Create success!');
        router.push(paths.security.users.management);
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
    console.log(applicationsData);
    const render_skelton = [...Array(1)].map((_, index) => <FormSkeleton fields={6} />);
    return (
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container>
          {applicationsLoading && rolesLoading ? (
            render_skelton
          ) : (
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
                    name="roleCode"
                    label={t('Role code')}
                    placeholder={t('Role code')}
                    onBlur={() => validateFieldOnBlur('roleCode')}
                  />
                  <RHFGlobalTextField
                    required
                    name={roleName}
                    label={t('Role name')}
                    onBlur={() => validateFieldOnBlur(roleName)}
                    fieldName="lang"
                    dialogTitle={t('Role Name')}
                    placeholder={t('Role name')}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          minDate={new Date()}
                          label={`${t('Start Date')} *`}
                          value={field.value}
                          format="dd/MM/yyyy"
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            validateFieldOnBlur('startDate');
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
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label={`${t('End Date')}`}
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
                  <RHFAutocomplete
                    required
                    name="applicationCode"
                    label={t('Application')}
                    placeholder={t('Choose an application')}
                    onBlur={() => validateFieldOnBlur('applicationCode')}
                    options={
                      applicationsData && Array.isArray(applicationsData) && !applicationsLoading
                        ? [
                            ...new Set(
                              applicationsData.map(
                                (option: IApplicationItem) => option.applicationName
                              )
                            ),
                          ]
                        : []
                    }
                    getOptionLabel={(option) => {
                      if (!option) return '';
                      const selectedOption =
                        applicationsData && Array.isArray(applicationsData)
                          ? applicationsData.find(
                              (item: any) =>
                                item.applicationCode === option &&
                                item.langCode === (currentLanguage === 'EN' ? 'EN' : 'AR')
                            )
                          : null;
                      return selectedOption ? selectedOption.applicationName : option;
                    }}
                    isOptionEqualToValue={(option, value) => option === value}
                    disabled={isEdit}
                  />
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <RHFCheckbox name="builtIn" label={t('Built In')} disabled />
                  </Stack>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </FormProvider>
    );
  }
);

export default RolesNewEditForm;
