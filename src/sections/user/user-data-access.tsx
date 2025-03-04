import { t } from 'i18next';
import { useForm } from 'react-hook-form';
// Replace yupResolver with zodResolver
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Chip, Stack, Divider, MenuItem, Typography } from '@mui/material';
import { FormProvider, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import SectionComponent from 'src/sections/user/sectionComponent';
import { IPersonItem } from 'src/types/perosn';
import { IUserDataAccess } from 'src/types/user';
import { IOrganizationsItem } from 'src/types/organization';
import { useGetPersons } from '../../actions/general/person';
import { useGetOrganizations } from '../../actions/general/organization';

interface Section {
  name: string;
  label: string;
}

type Props = {
  currentUserDataAccess?: IUserDataAccess;
  id?: string;
  approvedpersonsLoading: any;
  approvedpersons: any;
  approvedorganizationsLoading: any;
  approvedorganizations: any;
  approvedlocationsLoading: any;
  approvedlocations: any;
  legalEntitiesLoading: any;
  legalEntities: any;
  ledgers: any;
  ledgersLoading: any;
  businessUnitesLoading: any;
  businessUnites: any;
  accountsLoading: any;
  accounts: any;
};

export interface UserDataAccessFormHandle {
  validate: () => Promise<boolean>;
  formData: () => any;
}

const UserDataAccessForm = forwardRef<UserDataAccessFormHandle, Props>(
  (
    {
      currentUserDataAccess,
      approvedpersonsLoading,
      approvedpersons,
      approvedlocationsLoading,
      approvedlocations,
      legalEntitiesLoading,
      legalEntities,
      ledgers,
      ledgersLoading,
      businessUnitesLoading,
      businessUnites,
      accountsLoading,
      accounts,
      approvedorganizations,
      approvedorganizationsLoading,
    },
    ref
  ) => {
    const sections: any[] = [
      {
        name: 'location',
        label: t('Location'),
        options:
          approvedlocations?.map((loc: any) => ({ id: loc.locationId, name: loc.locationName })) ||
          [],
        loading: approvedlocationsLoading,
      },
      {
        name: 'ledger',
        label: t('Ledger'),
        options:
          ledgers?.map((ledger: any) => ({ id: ledger.ledgerId, name: ledger.ledgerName })) || [],
        loading: ledgersLoading,
      },
      {
        name: 'legalEntity',
        label: t('Legal Entity'),
        options:
          legalEntities?.map((entity: any) => ({
            id: entity.legalEntityId,
            name: entity.legalEntityName,
          })) || [],
        loading: legalEntitiesLoading,
      },
      {
        name: 'businessUnit',
        label: t('Business Unit'),
        options:
          businessUnites?.map((unit: any) => ({
            id: unit.businessUnitId,
            name: unit.businessUnitName,
          })) || [],
        loading: businessUnitesLoading,
      },
      {
        name: 'account',
        label: t('Account'),
        options:
          accounts?.map((account: any) => ({
            id: Number(account.accountId),
            name: account.accountName,
          })) || [],
        loading: accountsLoading,
      },
    ];
    const locationsIds = useMemo(
      () => approvedlocations.map((p: any) => p.locationId),
      [approvedlocations]
    );
    const organizationsIds = useMemo(
      () => approvedorganizations.map((p: any) => p.organizationId),
      [approvedorganizations]
    );
    const personsIds = useMemo(
      () => approvedpersons.map((p: any) => p.personId),
      [approvedpersons]
    );
    const legalEntitiesIds = useMemo(
      () => legalEntities.map((p: any) => p.legalEntityId),
      [legalEntities]
    );
    const businessUnitsids = useMemo(
      () => businessUnites.map((p: any) => p.businessUnitId),
      [businessUnites]
    );

    const [personsData, setPersonsData] = useState<IPersonItem[]>([]);
    const [organizationsData, setOrganizationsData] = useState<IOrganizationsItem[]>([]);
    const conditionalValidation = (scopeField: string, fieldName: string) =>
      z.array(z.any()).superRefine((value, ctx) => {
        const scopeValue = methods.getValues(scopeField as any);
        if ((scopeValue === 2 || scopeValue === 3) && value.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${fieldName} is required`,
          });
        }
      });
    // Keep the rest of the DataAccessSchema the same
    const DataAccessSchema = z.object({
      personScope: z.number(),
      personHierarchy: z.boolean().default(true),
      person: z.array(z.any()).superRefine((value, ctx) => {
        const { personScope, personHierarchy } = methods.getValues();
        if ((personScope === 2 || personScope === 3) && !personHierarchy && value.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Person is required',
          });
        }
      }),
      manager: z
        .any()
        .nullable()
        .superRefine((value, ctx) => {
          const { personScope, personHierarchy } = methods.getValues();
          if ((personScope === 2 || personScope === 3) && personHierarchy && value === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Manager is required',
            });
          }
        }),
      perTop: z.boolean(),
      organizationScope: z.number(),
      organizationHierarchy: z.boolean(),
      organization: z.array(z.any()).superRefine((value, ctx) => {
        const { organizationScope, organizationHierarchy } = methods.getValues();
        if (
          (organizationScope === 2 || organizationScope === 3) &&
          !organizationHierarchy &&
          value.length === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Organization is required',
          });
        }
      }),
      organizationManager: z
        .any()
        .nullable()
        .superRefine((value, ctx) => {
          const { organizationScope, organizationHierarchy } = methods.getValues();
          if (
            (organizationScope === 2 || organizationScope === 3) &&
            organizationHierarchy &&
            value === null
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Organization is required',
            });
          }
        }),
      orgTop: z.boolean(),
      payrollScope: z.number(),
      payroll: conditionalValidation('payrollScope', 'Payroll'),
      locationScope: z.number(),
      location: conditionalValidation('locationScope', 'Location'),
      ledgerScope: z.number(),
      ledger: conditionalValidation('ledgerScope', 'Ledger'),
      legalEntityScope: z.number(),
      legalEntity: conditionalValidation('legalEntityScope', 'Legal Entity'),
      businessUnitScope: z.number(),
      businessUnit: conditionalValidation('businessUnitScope', 'Business Unit'),
      accountScope: z.number(),
      account: conditionalValidation('accountScope', 'Account'),
    });
    const defaultValues = useMemo(
      () => ({
        personScope: currentUserDataAccess?.personScope || 1,
        person: (Array.isArray(currentUserDataAccess?.person)
          ? currentUserDataAccess.person
          : [currentUserDataAccess?.person]
        ).filter((loc) => personsIds.includes(loc)),
        manager: personsIds.includes(currentUserDataAccess?.manager)
          ? currentUserDataAccess?.manager
          : '',

        personHierarchy: currentUserDataAccess?.personHierarchy || false,
        perTop: currentUserDataAccess?.perTop || false,
        organizationScope: currentUserDataAccess?.organizationScope || 1,
        organization: (Array.isArray(currentUserDataAccess?.organization)
          ? currentUserDataAccess.organization
          : [currentUserDataAccess?.organization]
        ).filter((loc) => organizationsIds.includes(loc)),
        organizationManager: organizationsIds.includes(currentUserDataAccess?.organizationManager)
          ? currentUserDataAccess?.organizationManager
          : '',

        organizationHierarchy: currentUserDataAccess?.organizationHierarchy || false,
        orgTop: currentUserDataAccess?.orgTop || false,
        payrollScope: currentUserDataAccess?.payrollScope || 1,
        payroll: currentUserDataAccess?.payroll || [],
        locationScope: currentUserDataAccess?.locationScope || 1,
        location: (Array.isArray(currentUserDataAccess?.location)
          ? currentUserDataAccess.location
          : [currentUserDataAccess?.location]
        ).filter((loc) => locationsIds.includes(loc)),

        ledgerScope: currentUserDataAccess?.ledgerScope || 1,
        ledger: currentUserDataAccess?.ledger || [],
        legalEntityScope: currentUserDataAccess?.legalEntityScope || 1,
        legalEntity: (Array.isArray(currentUserDataAccess?.legalEntity)
          ? currentUserDataAccess.legalEntity
          : [currentUserDataAccess?.legalEntity]
        ).filter((loc) => legalEntitiesIds.includes(loc)),
        businessUnitScope: currentUserDataAccess?.businessUnitScope || 1,
        businessUnit: (Array.isArray(currentUserDataAccess?.businessUnit)
          ? currentUserDataAccess.businessUnit
          : [currentUserDataAccess?.businessUnit]
        ).filter((loc) => businessUnitsids.includes(loc)),
        accountScope: currentUserDataAccess?.accountScope || 1,
        account: currentUserDataAccess?.account || [],
      }),
      [currentUserDataAccess]
    );
    const methods = useForm({
      resolver: zodResolver(DataAccessSchema),
      defaultValues,
    });
    const formData = () => {
      try {
        const data = methods.watch();
        return data;
      } catch (error) {
        console.error('Form data error:', error);
        return false;
      }
    };
    const validateForm = async () => {
      try {
        const isValid = await methods.trigger();
        return isValid;
      } catch (error) {
        console.error('Form validation error:', error);
        return false;
      }
    };
    useImperativeHandle(ref, () => ({
      validate: validateForm,
      formData,
    }));
    const { setValue, watch, reset, control } = methods;
    const values = watch();
    useEffect(() => {
      setPersonsData(approvedpersons || []);
      setOrganizationsData(approvedorganizations || []);
    }, [currentUserDataAccess, approvedpersons, approvedorganizations]);

    const handlePersonChange = (name: any) => (event: any, newValue: any) => {
      if (Array.isArray(newValue)) {
        const newValues = newValue.map((option) => option.personId ?? option);
        setValue(name, newValues);
      }
    };
    const handleOrganizationChange = (name: any) => (event: any, newValue: any) => {
      if (Array.isArray(newValue)) {
        const newValues = newValue.map((option) => option.organizationId ?? option);
        setValue(name, newValues);
      }
    };
    const personBoxCahnge = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('personHierarchy', event.target.checked);
      setValue('person', []);
      setValue('manager', '');
    };
    const { trigger } = methods;

    const validateFieldOnBlur = async (name: any) => {
      try {
        const isValid = await trigger(name);
        return isValid;
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false;
      }
    };
    const organizationBoxCahnge = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('organizationHierarchy', event.target.checked);
      setValue('organization', []);
      setValue('organizationManager', '');
    };
    return (
      <FormProvider methods={methods}>
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
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{t('Person')}</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <RHFSelect
                      required
                      name="personScope"
                      size="small"
                      label={t('Scope')}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        height: 50,
                        '& .MuiInputBase-root': {
                          height: '100%',
                        },
                      }}
                    >
                      <MenuItem value={1}>All</MenuItem>
                      <MenuItem value={2}>Include</MenuItem>
                      <MenuItem value={3}>Exclude</MenuItem>
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={2} sx={{ pt: 2, ml: 4 }}>
                    <FormControlLabel
                      label={t('Hierarchy')}
                      control={
                        <Checkbox
                          size="medium"
                          name="personHierarchy"
                          checked={values.personHierarchy}
                          onChange={personBoxCahnge}
                          disabled={values.personScope === 1}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {values.personHierarchy ? (
                      <RHFAutocomplete
                        name="manager"
                        label="Manager"
                        placeholder="Manager"
                        disabled={values.personScope === 1}
                        required={values.personScope !== 1}
                        options={
                          !approvedpersonsLoading
                            ? personsData.map((option: IPersonItem) => option.personId)
                            : []
                        }
                        getOptionLabel={(option) => {
                          const selectedOption = !approvedpersonsLoading
                            ? personsData.find((item: IPersonItem) => item.personId === option)
                            : undefined;
                          return selectedOption ? selectedOption.fullName : '';
                        }}
                        isOptionEqualToValue={(option, value) =>
                          value === null || value === undefined ? true : option === value
                        }
                        onBlur={() => validateFieldOnBlur('manager')}
                      />
                    ) : (
                      <RHFAutocomplete
                        onBlur={() => validateFieldOnBlur('person')}
                        name="person"
                        label={t('Person')}
                        placeholder={t('Person')}
                        disabled={values.personScope === 1}
                        required={values.personScope !== 1}
                        value={personsData.filter((p) => values.person?.includes(p.personId))}
                        onChange={handlePersonChange('person')}
                        multiple={!values.personHierarchy}
                        disableCloseOnSelect={!values.personHierarchy}
                        options={personsData}
                        getOptionLabel={(option: any) => option.fullName || ''}
                        renderOption={(props, option) => (
                          <li {...props} key={option.personId}>
                            {option.fullName}
                          </li>
                        )}
                        renderTags={(selected, getTagProps) =>
                          selected.map((selectedOption, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={selectedOption.personId}
                              label={selectedOption.fullName}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          ))
                        }
                      />
                    )}
                  </Grid>
                  <Grid item sx={{ ml: 7, pt: 2 }}>
                    <FormControlLabel
                      label="Top"
                      control={
                        <Checkbox
                          size="medium"
                          name="perTop"
                          checked={values.perTop}
                          onChange={(event) => setValue('perTop', event.target.checked)}
                          disabled={values.personScope === 1}
                          required={values.personScope !== 1}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{t('Organization')}</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <RHFSelect
                      required
                      name="organizationScope"
                      size="small"
                      label={t('Scope')}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        height: 50,
                        '& .MuiInputBase-root': {
                          height: '100%',
                        },
                      }}
                    >
                      <MenuItem value={1}>All</MenuItem>
                      <MenuItem value={2}>Include</MenuItem>
                      <MenuItem value={3}>Exclude</MenuItem>
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={2} sx={{ pt: 2, ml: 4 }}>
                    <FormControlLabel
                      label={t('Hierarchy')}
                      control={
                        <Checkbox
                          size="medium"
                          name="orgHierarchy"
                          checked={values.organizationHierarchy}
                          onChange={organizationBoxCahnge}
                          disabled={values.organizationScope === 1}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {values.organizationHierarchy ? (
                      <RHFAutocomplete
                        onBlur={() => validateFieldOnBlur('organizationManager')}
                        name="organizationManager"
                        label="Organization"
                        placeholder="Organization"
                        disabled={values.organizationScope === 1}
                        required={values.organizationScope !== 1}
                        options={
                          !approvedorganizationsLoading
                            ? organizationsData.map(
                                (option: IOrganizationsItem) => option.organizationId
                              )
                            : []
                        }
                        getOptionLabel={(option) => {
                          const selectedOption = !approvedorganizationsLoading
                            ? organizationsData.find(
                                (item: IOrganizationsItem) => item.organizationId === option
                              )
                            : undefined;
                          return selectedOption ? selectedOption.organizationName : '';
                        }}
                        isOptionEqualToValue={(option, value) =>
                          typeof option === 'string' ? option === value : option === value
                        }
                      />
                    ) : (
                      <RHFAutocomplete
                        onBlur={() => validateFieldOnBlur('organization')}
                        name="organization"
                        label={t('Organization')}
                        placeholder={t('Organization')}
                        disabled={values.organizationScope === 1}
                        required={values.organizationScope !== 1}
                        value={organizationsData.filter((org) =>
                          values.organization?.includes(org.organizationId)
                        )}
                        onChange={handleOrganizationChange('organization')}
                        multiple={!values.organizationHierarchy}
                        disableCloseOnSelect={!values.organizationHierarchy}
                        options={organizationsData}
                        getOptionLabel={(option: any) => option.organizationName || ''}
                        renderOption={(props, option) => (
                          <li {...props} key={option.organizationId}>
                            {option.organizationName}
                          </li>
                        )}
                        renderTags={(selected, getTagProps) =>
                          selected.map((selectedOption, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={selectedOption.organizationId}
                              label={selectedOption.organizationName}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          ))
                        }
                      />
                    )}
                  </Grid>
                  <Grid item sx={{ ml: 7, pt: 2 }}>
                    <FormControlLabel
                      label="Top"
                      control={
                        <Checkbox
                          size="medium"
                          name="orgTop"
                          checked={values.orgTop}
                          onChange={(event) => setValue('orgTop', event.target.checked)}
                          disabled={values.organizationScope === 1}
                          required={values.organizationScope !== 1}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <Divider />
                {sections.map((section) => (
                  <SectionComponent
                    key={section.name}
                    values={values}
                    section={section}
                    options={section.options}
                    loading={section.loading}
                    validateFieldOnBlur={validateFieldOnBlur} // Pass validation function
                  />
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default UserDataAccessForm;
