import type { IFileShared } from 'src/types/file';
import type { DialogProps } from '@mui/material/Dialog';

import { t } from 'i18next';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useLocales } from 'src/locales';
import { UseGetPersons } from 'src/actions/Hr/person';

import {Scrollbar} from 'src/components/scrollbar';

import EmployeeItem from './employee-item';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  inviteEmail?: string;
  shared?: IFileShared[] | null;
  onCopyLink?: VoidFunction;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
};

export default function EmployessDialog({
  shared,
  inviteEmail,
  onCopyLink,
  onChangeInvite,
  //
  open,
  onClose,
  ...other
}: Props) {
  const hasShared = shared && !!shared.length;
      const { currentLang } = useLocales();
  
    const { persons, personsLoading } = UseGetPersons(currentLang.value);
  
  // const employees = [
  //   {
  //     name: 'Hazem Mohammed',
  //     id: 1,
  //   },
  //   {
  //     name: 'Mohammed Ahmed',
  //     id: 2,
  //   },
  // ];
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> {t('Employees')} </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Scrollbar sx={{ maxHeight: 60 * 6 }}>
          <List disablePadding>
            { persons.map((person:any) => (
              <EmployeeItem key={person.personId} person={person} />
            ))}
          </List>
        </Scrollbar>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
