import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import type { FiltersResultProps } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props<T extends Record<string, any>> = FiltersResultProps & {
  Chipvalue: string;
  filters: T;
  onFilters: (name: string, value: any) => void;
  onResetFilters: () => void;
};

export default function TableFiltersResults<T extends Record<string, any>>({
  filters,
  Chipvalue,
  onFilters,
  onResetFilters,
  results,
  sx,
}: Props<T>) {
  const handleRemoveKeyword = useCallback(() => {
    onFilters('roleName', '');
  }, [onFilters]);

  return (
    <FiltersResult totalResults={results || 0} onReset={onResetFilters} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!Chipvalue}>
        <Chip {...chipProps} label={Chipvalue} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
