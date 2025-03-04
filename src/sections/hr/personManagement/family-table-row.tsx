import type { IFamilyItem } from 'src/types/family'

import { usePopover } from 'minimal-shared/hooks';

import { Box } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { IMAGE_BASE } from 'src/global-config';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';

import FamilyDialog from './family-dialog';





type Props = {
   onCorrectRow?: VoidFunction;
  row: IFamilyItem;
  MARITAL_STATUSTypesLoading?: any;
  GENDERTypesLoading?: any;
  RELIGIONTypesLoading?: any;
  countriesLoading?: any;
  RELATIONSHIP_TYPELoading?: any;
  EDUCATION_LEVELLoading?: any;
  MARITAL_STATUSTypes?: any;
  RELATIONSHIP_TYPE?: any;
  GENDERTypes?: any;
  RELIGIONTypes?: any;
  countries?: any;
  EDUCATION_LEVEL?: any;
  parentPersonId?: any;
};

export default function Familytablerow({ row, onCorrectRow, MARITAL_STATUSTypesLoading,
  GENDERTypesLoading,
  RELIGIONTypesLoading,
  countriesLoading,
  RELATIONSHIP_TYPELoading,
  EDUCATION_LEVELLoading,
  MARITAL_STATUSTypes,
  GENDERTypes,
  RELIGIONTypes,
  countries,
  RELATIONSHIP_TYPE,
  parentPersonId,
  EDUCATION_LEVEL}: Props){
     const { firstName,lastName,avatarUrl,relationshipType,approvalStatus,personalEmail } = row;
      const { t } = useTranslate();
      const confirm = useBoolean();
      const popover = usePopover();
      const recordInfo = useBoolean();
      const viewPerson = useBoolean();
      const correctPerson = useBoolean();

       function getColorByStatus(status:any) {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DRAFT':
        return 'default';
      case 'WITHDRAWN':
        return 'info';
      case 'REJECTED':
        return 'error';
      case 'APPROVED':
        return 'success';
      default:
        return 'default';
    }
  }

  return(
    <>
     <TableRow hover>

      <TableCell
  sx={{ display: 'flex', alignItems: 'center',cursor: 'pointer' }}
  onClick={() => {
    viewPerson.onTrue();
    popover.onClose();
  }}
  >
  <Avatar
    alt={firstName}
    src={`${IMAGE_BASE}/${avatarUrl}`}
    sx={{ mr: 2 }}
  />
  <Box>
  <ListItemText primary={`${firstName} ${lastName}`} primaryTypographyProps={{ typography: 'body2' }} />

  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {personalEmail}
            </Typography>
  </Box>
</TableCell>



        <TableCell>
        {relationshipType}

        </TableCell>





        <TableCell sx={{ whiteSpace: 'nowrap' } }><Label
            variant="soft"
            color={getColorByStatus(approvalStatus)}

          >
    {/* {getLabelByStatus(approvalStatus)} */}
    {approvalStatus}
    </Label></TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <RecordInfoDialog
      createdBy={row.createdByUserName}
      creationDate={row.createdDate}
         updateBy={row.updatedByUserName}
      updateDate={row.updatedDate}
       open={recordInfo.value} onClose={recordInfo.onFalse} />
      <FamilyDialog
      operation='View Person'
      row={row} title={t('View Person')} open={viewPerson.value} onClose={viewPerson.onFalse}  MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
              GENDERTypesLoading={GENDERTypesLoading}
              RELIGIONTypesLoading={RELIGIONTypesLoading}
              RELATIONSHIP_TYPELoading={RELATIONSHIP_TYPELoading}
              countriesLoading={countriesLoading}
              EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
              MARITAL_STATUSTypes={MARITAL_STATUSTypes}
              GENDERTypes={GENDERTypes}
              RELIGIONTypes={RELIGIONTypes}
              countries={countries}
              RELATIONSHIP_TYPE={RELATIONSHIP_TYPE}
              EDUCATION_LEVEL={EDUCATION_LEVEL} />
               <FamilyDialog
      operation='Correct Person'
      row={row} title={t("Correct Person")} open={correctPerson.value} onClose={correctPerson.onFalse}  MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
              GENDERTypesLoading={GENDERTypesLoading}
              RELIGIONTypesLoading={RELIGIONTypesLoading}
              RELATIONSHIP_TYPELoading={RELATIONSHIP_TYPELoading}
              countriesLoading={countriesLoading}
              EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
              MARITAL_STATUSTypes={MARITAL_STATUSTypes}
              GENDERTypes={GENDERTypes}
              RELIGIONTypes={RELIGIONTypes}
              countries={countries}
              RELATIONSHIP_TYPE={RELATIONSHIP_TYPE}
              EDUCATION_LEVEL={EDUCATION_LEVEL} />

      <CustomPopover
      anchorEl={popover.anchorEl}
      slotProps={{ arrow: { placement: 'right-top' } }}
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 200 }}
      >

        <MenuItem
          onClick={() => {
            recordInfo.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:info-circle-bold" />
          {t('Record Info')}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            viewPerson.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:eye" />
          {t('View')}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            correctPerson.onTrue();
            popover.onClose();
          }}
        >
<Iconify icon="solar:pen-bold" />
          {t('Correct')}
        </MenuItem>
      </CustomPopover>

    </>
  )

}