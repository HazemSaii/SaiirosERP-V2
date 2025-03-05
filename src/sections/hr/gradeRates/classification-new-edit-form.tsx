import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFieldArray} from 'react-hook-form';
import { useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import {Iconify} from 'src/components/iconify';
import { schemaHelper } from 'src/components/hook-form';

import ClassificationForm from './classification-form';

type Props = {
  currentOganizationClassification?: any;
  organizations?: any;
  currentGradeRates?: any;
  organizationsValidating?: boolean;
  operation?: string;
  current?: any;
  values?: any;
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
      values,
      currentGradeRates,
    },
    ref
  ) => {
    const { t } = useTranslate();
    const draft = 'edit';
    const isPending = currentGradeRates?.approvalStatus === 'PENDING';
    const gradeRateUnit = currentGradeRates?.gradeRateUnit;
    const gradeRateType = currentGradeRates?.gradeRateType;
    const router = useRouter();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to remove time
const isEdit=operation==="edit"
    const GradeRateDetailSchema = z
  .object({
    detailId: z.union([z.string(), z.number()])
      .transform((val) => String(val))
      .optional(),
// if Null show t("Start date is required")
startDate: z
.preprocess(
  (val) => {
    if (!val) return undefined; // ✅ Ensure null/undefined triggers required_error
    return typeof val === "string" ? new Date(val) : val; // Convert string to Date
  },
  z.date({ required_error: t("Start date is required") }) // ✅ Show required error when null
    .refine(
      (value) => isEdit || value >= today, // If `isCreate`, must be today or later
      { message: t("Start date must be today or later") }
    )
),

      endDate: z
      .union([z.string(), z.date(), z.null()])
      .nullable()
      .transform((value) => (!value ? null : new Date(value))),

    currencyCode: isPending || gradeRateUnit !== "Money"
      ? z.any()
      : schemaHelper.nullableInput(
          z.union([z.string(), z.number(), z.null()])
            .transform((val) => (val === null ? "" : String(val)))
            .refine((val) => val.trim().length > 0, {
              message: t("Currency is required"),
            }),
          { message: t("Currency is required") }
        ),

    gradeRateValue: isPending || gradeRateType !== "VALUE"
      ? z.union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? "" : String(val)))
          .optional()
      : z.union([z.string(), z.number()])
          .transform((val) => String(val))
          .refine((val) => val.trim().length > 0, {
            message: t("Value is required"),
          }),

    gradeRateFrom: isPending || gradeRateType !== "RANGE"
      ? z.union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? "" : String(val)))
          .optional()
      : z.union([z.string(), z.number()])
          .transform((val) => String(val))
          .refine((val) => val.trim().length > 0, {
            message: t("From value is required"),
          }),

    gradeRateTo: isPending || gradeRateType !== "RANGE"
      ? z.union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? "" : String(val)))
          .optional()
      : z.union([z.string(), z.number()])
          .transform((val) => String(val))
          .refine((val) => val.trim().length > 0, {
            message: t("To value is required"),
          }),

    midValue: isPending || gradeRateType !== "RANGE"
      ? z.union([z.string(), z.number(), z.null()])
          .transform((val) => (val === null ? "" : String(val)))
          .optional()
      : z.union([z.string(), z.number()])
          .transform((val) => String(val))
          .refine((val) => val.trim().length > 0, {
            message: t("Mid value is required"),
          }),

    active: z.union([z.boolean(), z.number()])
      .transform((val) => Boolean(val))
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate || !data.startDate) return true; // ✅ Allow empty `endDate`
      return data.endDate > data.startDate; // ✅ Only validate when `endDate` exists
    },
    {
      message: t("End date must be later than start date"),
      path: ["endDate"],
    }
  );



const NewOrganizationSchema = z.object({
  gradeRatesDetailsDTOS: z.array(GradeRateDetailSchema).optional(),
});

    
    
    
    
    
    
    type FormValues = z.infer<typeof NewOrganizationSchema>;
    const defaultValues = useMemo(
      () => ({
        gradeRatesDetailsDTOS: Array.isArray(currentOganizationClassification)
          ? currentOganizationClassification?.map((condition) => ({
              detailId: condition.detailId||'',
              startDate: condition?.startDate || new Date(),
              endDate: condition?.endDate || '',
              currencyCode: condition.currencyCode||'',
              gradeRateValue: condition.gradeRateValue||'',
              gradeRateFrom: condition.gradeRateFrom||'',
              gradeRateTo: condition.gradeRateTo||'',
              midValue: condition.midValue||'',
              active: condition?.active || 1,
            }))
          : [],
      }),
      [currentOganizationClassification]
    );

    const methods = useForm<FormValues>({
      resolver: zodResolver(NewOrganizationSchema),
      defaultValues,
    });
    const { handleSubmit } = methods;
    const handleAdd = () => {
      append({
        detailId: '',
        startDate:new Date() , // ✅ Use undefined instead of null
        endDate: null,   // ✅ Keep endDate consistent
        currencyCode: gradeRateUnit === 'Money' ? '' : '',
        gradeRateValue: gradeRateType === 'VALUE' ? '' : undefined,
        gradeRateFrom: gradeRateType === 'RANGE' ? '' : undefined,
        gradeRateTo: gradeRateType === 'RANGE' ? '' : undefined,
        midValue: gradeRateType === 'RANGE' ? '' : undefined,
        active: false,
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
      name: 'gradeRatesDetailsDTOS',
    });

    useEffect(() => {
      if (
        Array.isArray(currentOganizationClassification) &&
        currentOganizationClassification.length > 0
      ) {
        const formattedapprover = currentOganizationClassification.map((org) => ({
          detailId: org.detailId,
          startDate: org.startDate,
          endDate: org.endDate,
          currencyCode: org.currencyCode,
          gradeRateValue: org.gradeRateValue,
          gradeRateFrom: org.gradeRateFrom,
          gradeRateTo: org.gradeRateTo,
          midValue: org.midValue,
          active: org.active,
        }));
        replace(formattedapprover);
      } else {
        replace([]);
      }
    }, [currentOganizationClassification, replace]);

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Form Submitted Successfully:", data);
    
        toast.success(
          currentOganizationClassification ? t('Update success!') : t('Create success!')
        );
        router.push(paths.hr.organizations.management);
      } catch (error) {
        console.error('Submission error:', error);
      }
    }, (errors) => {
      console.error("Validation failed. Errors:", errors);
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
    

    // Add Classification button is shown only if organizations are available
    // and the number of selected classifications is less than the number of organizations
    return (
      <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
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
                      current={currentGradeRates}
                      gradeRateType={gradeRateType}
                      gradeRateUnit={gradeRateUnit}
                    />
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={() => handleRemove(index)}
                      disabled={isPending}
                    >
                      {t('Remove')}
                    </Button>
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
                {t('Add Details')}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
    
    );
  }
);

export default OganizationClassificationForm;
