import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { usePopover } from 'minimal-shared/hooks';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import {Iconify} from 'src/components/iconify';
import FormSkeleton from 'src/components/Form/form-skelton';
import { CustomPopover } from 'src/components/custom-popover';
import { RHFSelect, RHFCheckbox } from 'src/components/hook-form';
import RecordInfoDialog from 'src/components/record-info/record-info-dialog';

interface ClassificationFormProps {
  itemKey: any;
  index: any;
  organizations: any[];
  organizationsValidating?: boolean;
  operation?: string;
  current?: any;
}

const ClassificationForm = forwardRef<HTMLDivElement, ClassificationFormProps>(
  ({ itemKey, index, organizations, organizationsValidating, operation, current }, ref) => {
    const { watch, trigger } = useFormContext();
    const popover = usePopover();
    const recordInfo = useBoolean();
    const isEdit = operation === 'edit';
    const isPending = current?.approvalStatus === 'PENDING';

    const { t } = useTranslate();

    // Watch all the classification codes to get selected values
    const selectedClassificationCodes = watch('orgnClassificationsDTOS').map(
      (item: any) => item.classificationCode
    );

    const classificationCode = watch(`orgnClassificationsDTOS[${index}].classificationCode`);

    // Conditionally filter only in edit mode
    const availableOrganizations = organizations.filter(
      (org) =>
        !selectedClassificationCodes.includes(org.valueCode) || org.valueCode === classificationCode
    );
    const validateFieldOnBlur = async (name: string) => {
      try {
        const isValid = await trigger(name);
        return isValid;
      } catch (error) {
        console.error(`Validation error on ${name}:`, error);
        return false;
      }
    };

    // Watch the values of the form fields
    // const organizationId = watch(`orgnClassificationsDTOS[${index}].organizationId`);
    const createdByUserName = watch(`orgnClassificationsDTOS[${index}].createdByUserName`);
    const updatedByUserName = watch(`orgnClassificationsDTOS[${index}].updatedByUserName`);
    const createdDate = watch(`orgnClassificationsDTOS[${index}].createdDate`);
    const updatedDate = watch(`orgnClassificationsDTOS[${index}].updatedDate`);

    const render_skeleton = [...Array(1)].map((_, i) => (
      <FormSkeleton key={i} fields={2} />
    ));

    return (
      <Stack alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
        {organizationsValidating ? (
          render_skeleton
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', mb: 3 }}>
            <RHFSelect
              required
              name={`orgnClassificationsDTOS[${index}].classificationCode`}
              size="small"
              label={t('Classification Name')}
              InputLabelProps={{ shrink: true }}
              onBlur={() =>
                validateFieldOnBlur(`orgnClassificationsDTOS[${index}].classificationCode`)
              }
              disabled={(isEdit && !!classificationCode) || isPending}
            >
              {availableOrganizations.map((org) => (
                <MenuItem key={org.valueCode} value={org.valueCode}>
                  {org.valueName}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFCheckbox
              name={`orgnClassificationsDTOS[${index}].active`}
              label={t('Active')}
              disabled={isPending}
            />
            <RecordInfoDialog
              createdBy={createdByUserName}
              creationDate={createdDate}
              updateBy={updatedByUserName}
              updateDate={updatedDate}
              open={recordInfo.value}
              onClose={recordInfo.onFalse}
            />

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>

            <CustomPopover
              anchorEl={popover.anchorEl}
              open={popover.open}
              onClose={popover.onClose}
              slotProps={{ arrow: { placement: 'right-top' } }}
              sx={{ width: 200 }}
            >
              <Divider />
              <MenuItem
                onClick={() => {
                  recordInfo.onTrue();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:info-circle-bold" />
                {t('Record Info')}
              </MenuItem>
            </CustomPopover>
          </Stack>
        )}
      </Stack>
    );
  }
);

export default ClassificationForm;
