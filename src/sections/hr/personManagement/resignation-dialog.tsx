import type { DialogProps } from '@mui/material/Dialog';

import { z } from 'zod';
import { toast } from 'sonner';
import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Card, Grid } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { useTranslate } from 'src/locales';
import { UseresignEmployee, UseterminateContract } from 'src/actions/Hr/contract';

import { RHFTextField, schemaHelper, RHFAutocomplete } from 'src/components/hook-form';

type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  row: any;
  END_CONTRACT_REASONS: any;
  END_CONTRACT_REASONSLoading: any;
  title: any;
};
// type FormValues = {
//   newPassword: string;
//   confirmPassword: string;
//   userId: string;
// };
export default function ResignationDialog({
  row,
  open,
  title,
  onClose,
  END_CONTRACT_REASONS,
  END_CONTRACT_REASONSLoading,
}: Props) {
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

  const NewSchema = z.object({
    reason: z.string().min(1, { message: t('Reason is required') }), // Ensures a non-empty string

    notes: z.any().optional(), // Optional string

    finalProcessDate: schemaHelper.nullableInput(z.date()), // Uses schemaHelper for nullable date

    approvalStatus: z.any().optional(), // Optional string
  });
  const { personId = '', contractId = '' } = row || {};

  const defaultValues = useMemo(
    () => ({
      personId: personId || '',
      contractId: contractId || '',
      reason: '',
      notes: '',
      finalProcessDate: '',
      approvalStatus: 'DRAFT',
    }),
    []
  );
  const methods = useForm({
    resolver: zodResolver(NewSchema),
    defaultValues,
  });
  const { handleSubmit, trigger } = methods;

  const onSubmit = handleSubmit(async () => {
    const data = formData();
    console.log('data', data);

    try {
      let res;
      if (title === t('Resignation')) {
        res = await UseresignEmployee(data);
      } else if (title === t('Termination')) {
        res = await UseterminateContract(data);
      }

      if (res && res.status === 200) {
        toast.success(t(`${title} ${t('action completed successfully!')}`));
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(1, 1fr)',
                    }}
                  >
                    <RHFAutocomplete
                      name="reason"
                      // type="reason"
                      required
                      label={t('Reason')}
                      placeholder={t('Choose a Reason')}
                      onBlur={() => validateFieldOnBlur('reason')}
                      options={
                        !END_CONTRACT_REASONSLoading
                          ? END_CONTRACT_REASONS.map((option: any) => option.valueCode)
                          : []
                      }
                      getOptionLabel={(option) => {
                        const selectedOption = !END_CONTRACT_REASONSLoading
                          ? END_CONTRACT_REASONS.find((item: any) => item.valueCode === option)
                          : undefined;
                        return selectedOption ? selectedOption.valueName : '';
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === null || value === undefined ? true : option === value
                      }
                    />
                    <RHFTextField name="notes" label={t('Notes')} placeholder={t('Notes')} />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name="finalProcessDate"
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            minDate={new Date()}
                            label={`${t('Last work Date')} `}
                            value={field.value}
                            format="dd/MM/yyyy"
                            onChange={(newValue) => {
                              field.onChange(newValue);
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
                    <RHFTextField
                      name="approvalStatus"
                      label={t('Approval Status')}
                      required
                      disabled
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </form>
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
