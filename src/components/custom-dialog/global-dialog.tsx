import type { DialogProps } from '@mui/material';

import { useMemo, useEffect } from 'react';
import { useForm, Controller, FormProvider as RHFFormProvider } from 'react-hook-form';

import {
  Card,
  Grid,
  Table,
  Button,
  Dialog,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import { Scrollbar } from 'src/components/scrollbar';
import { RHFTextField } from 'src/components/hook-form';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  onSubmit: (data: any) => void;
  defaultValues?: { [key: string]: { [key: string]: string } };
  dialogTitle: string;
  label: string;
  fieldName: string;
  disabled?: boolean;
  multiline?: boolean;
  validate?: boolean;
  required?: boolean;
};

type ILanguageItem = {
  id: string;
  language: string;
  name: string;
  viewName?: string;
  [key: string]: string | undefined; // 👈 Allow dynamic keys
};

export default function GlobalDialog({
  open,
  onClose,
  onSubmit,
  defaultValues = {},
  dialogTitle,
  label,
  fieldName,
  disabled,
  multiline,
  required,
  validate,
}: Props) {
  const methods = useForm({ defaultValues });

  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const table = useTable(); // ✅ Use updated useTable

  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;

  const tableData = useMemo<ILanguageItem[]>(() => {
    const languages: ILanguageItem[] = [
      { id: '1', language: 'EN', name: '', viewName: t('English') },
      { id: '2', language: 'AR', name: '', viewName: t('Arabic') },
    ];
    return currentLanguage === 'en' ? languages : languages.reverse();
  }, [currentLanguage, t]);

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  const sortedTableData = useMemo(
    () =>
      [...tableData].sort((a, b) => {
        if (table.orderBy) {
          const isAsc = table.order === 'asc';
          return (
            ((a?.[table.orderBy] || '') < (b?.[table.orderBy] || '') ? -1 : 1) * (isAsc ? 1 : -1)
          );
        }
        return 0;
      }),
    [tableData, table.orderBy, table.order]
  );

  const TABLE_HEAD = [
    { id: 'language', label: t('Language') },
    { id: 'name', label },
  ];

  const handleFormSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
    onClose();
  });

  // Validation function for onBlur
  // eslint-disable-next-line consistent-return
  const validateFieldOnBlur = async (name: string) => {
    if (validate) {
      try {
        const isValid = await methods.trigger([name]); // ✅ Ensure proper validation trigger
        return isValid; // ✅ Returns a value
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false; // ✅ Returns a value
      }
    }
  };

  // Reset form on dialog close
  const handleClose = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const getViewName = (language: string | undefined): string =>
    tableData.find((item) => item.language === language)?.viewName || language || '';

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <RHFFormProvider {...methods}>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                  <Scrollbar>
                    <Table size={table.dense ? 'small' : 'medium'}>
                      <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headCells={TABLE_HEAD}
                        rowCount={sortedTableData.length}
                        numSelected={table.selected.length}
                        onSort={(columnId) => table.onSort(columnId)} // ✅ Sorting now works
                      />
                      <TableBody>
                        {sortedTableData
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row) => (
                            <TableRow key={row.id} hover>
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {getViewName(row.language)}
                              </TableCell>
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                <Controller
                                  name={`${fieldName}.${row.language}`}
                                  control={methods.control}
                                  rules={
                                    validate
                                      ? {
                                          required: required
                                            ? `${label} ${t('is required')}`
                                            : false,
                                          minLength: {
                                            value: 3,
                                            message:
                                              currentLanguage === 'ar'
                                                ? ` ${label} ${t('غير صالح')}`
                                                : `${t('Invalid')} ${label}`,
                                          },
                                          validate: (value) =>
                                            /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9\s]{2}[A-Za-z\u0600-\u06FF0-9\s@#$%^&*()]*$/.test(
                                              value
                                            ) || `${t('Invalid')} ${label}`,
                                        }
                                      : undefined
                                  }
                                  render={({ field, fieldState: { error } }) => (
                                    <RHFTextField
                                      {...field}
                                      label={required ? `${label} *` : label}
                                      placeholder={label}
                                      disabled={disabled}
                                      multiline={multiline}
                                      error={!!error}
                                      helperText={error?.message}
                                      onBlur={() =>
                                        validate &&
                                        validateFieldOnBlur(`${fieldName}.${row.language}`)
                                      }
                                    />
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        <TableEmptyRows
                          height={table.dense ? 56 : 76}
                          emptyRows={emptyRows(
                            table.page,
                            table.rowsPerPage,
                            sortedTableData.length
                          )}
                        />
                        <TableNoData notFound={sortedTableData.length === 0} />
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </RHFFormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {t('Close')}
        </Button>
        <Button variant="contained" color="success" onClick={handleFormSubmit} disabled={disabled}>
          {t('Ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
