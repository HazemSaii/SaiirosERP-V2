import type { IFamilyInfo } from 'src/types/persons';

import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Grid, Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import {Iconify} from 'src/components/iconify';
import { schemaHelper } from 'src/components/hook-form';

import FamilyForm from './family-form';

type Props = {
  currentFamily?: IFamilyInfo;
  PersonalLoading?: any;
  MARITAL_STATUSTypesLoading?: any;
  GENDERTypesLoading?: any;
  RELIGIONTypesLoading?: any;
  countriesLoading?: any;
  RELATIONSHIP_TYPELoading?: any;
  EDUCATION_LEVELLoading?: any;
  MARITAL_STATUSTypes?: any;
  RELATIONSHIP_TYPE?: any;
  GENDERTypes?: any;
  RELIGIONTypes?: any;
  countries?: any;
  EDUCATION_LEVEL?: any;
  isNotChanged?: any;
  operation: string;
  submit: any;
};

export interface FamilyNewEditFormHandle {
  submit: () => void;
  validate: () => Promise<boolean>;
  formData: () => any;
}

const FamilyNewEditForm = forwardRef<FamilyNewEditFormHandle, Props>(
  (
    {
      currentFamily,
      PersonalLoading,
      operation,
      MARITAL_STATUSTypesLoading,
      GENDERTypesLoading,
      RELIGIONTypesLoading,
      countriesLoading,
      RELATIONSHIP_TYPELoading,
      EDUCATION_LEVELLoading,
      MARITAL_STATUSTypes,
      GENDERTypes,
      RELIGIONTypes,
      countries,
      RELATIONSHIP_TYPE,
      EDUCATION_LEVEL,
      isNotChanged,
      submit,
    },
    ref
  ) => {
    const { t } = useTranslate();
    const isEdit = operation === 'edit';

    const router = useRouter();

    // const NewFamilySchema = Yup.object().shape({
    //   familyDTOS: Yup.array().of(
    //     Yup.object().shape({
    //       personId: Yup.string(),
    //       // relationshipType: Yup.string(),
    //       approvalStatus: Yup.string().required(t('Approval Status is required')),
    //       firstName: Yup.string().required(t('First Name is required')),
    //       secondName: Yup.string(),
    //       thirdName: Yup.string(),
    //       lastName: Yup.string().required(t('Last Name is required')),
    //       alternativeFirstName: Yup.string(),
    //       alternativeSecondName: Yup.string(),
    //       alternativeThirdName: Yup.string(),
    //       alternativeLastName: Yup.string(),
    //       dateOfBirth: Yup.date().nullable(),
    //       age: Yup.string(),
    //       maritalStatus: Yup.string(),
    //       gender: Yup.string().required(t('Gender is required')),
    //       religion: Yup.string(),
    //       nationalityCode: Yup.string(),
    //       registeredDisabled: Yup.boolean(),
    //       highestEducationLevel: Yup.string(),
    //       passportNumber: Yup.string(),
    //       nationalId: Yup.string(),
    //       personalEmail: Yup.string(),
    //       personalMobile: Yup.string(),
    //     })
    //   ),
    // });

    const FamilyMemberSchema = z.object({
      personId: schemaHelper.nullableInput(z.string()),
      approvalStatus: z.string().min(1, t('Approval Status is required')),
      firstName: z.string().min(1, t('First Name is required')),
      secondName: schemaHelper.nullableInput(z.string()),
      thirdName: schemaHelper.nullableInput(z.string()),
      lastName: z.string().min(1, t('Last Name is required')),
      alternativeFirstName: schemaHelper.nullableInput(z.string()),
      alternativeSecondName: schemaHelper.nullableInput(z.string()),
      alternativeThirdName: schemaHelper.nullableInput(z.string()),
      alternativeLastName: schemaHelper.nullableInput(z.string()),
      dateOfBirth: schemaHelper.nullableInput(z.date()),
      age: schemaHelper.nullableInput(z.string()),
      maritalStatus: schemaHelper.nullableInput(z.string()),
      gender: z.string().min(1, t('Gender is required')),
      religion: schemaHelper.nullableInput(z.string()),
      nationalityCode: schemaHelper.nullableInput(z.string()),
      registeredDisabled: schemaHelper.nullableInput(z.boolean()),
      highestEducationLevel: schemaHelper.nullableInput(z.string()),
      passportNumber: schemaHelper.nullableInput(z.string()),
      nationalId: schemaHelper.nullableInput(z.string()),
    
      personalEmail: schemaHelper.nullableInput(z.string()).superRefine((value, ctx) => {
        if (value && !/^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('Email must be a valid email address.'),
          });
        }
      }),
    
      personalMobile: schemaHelper.nullableInput(z.string()),
    });
    
     const NewFamilySchema = z.object({
      familyDTOS: z.array(FamilyMemberSchema),
    });
    
    type FormValues = z.infer<typeof NewFamilySchema>;

    const defaultValues = useMemo(
      () => ({
        familyDTOS: Array.isArray(currentFamily)
          ? currentFamily?.map((condition) => ({
              personId: condition?.personId ?? '',
              relationshipType: condition?.relationshipType ?? '',
              approvalStatus: condition?.approvalStatus ?? 'DRAFT',
              firstName: condition?.firstName ?? '',
              secondName: condition?.secondName ?? '',
              thirdName: condition?.thirdName ?? '',
              lastName: condition?.lastName ?? '',
              alternativeFirstName: condition?.alternativeFirstName ?? '',
              alternativeSecondName: condition?.alternativeSecondName ?? '',
              alternativeThirdName: condition?.alternativeThirdName ?? '',
              alternativeLastName: condition?.alternativeLastName ?? '',
              dateOfBirth: condition?.dateOfBirth ? new Date(condition.dateOfBirth) : null,
              age: condition?.age ?? null,
              maritalStatus: condition?.maritalStatus ?? '',
              gender: condition?.gender ?? '',
              religion: condition?.religion ?? '',
              nationalityCode: condition?.nationalityCode ?? '',
              registeredDisabled: condition?.registeredDisabled ?? false,
              highestEducationLevel: condition?.highestEducationLevel ?? '',
              passportNumber: condition?.passportNumber ?? '',
              nationalId: condition?.nationalId ?? '',
              personalEmail: condition?.personalEmail ?? '',
              personalMobile: condition?.personalMobile ?? '',
            }))
          : [],
      }),
      [currentFamily]
    );

    const methods = useForm<FormValues>({
      resolver: zodResolver(NewFamilySchema),
      defaultValues,
    });

    const { handleSubmit } = methods;

    const handleAdd = () => {
      append({
        personId: '',
        approvalStatus: 'DRAFT',
        // // relationshipType:  '',
        firstName: '',
        secondName: '',
        thirdName: '',
        lastName: '',
        alternativeFirstName: '',
        alternativeSecondName: '',
        alternativeThirdName: '',
        alternativeLastName: '',
        dateOfBirth: null,
        age: '',
        maritalStatus: '',
        gender: '',
        religion: '',
        nationalityCode: '',
        registeredDisabled: false,
        highestEducationLevel: '',
        passportNumber: '',
        nationalId: '',
        personalEmail: '',
        personalMobile: '',
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
      name: 'familyDTOS',
    });

    useEffect(() => {
      if (Array.isArray(currentFamily) && currentFamily.length > 0) {
        const formattedapprover = currentFamily.map((condition) => ({
          personId: condition?.personId,
          relationshipType: condition?.relationshipType,
          approvalStatus: condition?.approvalStatus,
          firstName: condition?.firstName,
          secondName: condition?.secondName,
          thirdName: condition?.thirdName,
          lastName: condition?.lastName,
          alternativeFirstName: condition?.alternativeFirstName,
          alternativeSecondName: condition?.alternativeSecondName,
          alternativeThirdName: condition?.alternativeThirdName,
          alternativeLastName: condition?.alternativeLastName,
          dateOfBirth: condition?.dateOfBirth ? new Date(condition.dateOfBirth) : null,
          age: condition?.age,
          maritalStatus: condition?.maritalStatus,
          gender: condition?.gender,
          religion: condition?.religion,
          nationalityCode: condition?.nationalityCode,
          registeredDisabled: condition?.registeredDisabled,
          highestEducationLevel: condition?.highestEducationLevel,
          passportNumber: condition?.passportNumber,
          nationalId: condition?.nationalId,
          personalEmail: condition?.personalEmail,
          personalMobile: condition?.personalMobile,
        }));
        replace(formattedapprover);
      } else if (!isEdit) {
        replace([
          {
            personId: '',
          //   // relationshipType:  '',
            approvalStatus: 'DRAFT',
            firstName: '',
            secondName: '',
            thirdName: '',
            lastName: '',
            alternativeFirstName: '',
            alternativeSecondName: '',
            alternativeThirdName: '',
            alternativeLastName: '',
            dateOfBirth: null,
            age: '',
            maritalStatus: '',
            gender: '',
            religion: '',
            nationalityCode: '',
            registeredDisabled: false,
            highestEducationLevel: '',
            passportNumber: '',
            nationalId: '',
            personalEmail: '',
            personalMobile: '',
          },
        ]);
      }
    }, [currentFamily, isEdit, replace]);

    const onSubmit = handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(currentFamily ? t('Update success!') : t('Create success!'));
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
        return data.familyDTOS;
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
            <Box display="flex" justifyContent="flex-end" gap={2} p={1}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#333' },
                }}
                onClick={submit}
              >
                {t('Submit')}
              </Button>
            </Box>
            {fields.map((item, index) => (
              <Card key={item.id} sx={{ p: 3, mb: 1 }}>
                <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
                  <Stack alignItems="flex-end" spacing={1.5}>
                    <FamilyForm
                      itemKey={item.id}
                      index={index}
                      operation="edit"
                      currentFamily={currentFamily || undefined}
                      MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
                      GENDERTypesLoading={GENDERTypesLoading}
                      RELIGIONTypesLoading={RELIGIONTypesLoading}
                      RELATIONSHIP_TYPELoading={RELATIONSHIP_TYPELoading}
                      countriesLoading={countriesLoading}
                      EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
                      MARITAL_STATUSTypes={MARITAL_STATUSTypes}
                      GENDERTypes={GENDERTypes}
                      RELIGIONTypes={RELIGIONTypes}
                      countries={countries}
                      RELATIONSHIP_TYPE={RELATIONSHIP_TYPE}
                      EDUCATION_LEVEL={EDUCATION_LEVEL}
                      submit={submit}
                      isNotChanged={isNotChanged}
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

            {/* {organizations && fields.length < organizations.length  && ( */}
            {/* <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAdd}
                sx={{ flexShrink: 0 }}
                // disabled={isPending}
              >
              {  t('Add New')}
              </Button> */}
            {/* )} */}
          </Grid>
        </Grid>
        </form>
      </FormProvider>
    );
  }
);

export default FamilyNewEditForm;
