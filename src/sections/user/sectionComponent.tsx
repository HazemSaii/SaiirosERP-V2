import React from 'react';
import { t } from 'i18next';

import { Grid, Chip, Stack, Divider, MenuItem, Typography, CircularProgress } from '@mui/material';

import { RHFSelect, RHFAutocomplete } from '../../components/hook-form';

interface Section {
  name: string;
  label: string;
}

interface OptionItem {
  id: number; // Example: organizationId, locationId, etc.
  name: string; // Example: organizationName, locationName, etc.
}

interface SectionComponentProps {
  section: Section;
  options: OptionItem[];
  values: any;
  loading: boolean; // Loading state for async options
  validateFieldOnBlur: (name: string) => Promise<boolean>; // Accept function as a prop

}

const SectionComponent: React.FC<SectionComponentProps> = ({
  section,
  options,
  values,
  loading,
  validateFieldOnBlur,
}) => (
  <React.Fragment key={section.name}>
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{section.label}</Typography>
    </Stack>
    <Grid container spacing={2}>
      {/* Scope Dropdown */}
      <Grid item xs={2}>
        <RHFSelect
          required
          name={`${section.name}Scope`}
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

      {/* Autocomplete Dropdown */}
      <Grid item xs={10}>
        <RHFAutocomplete
          name={section.name}
          placeholder={section.label}
          onBlur={() => validateFieldOnBlur(section.name)} // Validate on blur

          label={section.label}
          disabled={values[`${section.name}Scope`] === 1}
          required={values[`${section.name}Scope`] !== 1}
          multiple
          disableCloseOnSelect
          options={loading ? [] : options.map((option) => option.id)}
          getOptionLabel={(option) => {
            const selectedOption = options.find((item) => item.id === option);
            return selectedOption ? selectedOption.name : '';
          }}
          isOptionEqualToValue={(option, value) =>
            typeof option === 'string' ? option === value : option === value
          }
          renderOption={(props, option) => {
            const selectedOption = options.find((item) => item.id === option);
            return (
              <li {...props} key={option}>
                {selectedOption ? selectedOption.name : ''}
              </li>
            );
          }}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => {
              const selectedOption = options.find((item) => item.id === option);
              return selectedOption ? (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={selectedOption.name}
                  size="small"
                  color="info"
                />
              ) : null;
            })
          }
          loading={loading}
          loadingText={<CircularProgress size={20} />}
        />
      </Grid>
    </Grid>
    <Divider />
  </React.Fragment>
);

export default SectionComponent;
