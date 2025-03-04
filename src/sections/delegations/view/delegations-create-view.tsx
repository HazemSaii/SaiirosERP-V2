import type { IDelegationInfo } from 'src/types/delegation';

import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatDateTimeToISOString } from 'src/utils/general-utils';

import { useLocales, useTranslate } from 'src/locales';
import { useGetUsers } from 'src/actions/security/user';
import { DashboardContent } from 'src/layouts/dashboard';
import { UseAddDelegation } from 'src/actions/security/delegation';
import { useGetAllLookups, useGetAllApplications } from 'src/actions/shared/shared';

import BackButton from 'src/components/buttons';
import { Iconify } from 'src/components/iconify';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DelegationNewEditForm from '../delegation-new-edit-form';

import type { DelegationNewEditFormHandle } from '../delegation-new-edit-form';

//------------------------------------------------------
export default function DelegationsCreateView() {
  const { t } = useTranslate();
  const router = useRouter();

  const { currentLang } = useLocales();
  const { applications, applicationsLoading } = useGetAllApplications(currentLang.value);
  const { users, usersLoading } = useGetUsers();
  const TABS = [
    {
      value: 'delegation-info',
      label: t('Delegation Info'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentDelegationInfo, setcurrentDelegationInfo] = useState<IDelegationInfo>();

  const [currentTab, setCurrentTab] = useState('delegation-info');
  const [submitLoading, setSubmitLoading] = useState(false);
  const delegationInfoForm = useRef<DelegationNewEditFormHandle>(null);
  const { lookups: delegationTypes, lookupsLoading: delegationTypesLoading } = useGetAllLookups(
    'DELEGATION_TYPE',
    currentLang.value
  );
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (delegationInfoForm.current) {
      formValid = await delegationInfoForm.current.validate();
      currentData = delegationInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    data.dateFrom = formatDateTimeToISOString(data.dateFrom);
    data.dateTo = formatDateTimeToISOString(data.dateTo);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddDelegation(data);
      if (res.status === 200) {
        toast.success(t('Created successfully!'));
        router.push(paths.security.delegations.management);
      }
    } catch (e) {
      setSubmitLoading(false);
      toast.error((e as Error).message || 'An error occurred');
    }
  };

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'delegation-info' && delegationInfoForm.current) {
        isValid = await delegationInfoForm.current.validate();
        formData = delegationInfoForm.current.formData();
        formData.active = formData.locked ? 1 : 0;

        setcurrentDelegationInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, delegationInfoForm]
  );
  //--------------
  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Create New Delegation')}
          links={[
            {
              name: t('Security'),
              href: paths.security.root,
            },
            {
              name: t('Delegations'),
              href: paths.security.delegations.root,
            },
            { name: t('New Delegation') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <div>
              <BackButton label={t('Cancel')} />
              <LoadingButton
                color="inherit"
                onClick={handleSubmit}
                variant="contained"
                loading={submitLoading}
                sx={{ mt: 5 }}
              >
                {t('Submit')}
              </LoadingButton>
            </div>
          }
        />
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {currentTab === 'delegation-info' &&
          (applicationsLoading || usersLoading ? (
            <FormSkeleton fields={7} />
          ) : (
            <DelegationNewEditForm
              ref={delegationInfoForm}
              currentDelegation={currentDelegationInfo || undefined}
              applications={applications}
              applicationsLoading={applicationsLoading}
              users={users}
              usersLoading={usersLoading}
              delegationTypesLoading={delegationTypesLoading}
              delegationTypes={delegationTypes}
            />
          ))}
      </Container>
    </DashboardContent>
  );
}
