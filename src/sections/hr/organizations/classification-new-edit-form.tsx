import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import ClassificationForm from './classification-form';

type Props = {
  currentOganizationClassification?: any;
  organizations?: any;
  organizationsValidating?: boolean;
  operation: string;
  current?: any;
};

export interface OganizationClassificationFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const OganizationClassificationForm = forwardRef<OganizationClassificationFormHandle, Props>(
  (
    {
      currentOganizationClassification,
      organizations,
      organizationsValidating,
      operation,
      current,
    },
    ref
  ) => {
    const { t } = useTranslate();
    const isEdit = operation === 'edit';
    const isPending = current?.approvalStatus === 'PENDING';

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const NewOrganizationSchema = Yup.object().shape({
      orgnClassificationsDTOS: Yup.array().of(
        Yup.object().shape({
          classificationCode: Yup.string().required(t('Classification Name is required')),
          active: Yup.boolean(),
        })
      ),
    });

    type FormValues = Yup.InferType<typeof NewOrganizationSchema>;

    const defaultValues = useMemo(
      () => ({
        orgnClassificationsDTOS: Array.isArray(currentOganizationClassification)
          ? currentOganizationClassification?.map((condition) => ({
              organizationId: condition.organizationId,
              classificationCode: condition.classificationCode,
              active: condition.active,
              // createdByUserName: condition.createdBy,
              // updatedByUserName: condition.createdAt,
              // createdDate: condition.updatedAt,
              // updatedDate: condition.updatedBy
            }))
          : [],
      }),
      [currentOganizationClassification]
    );

    const methods = useForm<FormValues>({
      resolver: yupResolver(NewOrganizationSchema),
      defaultValues,
    });

    const { handleSubmit } = methods;

    const handleAdd = () => {
      append({
        // organizationId: 0,
        classificationCode: '',
        active: true,
        // createdByUserName: '',
        // updatedByUserName: '',
        // createdDate:'',
        // updatedDate: '',
      });
    };

    const handleRemove = (index: number) => {
      const fieldsToClear = [] as const;
      fieldsToClear.forEach((fieldName: any) => {
        const fieldArray = methods.getValues(fieldName);
        if (fieldArray && Array.isArray(fieldArray)) {
          const updatedArray = [...fieldArray];
          updatedArray.splice(index, 1);
          methods.setValue(fieldName, updatedArray);
        }
      });
      remove(index);
    };

    const { fields, append, remove, replace } = useFieldArray({
      control: methods.control,
      name: 'orgnClassificationsDTOS',
    });

    useEffect(() => {
      if (
        Array.isArray(currentOganizationClassification) &&
        currentOganizationClassification.length > 0
      ) {
        const formattedapprover = currentOganizationClassification.map((org) => ({
          organizationId: currentOganizationClassification,
          classificationCode: org.classificationCode,
          active: org.active,
          createdByUserName: org.createdByUserName,
          updatedByUserName: org.updatedByUserName,
          createdDate: org.createdDate,
          updatedDate: org.updatedDate,
        }));
        replace(formattedapprover);
      } else {
        replace([]);
      }
    }, [currentOganizationClassification, replace]);

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar(
          currentOganizationClassification ? t('Update success!') : t('Create success!')
        );
        router.push(paths.hr.organizations.management);
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

    // Add Classification button is shown only if organizations are available
    // and the number of selected classifications is less than the number of organizations
    return (
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container>
          <Grid xs={12} md={12}>
            {fields.map((item, index) => (
              <Card key={item.id} sx={{ p: 3, mb: 1 }}>
                <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
                  <Stack alignItems="flex-end" spacing={1.5}>
                    <ClassificationForm
                      itemKey={item.id}
                      index={index}
                      organizations={organizations}
                      organizationsValidating={organizationsValidating}
                      operation={operation}
                      current={current}
                    />
                    {!isEdit && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        onClick={() => handleRemove(index)}
                      >
                        {t('Remove')}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Card>
            ))}

            {organizations && fields.length < organizations.length && (
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAdd}
                sx={{ flexShrink: 0 }}
                disabled={isPending}
              >
                {t('Add Classification')}
              </Button>
            )}
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default OganizationClassificationForm;
