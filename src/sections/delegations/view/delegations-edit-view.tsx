import { useRef, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DashboardContent } from 'src/layouts/dashboard';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatDateTimeToISOString } from 'src/utils/general-utils';

import { useGetUsers } from 'src/actions/security/user';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups, useGetAllApplications } from 'src/actions/shared/shared';
import { useGetDelegation, UseEditDelegation } from 'src/actions/security/delegation';

import { Iconify } from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import hasFormChanges from 'src/components/Form/form-data-changes';
import ButtonSkeleton from 'src/components/buttons/button-skelton';

import { IDelegationInfomap } from 'src/types/delegation';

import DelegationNewEditForm, { DelegationNewEditFormHandle } from '../delegation-new-edit-form';

type Props = {
  id: string;
};
const useFetchDelegationData = (id: any) => {
  const [delegationData, setDelegationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { delegation, delegationValidating, refetch: refetchDelegation } = useGetDelegation(id);

  const refetch = useCallback(() => {
    refetchDelegation();
  }, [refetchDelegation]);

  useEffect(() => {
    if (!delegationValidating) {
      setDelegationData(delegation);

      setLoading(false);
    }
  }, [delegationValidating, delegation]);

  return { delegationData, loading, refetch };
};

export default function DelegationsEditView({ id }: Props) {
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const { delegationData, loading, refetch } = useFetchDelegationData(id);
  const { applications, applicationsLoading } = useGetAllApplications(currentLang.value);

  const { users, usersLoading } = useGetUsers();

  const TABS = [
    {
      value: 'delegation-info',
      label: t('Delegation Info'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const [currentDelegationInfo, setCurrentDelegationInfo] = useState<any | null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('delegation-info');
  const delegationInfoForm = useRef<DelegationNewEditFormHandle>(null);
  // const currentDelegation = _delegationsList.find((delegation) => delegation.id === id);
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
    data.id = Number(id);
    data.delegationScopeDTO = data?.delegationScope === '2' ? data?.delegationScopeDTO || [] : [];
    if (!formValid) return;

    const hasChanges = {
      info: hasFormChanges([mapDelegationsInfo(delegationData)], [data]),
    };

    if (!hasChanges.info) {
      toast.info(t('No changes to save.'));
      router.push(paths.security.delegations.management);
      return;
    }
    try {
      setSubmitLoading(true);
      if (hasChanges.info) {
        await UseEditDelegation(data);
      }
      refetch();

      toast.success(t('Edited successfully!'));
      router.push(paths.security.delegations.management);
      setCurrentDelegationInfo(null);
    } catch (e) {
      setSubmitLoading(false);
      toast.error((e as Error).message || 'An error occurred');
    }
  };
  const convertStringToDate = (str: string) => {
    if (!str || typeof str !== 'string') return null;
    const [day, month, year] = str.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return date;
  };
  const mapDelegationsInfo = (delegation: any): IDelegationInfomap => ({
    id: Number(delegation.id) || 0,
    fromUser: delegation.fromUser || '',
    toUser: delegation.toUser || '',
    dateFrom: delegation.dateFrom ? formatDateTimeToISOString(delegation.dateFrom) : new Date(),
    dateTo: delegation.dateTo ? formatDateTimeToISOString(delegation.dateTo) : new Date(),

    active: delegation.active || 0,
    delegationScope: delegation?.delegationScope || '1',
    delegationScopeDTO:
      delegation?.delegationScope === '2' ? delegation?.delegationScopeDTO || [] : [],
  });
  useEffect(() => {
    if (!loading) {
      const mappedDelegationInfo = mapDelegationsInfo(delegationData);
      setCurrentDelegationInfo(mappedDelegationInfo);
    }
    return () => {
      setCurrentDelegationInfo(null);
    };
  }, [loading, delegationData]);
  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Edit Delegation')}
          links={[
            {
              name: t('Security'),
              href: paths.security.root,
            },
            {
              name: t('Delegations'),
              href: paths.security.delegations.root,
            },
            { name: t('Edit Delegation') },
          ]}
          action={
            <div>
              {loading ? (
                <ButtonSkeleton buttons={2} />
              ) : (
                <>
                  <BackButton label={t('Cancel')} />
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={submitLoading}
                    type="submit"
                    variant="contained"
                    sx={{ mt: 5 }}
                  >
                    {t('Submit')}
                  </LoadingButton>
                </>
              )}
            </div>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Tabs
          value={currentTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {currentTab === 'delegation-info' &&
          (loading || !currentDelegationInfo || applicationsLoading || usersLoading ? (
            <FormSkeleton fields={7} />
          ) : (
            <DelegationNewEditForm
              ref={delegationInfoForm}
              currentDelegation={currentDelegationInfo || undefined}
              users={users}
              applications={applications}
              applicationsLoading={applicationsLoading}
              usersLoading={usersLoading}
              delegationTypesLoading={delegationTypesLoading}
              delegationTypes={delegationTypes}
            />
          ))}
      </Container>
    </DashboardContent>
  );
}
