import React, { useState, useCallback, useEffect } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';

import { useTranslate } from 'src/locales';

import { IRoleFunctionInfo } from 'src/types/role';

type Props = {
  row: IRoleFunctionInfo;
  selected: boolean;
  onSelectRow: VoidFunction;
  onAccessTypeChange: (functionId: string, accessType: number) => void;
  currentAccessType: number; 

};

const RoleFunctionRow: React.FC<Props> = ({
  row,
  selected,
  onSelectRow,
  onAccessTypeChange,
  currentAccessType
}) => {
  const { t } = useTranslate();
  const ACCESSTYPES = [
    { value: 1, label: t('View Only') },
    { value: 2, label: t('Full Access') },
  ];
  const [accessType, setAccessType] = useState<number>(row.accessType || 1);

  const handleChangeType = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value, 10);
      setAccessType(newValue);
      onAccessTypeChange(row.functionId, newValue);
    },
    [row.functionId, onAccessTypeChange]
  );

  useEffect(() => {
    setAccessType(row.accessType || 1);
  }, [row.accessType]);

  const { functionName } = row;

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{functionName}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <TextField select fullWidth value={currentAccessType} onChange={handleChangeType}>
          {ACCESSTYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
    </TableRow>
  );
};

export default RoleFunctionRow;
