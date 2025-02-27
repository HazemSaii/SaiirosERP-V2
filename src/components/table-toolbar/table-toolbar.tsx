import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import {Iconify} from 'src/components/iconify';

import { CustomPopover } from '../custom-popover';
// import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props<ITableFilters> = {
  filterValue:string;
  value:string;
  filters: ITableFilters;
  onFilters: (name: string, value: string|string[]) => void;
  //
};

export default function TableToolbar<ITableFilters>({
  filterValue,
  value,
  filters,
  onFilters,
  //
}: Props<ITableFilters>) {
  const popover = usePopover();
  const { t } = useTranslate();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters(filterValue, event.target.value);
    },
    [onFilters,filterValue]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={value}
            onChange={handleFilterName}
            placeholder={t('Search...')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        // arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:refresh-bold" />
          {t('Refresh')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          {t('Export')}
        </MenuItem>
        
      </CustomPopover>
    </>
  );
}
