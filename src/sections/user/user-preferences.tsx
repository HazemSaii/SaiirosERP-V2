import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { useLocales, useTranslate } from 'src/locales';

import { FormProvider, RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IUserPreferences } from 'src/types/user';

import { ILanguageItem } from '../../types/shared';

// ----------------------------------------------------------------------

type Props = {
  currentUserPreferences?: IUserPreferences;
  DEFAULT_DATE_FORMAT_Loading: any;
  DEFAULT_DATE_FORMAT: any;
  timeZonesLoading: any;
  timeZones: any;
  languagesLoading: any;
  languages: any;
  operation: any;
};

export interface UserPreferencesFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}
const UserPreferencesForm = forwardRef<UserPreferencesFormHandle, Props>(
  (
    {
      currentUserPreferences,
      DEFAULT_DATE_FORMAT_Loading,
      DEFAULT_DATE_FORMAT,
      timeZonesLoading,
      timeZones,
      languagesLoading,
      languages,
      operation,
    },
    ref
  ) => {
    const { currentLang } = useLocales();
    const pages = [
      {
        label: 'Dashboard',
        code: 1,
      },
    ];
    const startPageIds = useMemo(() => pages.map((p: any) => p.code), [pages]);
    const defaultDateFormatIds = useMemo(
      () => DEFAULT_DATE_FORMAT.map((p: any) => p.valueCode),
      [DEFAULT_DATE_FORMAT]
    );
    const defaultTimezonIds = useMemo(() => timeZones.map((p: any) => p.timezoneId), [timeZones]);
    const languagesIds = useMemo(() => languages.map((p: any) => p.langCode), [languages]);

    const { t } = useTranslate();
    const PreferencesSchema = z.object({
      defaultLangCode: z.string().min(1, t('Default Language is required')),
      defaultTimezoneId: z.number().min(1, t('Default Time Zone is required')),
      startPage: z.number().min(1, t('Starter Page is required')),
      defaultDateFormat: z.string().min(1, t('Date Format is required')),
      receiveEmail: z.boolean(),
    });

    const defaultValues = useMemo(
      () => ({
        startPage: startPageIds.includes(currentUserPreferences?.startPage)
          ? currentUserPreferences?.startPage
          : '',

        defaultLangCode: languagesIds.includes(currentUserPreferences?.defaultLangCode)
          ? String(currentUserPreferences?.defaultLangCode)
          : '49',

        defaultTimezoneId: defaultTimezonIds.includes(currentUserPreferences?.defaultTimezoneId)
          ? Number(currentUserPreferences?.defaultTimezoneId)
          : 1,

        defaultDateFormat: currentUserPreferences?.defaultDateFormat
          ? String(currentUserPreferences.defaultDateFormat)
          : 'dd-MM-yyyy',

        receiveEmail: currentUserPreferences?.receiveEmail === 1,
      }),
      [currentUserPreferences]
    );

    const methods = useForm({
      resolver: zodResolver(PreferencesSchema),
      defaultValues,
    });

    // useEffect(() => {
    //   if (currentUserPreferences) {
    //     reset({
    //       defaultLangCode: currentUserPreferences?.defaultLangCode || '',
    //       defaultTimezoneId: currentUserPreferences?.defaultTimezoneId || 94,
    //       startPage: currentUserPreferences?.startPage || pages[0],
    //       defaultDateFormat: currentUserPreferences?.defaultDateFormat || 'dd-MM-yyyy',
    //       receiveEmail: currentUserPreferences?.receiveEmail === 1,
    //     });
    //   }
    // }, [currentUserPreferences, reset]);
    const { reset, control, handleSubmit, trigger, setValue, watch } = methods; // ✅ Get setValue from methods

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentUserPreferences ? 'Update success!' : 'Create success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
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
        const value = watch(name);

        if (!value) {
          setValue(name, '', { shouldValidate: true }); // Force validation on empty field
        }

        await trigger(name); // Ensure validation runs
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
      }
    };
    const isEdit = operation === 'edit';

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
                <RHFAutocomplete
                  required
                  onBlur={() => validateFieldOnBlur('defaultLangCode')}
                  name="defaultLangCode"
                  label={t('Default Language')}
                  placeholder={t('Choose preferred language')}
                  options={
                    !languagesLoading
                      ? languages.map((option: ILanguageItem) => option.langCode)
                      : []
                  }
                  getOptionLabel={(option) => {
                    const selectedOption = !languagesLoading
                      ? languages.find((item: ILanguageItem) => item.langCode === option)
                      : undefined;
                    return selectedOption ? selectedOption.langName : '';
                  }}
                  isOptionEqualToValue={(option, value) =>
                    typeof option === 'string' ? option === value : option === value || value === ''
                  }
                  disabled={isEdit}
                />
                <RHFAutocomplete
                  required
                  onBlur={() => validateFieldOnBlur('defaultTimezoneId')}
                  name="defaultTimezoneId"
                  label={t('Default Time Zone')}
                  placeholder={t('Choose preferred time zone')}
                  options={
                    !timeZonesLoading ? timeZones.map((option: any) => option.timezoneId) : []
                  }
                  getOptionLabel={(option) => {
                    const selectedOption = !timeZonesLoading
                      ? timeZones.find((item: any) => item.timezoneId === option)
                      : undefined;
                    return selectedOption ? selectedOption.timezoneName : '';
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === null || value === undefined ? true : option === value
                  }
                  disabled={isEdit}
                />

                <RHFAutocomplete
                  required
                  onBlur={() => validateFieldOnBlur('startPage')}
                  name="startPage"
                  label={t('Start Page')}
                  placeholder={t('Choose preferred start page')}
                  options={pages.map((option: any) => option.code)}
                  getOptionLabel={(option: any) => {
                    const selectedOption = pages.find((item: any) => item.code === option);

                    return selectedOption ? selectedOption.label : '';
                  }}
                  isOptionEqualToValue={(option: any, value: any) =>
                    value === null || value === undefined ? true : option === value
                  }
                  disabled={isEdit}
                />
                <RHFAutocomplete
                  required
                  onBlur={() => validateFieldOnBlur('defaultDateFormat')}
                  name="defaultDateFormat"
                  label={t('Date Format')}
                  placeholder={t('Choose preferred date format')}
                  options={
                    !DEFAULT_DATE_FORMAT_Loading
                      ? DEFAULT_DATE_FORMAT.map((option: any) => option.valueCode)
                      : []
                  }
                  getOptionLabel={(option) => {
                    const selectedOption = !DEFAULT_DATE_FORMAT_Loading
                      ? DEFAULT_DATE_FORMAT.find((item: any) => item.valueCode === option)
                      : undefined;
                    return selectedOption ? selectedOption.valueName : '';
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === null || value === undefined ? true : option === value
                  }
                  disabled={isEdit}
                />
                {/* <RHFAutocomplete
                  required
                  name="defaultDateFormat"
                  type="DateFormat"
                  label={t('Date Format')}
                  placeholder={t('Choose preferred date format')}
                  options={formats.map((option) => option.label)}
                  defaultValue="dd-MM-yyyy"
                  getOptionLabel={(option) => option}
                /> */}
                <RHFCheckbox name="receiveEmail" label={t('Receive Emails')} disabled={isEdit} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);
export default UserPreferencesForm;
