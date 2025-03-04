import type { SelectChangeEvent } from '@mui/material/Select';
import type { IPersonsTableFilters } from 'src/types/persons';

import { t } from 'i18next';
import { useState, useCallback } from 'react';

import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem, Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

type OrganizationOption = {
  organizationId: string;
  organizationName: string;
  label?: string; // Optional label for display
};

type Props = {
  filters: IPersonsTableFilters;
  onFilters: (name: string, value: any) => void;
  firstNameOptions: OrganizationOption[];
};

export default function PersonTableToolbar({
  filters,
  onFilters,
  firstNameOptions,
}: Props) {
  const [firstName, setFirstName] = useState<string[]>(filters.firstName || []);

  const handleChangeFirstName = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      const updatedFirstName =
        typeof value === 'string' ? value.split(',') : value;

      setFirstName(updatedFirstName);
      onFilters('firstName', updatedFirstName);
    },
    [onFilters]
  );

  return (
    <FormControl
      sx={{
        flexShrink: 0,
        width: { xs: 1, md: 200 },
      }}
    >
      <InputLabel>{t("Department")}</InputLabel>

      <Select
        multiple
        value={firstName}
        onChange={handleChangeFirstName}
        input={<OutlinedInput label="First Name" />}
        renderValue={(selected) =>
          firstNameOptions
            .filter((option) => selected.includes(option.organizationName))
            .map((option) => option.organizationName)
            .join(', ')
        }
        sx={{ textTransform: 'capitalize' }}
      >
        {firstNameOptions.map((option) => (
          <MenuItem key={option.organizationId} value={option.organizationName}>
            <Checkbox
              disableRipple
              size="small"
              checked={firstName.includes(option.organizationName)}
            />
            {option.label || option.organizationName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}