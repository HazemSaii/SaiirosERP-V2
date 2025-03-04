import type { IRoleItem } from 'src/types/role';

import React, { useState, useEffect } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type Props = {
  row: IRoleItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  operation: string;

};

export default function UserRolesRow({ onSelectRow, selected, row, operation }: Props) {
  const { roleName } = row;
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    // if (operation === "create") {
    //   if (selected) {
    //     setStartDate(currentDate);
    //     setEndDate(null);
    //   } else {
    //     setStartDate(null);
    //     setEndDate(null);
    //   }
    // } else if (operation === "edit") {
    //   if (selected) {
    //     setStartDate(currentDate);
    //     setEndDate(null);
    //   } else if (!selected && startDate) {
    //     setEndDate(currentDate);
    //   } else {
    //     setStartDate(null);
    //     setEndDate(null);
    //   }
    // }
  }, [selected, operation]);

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{roleName}</TableCell>
      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{startDate ?? null}</TableCell> */}
      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{endDate ?? null}</TableCell> */}
    </TableRow>
  );
}
