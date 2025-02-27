import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import {Iconify} from 'src/components/iconify';

import { GlobalDialog } from '../custom-dialog';



interface Props {
  name: string;
  fieldName: string;
  dialogTitle: string;
  label: string;
  helperText?: string;
  type?: string;
  disabled?: boolean;
  multiline?: boolean;
  validate?: any;
  required?: boolean;
  index?: number;
  [key: string]: any;
}

export default function RHFGlobalTextField({
  name,
  fieldName,
  dialogTitle,
  label,
  helperText,
  type,
  disabled,
  multiline,
  validate,
  required,
  index,
  ...other
}: Props) {
  const globalDialog = useBoolean();
  const { control, setValue, getValues } = useFormContext();

  // Assuming array structure with nested language fields
  const fieldPath = `${fieldName}`;

  const handleDialogSubmit = (data: any) => {
    Object.keys(data[fieldName]).forEach((language) => {
      setValue(`${fieldPath}.${language}`, data[fieldName][language]);
    });
  };
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            type={type}
            label={required ? `${label} *` : label}
            value={type === 'number' && field.value === 0 ? '' : field.value}
            onChange={(event) => {
              const value = type === 'number' ? Number(event.target.value) : event.target.value;
              field.onChange(value);
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            disabled={disabled}
            multiline={multiline}
            InputLabelProps={{ shrink: true }}
            {...other}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={globalDialog.onTrue}>
                  <Iconify icon="solar:global-outline" width={24} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <GlobalDialog
        open={globalDialog.value}
        onClose={globalDialog.onFalse}
        onSubmit={handleDialogSubmit}
        defaultValues={{
          [fieldName]: {
            EN: getValues(`${fieldPath}.EN`) || '',
            AR: getValues(`${fieldPath}.AR`) || '',
          },
        }}
        dialogTitle={dialogTitle}
        label={label}
        fieldName={fieldName}
        disabled={disabled}
        multiline={multiline}
        validate={validate}
        required={required}
        
      />
    </>
  );
}