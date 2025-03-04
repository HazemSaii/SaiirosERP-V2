import { t } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as z from 'zod';
import { toast } from 'sonner';

import { Box, Stack } from '@mui/system';
import { Grid, Card, Chip } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

import FormSkeleton from 'src/components/Form/form-skelton';
import { RHFCheckbox, RHFAutocomplete } from 'src/components/hook-form';

import { IUserItem } from 'src/types/user';
import { IDelegationInfo } from 'src/types/delegation';
import { ILookupItem, IApplicationItem } from 'src/types/shared';

type AnyPresentValue = number | string; // Adjust this according to your needs

type Props = {
  currentDelegation?: IDelegationInfo;
  users: any;
  applications: any;
  applicationsLoading: any;
  usersLoading: any;
  delegationTypes: any;
  delegationTypesLoading: any;
};

export interface DelegationNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const DelegationNewEditForm = forwardRef<DelegationNewEditFormHandle, Props>(
  (
    {
      currentDelegation,
      users,
      applications,
      applicationsLoading,
      usersLoading,
      delegationTypesLoading,
      delegationTypes,
    },
    ref
  ) => {
    const router = useRouter();
    const { currentLang } = useLocales();
    const currentLanguage = currentLang.value;

    // Replace Yup schema with Zod schema
    const NewApprovalSchema: any = z.object({
      fromUser: z.string({
        required_error: t('From User is required'),
      }),
      toUser: z
        .string({
          required_error: t('To User is required'),
        })
        .refine((val) => val !== watch('fromUser'), {
          message: t('To User and From User must be different'),
        }),
      delegationScope: z.string({
        required_error: t('Scope is required'),
      }),
      delegationScopeDTO: z.array(z.any()).superRefine((val, ctx) => {
        if (watch('delegationScope') === '2' && (!val || val.length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('Application is required'),
          });
        }
        return true;
      }),
      dateFrom: z.date({
        required_error: t('Date From is required'),
      }),
      dateTo: z
        .date({
          required_error: t('Date To is required'),
        })
        .refine(
          (val) => {
            const dateFrom = watch('dateFrom');
            return !dateFrom || !val || val.getTime() > dateFrom.getTime();
          },
          {
            message: t('dateFrom must be later than dateTo'),
          }
        ),
      active: z.boolean().optional(),
    });

    function convertDateString(dateTimeString: Date) {
      const date = new Date(dateTimeString);

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(date.getUTCDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }
    const defaultValues = useMemo(
      () => ({
        id: currentDelegation?.id ?? 0,
        fromUser: currentDelegation?.fromUser ?? '',
        toUser: currentDelegation?.toUser ?? '',
        dateFrom: currentDelegation?.dateFrom ? new Date(currentDelegation.dateFrom) : new Date(),
        dateTo: currentDelegation?.dateTo ? new Date(currentDelegation.dateTo) : new Date(),

        delegationScopeDTO: currentDelegation?.delegationScopeDTO ?? [],
        active: currentDelegation?.active === 1 || currentDelegation?.active === undefined,
        delegationScope: currentDelegation?.delegationScope ?? '1',
      }),
      [currentDelegation]
    );

    const methods: any = useForm({
      resolver: zodResolver(NewApprovalSchema),
      defaultValues,
    });

    const { reset, control, handleSubmit, trigger, watch, resetField } = methods;

    const onSubmit = handleSubmit(async (data: any) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentDelegation ? 'Update success!' : 'Create success!');
        router.push(paths.security.delegations.management);
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

    const values = watch();
    const render_skeleton = [...Array(1)].map((_, index) => (
      <FormSkeleton key={index} fields={7} />
    ));

    useEffect(() => {
      if (values.delegationScope !== '2') {
        trigger('delegationScopeDTO');
      }
    }, [values.delegationScope, trigger, resetField]);

    return (
      <FormProvider {...methods}>
        <Grid container>
          {usersLoading && applicationsLoading && delegationTypesLoading ? (
            render_skeleton
          ) : (
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
                  <RHFAutocomplete
                    required
                    name="fromUser"
                    label={t('From User')}
                    placeholder={t('From User')}
                    onBlur={() => validateFieldOnBlur('fromUser')}
                    options={!usersLoading ? users.map((option: IUserItem) => option.id) : []}
                    getOptionLabel={(option) => {
                      const selectedOption = !usersLoading
                        ? users.find((item: IUserItem) => item.id === option)
                        : undefined;
                      return selectedOption ? selectedOption.userName : '';
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === null || value === undefined ? true : option === value
                    }
                  />
                  <RHFAutocomplete
                    required
                    name="toUser"
                    label={t('To User')}
                    placeholder={t('Choose To User')}
                    onBlur={() => validateFieldOnBlur('toUser')}
                    options={!usersLoading ? users.map((option: IUserItem) => option.id) : []}
                    getOptionLabel={(option) => {
                      const selectedOption = !usersLoading
                        ? users.find((item: IUserItem) => item.id === option)
                        : undefined;
                      return selectedOption ? selectedOption.userName : '';
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === null || value === undefined ? true : option === value
                    }
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      name="dateFrom"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          minDate={new Date()}
                          label={`${t('Date From')} *`}
                          value={field.value}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            validateFieldOnBlur('dateFrom');
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
                      name="dateTo"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          minDate={new Date()}
                          label={`${t('Date To')} *`}
                          value={field.value}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            validateFieldOnBlur('dateTo');
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

                  <RHFAutocomplete
                    required
                    name="delegationScope"
                    label={t('Scope')}
                    placeholder={t('Choose a Scope')}
                    onBlur={() => validateFieldOnBlur('delegationScope')}
                    options={
                      !delegationTypesLoading
                        ? delegationTypes.map((option: ILookupItem) => option.valueCode)
                        : []
                    }
                    getOptionLabel={(option) => {
                      const selectedOption = !delegationTypesLoading
                        ? delegationTypes.find((item: ILookupItem) => item.valueCode === option)
                        : undefined;
                      return selectedOption ? selectedOption.valueName : '';
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === null || value === undefined ? true : option === value
                    }
                  />
                  <Controller
                    name="delegationScopeDTO"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <RHFAutocomplete
                        multiple
                        label={t('Applications')}
                        name="delegationScopeDTO"
                        placeholder={t('Select Applications')}
                        value={field.value || []}
                        onBlur={() => validateFieldOnBlur('delegationScopeDTO')}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={
                          !applicationsLoading
                            ? applications
                                .filter(
                                  (option: any) =>
                                    option.langCode === (currentLanguage === 'EN' ? 'EN' : 'AR')
                                )

                                .map((option: IApplicationItem) => ({
                                  applicationCode: option.applicationCode,
                                  delegationId: Number(currentDelegation?.id) || 0,
                                  operation: null,
                                }))
                            : []
                        }
                        getOptionLabel={(option) => {
                          const selectedOption = !applicationsLoading
                            ? applications.find(
                                (item: IApplicationItem) =>
                                  item.applicationCode === option.applicationCode &&
                                  item.langCode === (currentLanguage === 'EN' ? 'EN' : 'AR')
                              )
                            : undefined;
                          return selectedOption ? selectedOption.applicationName : '';
                        }}
                        isOptionEqualToValue={(option, value) =>
                          value === null || value === undefined
                            ? true
                            : option.applicationCode === value.applicationCode
                        }
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.applicationCode}
                              label={option.applicationCode}
                              size="small"
                              color="info"
                            />
                          ))
                        }
                        disabled={values.delegationScope !== '2'}
                        required={values.delegationScope === '2'}
                        disableCloseOnSelect
                      />
                    )}
                  />
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <RHFCheckbox name="active" label={t('Active')} />
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

export default DelegationNewEditForm;
