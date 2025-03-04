import React, { useState, useEffect } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { IUserItem } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  row: IUserItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  operation: string;
};

const RoleUsersRow: React.FC<Props> = ({ onSelectRow, selected, row, operation }) => {
  // const [startDate, setStartDate] = useState<string | null>(null);
  // const [endDate, setEndDate] = useState<string | null>(null);
   useEffect(() => {
  //   const currentDate = new Date().toISOString().split('T')[0];
  //   if (operation === "create") {
  //     if (selected) {
  //       setStartDate(currentDate);
  //       setEndDate(null);
  //     } else {
  //       setStartDate(null);
  //       setEndDate(null);
  //     }
  //   } else if (operation === "edit") {
  //     if (selected) {
  //       setStartDate(currentDate);
  //       setEndDate(null);
  //     } else if (!selected && startDate) {
  //       setEndDate(currentDate);
  //     } else {
  //       setStartDate(null);
  //       setEndDate(null);
  //     }
  //   }
   }, [selected, operation]);

  // const autoProvision = false;

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={onSelectRow}
          inputProps={{ 'aria-label': `select user ${row.userName}` }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.userName}</TableCell>
      
    </TableRow>
  );
};

export default RoleUsersRow;
