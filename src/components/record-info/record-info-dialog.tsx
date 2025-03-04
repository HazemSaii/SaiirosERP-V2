import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  onClose: VoidFunction;
  createdBy: any;
  creationDate: any;
  updateBy: any;
  updateDate: any;
};

export default function RecordInfoDialog({
  open,
  onClose,
  createdBy,
  creationDate,
  updateBy,
  updateDate,
}: Props) {
  const { t } = useTranslate();
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle> {t('Record Info')} </DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Created By')}
            </Typography>
            <Typography variant="subtitle1">{createdBy}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Creation Date')}
            </Typography>
            <Typography variant="subtitle1">{creationDate || 'N/A'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Last Update By')}
            </Typography>
            <Typography variant="subtitle1">{updateBy}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Last Update Date')}
            </Typography>
            <Typography variant="subtitle1">{updateDate || 'N/A'}</Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t('Close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
