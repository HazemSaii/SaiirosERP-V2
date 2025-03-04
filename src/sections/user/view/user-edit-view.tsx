import { useRef, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { toast } from 'sonner';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatDateTimeToISOString } from 'src/utils/general-utils';
import { userDataAccess, userAdditionalData } from 'src/utils/user/user-additional-data';

import { useLocales, useTranslate } from 'src/locales';
import { UseGetApprovedPersons } from 'src/actions/Hr/person';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { useGetAllLanguages } from 'src/actions/settings/languages';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';
import {
  useGetAllLookups,
  useGetAllTimezones,
  useGetAllLegalEnitites,
  useGetAllBusinessUnites,
  useGetAllAccounts,
  useGetAllLedgers,
  useGetAllSuppliers,
} from 'src/actions/shared/shared';
import {
  useGetUser,
  useEditUser,
  useValidateUser,
  useGetRolesByUser,
  useGetDataAccessByUser,
} from 'src/actions/security/user';

import { Iconify } from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import { DashboardContent } from 'src/layouts/dashboard';
import { IRoleItem } from 'src/types/role';
import { IUserInfo, IUserPreferences, IUserDataAccess } from 'src/types/user';
import UserRoles, { UserRolesFormHandle } from '../user-roles';
import UserDataAccess, { UserDataAccessFormHandle } from '../user-data-access';
import UserNewEditForm, { UserNewEditFormHandle } from '../user-new-edit-form';
import UserPreferences, { UserPreferencesFormHandle } from '../user-preferences';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};

const useFetchUserData = (id: string) => {
  const [userData, setUserData] = useState<any>(null);
  const [rolesData, setRolesData] = useState<IRoleItem[]>([]);
  const [dataAccessData, setDataAccessData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, userValidating, refetch: refetchUser } = useGetUser(id);
  const { roles, rolesValidating, refetch: refetchRoles } = useGetRolesByUser(id);
  const {
    dataAccess,
    dataAccessValidating,
    refetch: refetchDataAccess,
  } = useGetDataAccessByUser(id);

  const refetch = useCallback(() => {
    refetchUser();
    refetchRoles();
    refetchDataAccess();
  }, [refetchUser, refetchRoles, refetchDataAccess]);

  useEffect(() => {
    if (!userValidating && !rolesValidating && !dataAccessValidating) {
      setUserData(user);
      setRolesData(roles);
      setDataAccessData(dataAccess);
      setLoading(false);
    }
  }, [userValidating, rolesValidating, dataAccessValidating, user, roles, dataAccess]);
  return { userData, rolesData, dataAccessData, loading, refetch };
};

export function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const router = useRouter();
  const { userData, rolesData, dataAccessData, loading, refetch } = useFetchUserData(id);
  const { currentLang } = useLocales();
  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;
  const { approvedpersons, approvedpersonsLoading } = UseGetApprovedPersons(currentLanguage);
  const { lookups: ACCOUNT_TYPE, lookupsLoading: ACCOUNT_TYPELoading } = useGetAllLookups(
    'ACCOUNT_TYPE',
    currentLanguage
  );
  const { lookups: DEFAULT_DATE_FORMAT, lookupsLoading: DEFAULT_DATE_FORMAT_Loading } =
    useGetAllLookups('DEFAULT_DATE_FORMAT', currentLanguage);
  const { timeZones, timeZonesLoading } = useGetAllTimezones(currentLanguage);
  const { languages, languagesLoading } = useGetAllLanguages(currentLanguage);
  const { suppliers, suppliersLoading } = useGetAllSuppliers(currentLanguage);
  const { accounts, accountsLoading } = useGetAllAccounts(currentLanguage);
  const { ledgers, ledgersLoading } = useGetAllLedgers(currentLanguage);
  const { approvedorganizations, approvedorganizationsLoading } =
    UseGetApprovedOrganizations(currentLanguage);
  const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(currentLanguage);
  const { legalEntities, legalEntitiesLoading } = useGetAllLegalEnitites(currentLanguage);
  const { businessUnites, businessUnitesLoading } = useGetAllBusinessUnites(currentLanguage);
  const TABS = [
    {
      value: 'user-info',
      label: t('User Info'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
    {
      value: 'preferences',
      label: t('Preferences'),
      icon: <Iconify icon="pajamas:preferences" width={24} />,
    },
    {
      value: 'permissions',
      label: t('Permissions'),
      icon: <Iconify icon="icon-park-outline:permissions" width={24} />,
    },
    {
      value: 'data-access',
      label: t('Data Access'),
      icon: <Iconify icon="icon-park-outline:data-user" width={24} />,
    },
  ];

  const [currentUserInfo, setcurrentUserInfo] = useState<IUserInfo | null>();
  const [currentUserPreferences, setcurrentUserPreferences] = useState<IUserPreferences | null>();
  const [currentUserRoles, setcurrentUserRoles] = useState<IRoleItem[] | null>([]);
  const [currentUserDataAccess, setcurrentUserDataAccess] = useState<IUserDataAccess | null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('user-info');

  const userInfoForm = useRef<UserNewEditFormHandle>(null);
  const userPreferencesForm = useRef<UserPreferencesFormHandle>(null);
  const userRolesForm = useRef<UserRolesFormHandle>(null);
  const userDataAccessForm = useRef<UserDataAccessFormHandle>(null);
  const mapUserInfo = (userInfo: any): IUserInfo => ({
    userName: userInfo?.userName || '',
    userEmail: userInfo?.userEmail || '',
    personId: userInfo?.personId || null,
    supplierId: userInfo?.supplierId || null,
    startDate: userInfo?.startDate ? formatDateTimeToISOString(userInfo.startDate) : null,
    endDate: userInfo?.endDate ? formatDateTimeToISOString(userInfo.endDate) : null,
    password: '',
    confirmPassword: '',
    status: userInfo?.status || '',
    locked: userInfo?.locked || false,
    builtIn: userInfo?.builtIn || false,
    loggerEnabled: userInfo?.loggerEnabled || false,
  });
  const mapUserPrefrences = (userPreferences: any): IUserPreferences => ({
    defaultLangCode: userPreferences?.defaultLangCode || 0,
    defaultTimezoneId: userPreferences?.defaultTimezoneId || '94',
    startPage: userPreferences?.startPage || 0,
    defaultDateFormat: userPreferences?.defaultDateFormat || 'dd-MM-yyyy',
    receiveEmail: userPreferences?.receiveEmail || true,
  });

  const mapUserDataAccess = (data: any): any => {
    const mappedData: any = {
      personScope: 1,
      person: [],
      manager: '',
      personHierarchy: false,
      perTop: false,
      organizationScope: 1,
      organization: [],
      organizationManager: 0,
      organizationHierarchy: false,
      orgTop: false,
      payrollScope: 1,
      payroll: [],
      locationScope: 1,
      location: [],
      ledgerScope: 1,
      ledger: [],
      legalEntityScope: 1,
      legalEntity: [],
      businessUnitScope: 1,
      businessUnit: [],
      accountScope: 1,
      account: [],
    };

    data.forEach((item: any) => {
      switch (item.dataAccessContext) {
        case 'PERSON':
          mappedData.personScope = item.scope;
          mappedData.person = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          mappedData.personHierarchy = item.userDataAccessScopeDTOS.some(
            (d: any) => d.valueOrHierarchy === 2
          );
          mappedData.perTop = item.userDataAccessScopeDTOS.some(
            (d: any) => d.includeTopValue === 1
          );
          mappedData.manager = item.userDataAccessScopeDTOS.map((d: any) =>
            d.valueOrHierarchy === 2 ? d.hierarchyTopValueId : null
          )[0];
          break;
        case 'ORGANIZATION':
          mappedData.organizationScope = item.scope;
          mappedData.organization = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          mappedData.organizationHierarchy = item.userDataAccessScopeDTOS.some(
            (d: any) => d.valueOrHierarchy === 2
          );
          mappedData.organizationManager = item.userDataAccessScopeDTOS.map((d: any) =>
            d.valueOrHierarchy === 2 ? d.hierarchyTopValueId : null
          )[0];
          mappedData.orgTop = item.userDataAccessScopeDTOS.some(
            (d: any) => d.includeTopValue === 1
          );
          break;
        case 'PAYROLL':
          mappedData.payrollScope = item.scope;
          mappedData.payroll = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          break;
        case 'LOCATION':
          mappedData.locationScope = item.scope;
          mappedData.location = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          break;
        case 'LEDGER':
          mappedData.ledgerScope = item.scope;
          mappedData.ledger = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          break;
        case 'LEGAL_ENTITY':
          mappedData.legalEntityScope = item.scope;
          mappedData.legalEntity = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          break;
        case 'BUSINESS_UNIT':
          mappedData.businessUnitScope = item.scope;
          mappedData.businessUnit = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          break;
        case 'ACCOUNT':
          mappedData.accountScope = item.scope;
          mappedData.account = item.userDataAccessScopeDTOS.map((d: any) => d.fixedValue);
          break;
        default:
          break;
      }
    });

    return mappedData;
  };
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;

    if (userInfoForm.current) {
      formValid = await userInfoForm.current.validate();
      currentData = userInfoForm.current.formData();
      data = { ...currentData, ...currentUserPreferences };
    }
    if (userPreferencesForm.current) {
      formValid = await userPreferencesForm.current.validate();
      currentData = userPreferencesForm.current.formData();
      data = { ...currentData, ...currentUserInfo };
    }
    if (userRolesForm.current) {
      formValid = true;
      currentData = userRolesForm.current.getSelectedRoles();
      data = { ...currentUserInfo, ...currentUserPreferences };
    }
    if (userDataAccessForm.current) {
      formValid = await userDataAccessForm.current.validate();
      currentData = userDataAccessForm.current.formData();
      data = { ...currentUserInfo, ...currentUserPreferences };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.id = id;
    data.startDate = formatDateTimeToISOString(data.startDate);
    data.endDate = formatDateTimeToISOString(data.endDate) || null;
    data.mustChangePassword = 0;

    if (!formValid) return;

    try {
      setSubmitLoading(true);
      const apiValid = await useValidateUser(data, 2);
      const res = await useEditUser(data);

      if (res.status === 200 && apiValid.status === 200) {
        await Promise.all([
          userAdditionalData({
            userId: res.data.id,
            SelectedUserRoles:
              currentTab === 'permissions'
                ? userRolesForm.current?.getSelectedRoles()
                : currentUserRoles,
            userDataAccess: currentUserDataAccess,
            operation: 'edit',
            originalUserRoles: loading ? [] : rolesData,
          }),
          userDataAccess(
            currentTab === 'data-access'
              ? userDataAccessForm.current?.formData()
              : currentUserDataAccess,
            'edit',
            res.data.id,
            refetch
          ),
        ]);

        refetch();
        toast.success(t('Edited successfully!'));
        router.push(paths.security.users.management);
      }
    } catch (error) {
      setSubmitLoading(false);
      toast.error((error as Error).message || 'An error occurred');
    }
  };

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;

      if (loading) return;

      if (currentTab === 'user-info' && userInfoForm.current) {
        isValid = await userInfoForm.current.validate();
        formData = userInfoForm.current.formData();
        formData.locked = formData.locked ? 1 : 0;
        formData.loggerEnabled = formData.loggerEnabled ? 1 : 0;
        formData.builtIn = formData.builtIn ? 1 : 0;
        setcurrentUserInfo(formData);
      } else if (currentTab === 'preferences' && userPreferencesForm.current) {
        isValid = await userPreferencesForm.current.validate();
        formData = userPreferencesForm.current.formData();
        formData.receiveEmail = formData.receiveEmail ? 1 : 0;
        setcurrentUserPreferences(formData);
      }

      if (currentTab === 'permissions' && userRolesForm.current) {
        formData = userRolesForm.current.getSelectedRoles();
        setcurrentUserRoles(formData);
      }

      if (currentTab === 'data-access' && userDataAccessForm.current) {
        isValid = await userDataAccessForm.current.validate();
        formData = userDataAccessForm.current.formData();
        setcurrentUserDataAccess(formData);
      }

      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, userInfoForm, userPreferencesForm, userRolesForm, userDataAccessForm, loading]
  );

  useEffect(() => {
    if (!loading && userData) {
      const mappedUserInfo = mapUserInfo(userData);
      const mappedUserPreferences = mapUserPrefrences(userData);
      const mappedUserDataAccess = mapUserDataAccess(dataAccessData);
      setcurrentUserInfo(mappedUserInfo);
      setcurrentUserPreferences(mappedUserPreferences);
      setcurrentUserRoles(rolesData);
      setcurrentUserDataAccess(mappedUserDataAccess);
    }
    return () => {
      setcurrentUserInfo(null);
      setcurrentUserPreferences(null);
      setcurrentUserRoles(null);
      setcurrentUserDataAccess(null);
    };
  }, [loading, userData, rolesData, dataAccessData]);

  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Edit User ') + (currentUserInfo?.userName ?? '')}
          links={[
            { name: t('Security'), href: paths.security.root },
            { name: t('Users'), href: paths.security.users.root },
            { name: t('Edit User') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <div>
              {loading || !currentUserInfo ? (
                <ButtonSkeleton buttons={2} />
              ) : (
                <>
                  <BackButton label={t('Cancel')} />
                  {currentUserInfo?.status !== 'PENDING' && (
                    <LoadingButton
                      color="inherit"
                      onClick={handleSubmit}
                      variant="contained"
                      loading={submitLoading}
                      sx={{ mt: 5 }}
                      disabled={currentUserInfo?.status === 'PENDING'}
                    >
                      {t('Submit')}
                    </LoadingButton>
                  )}
                </>
              )}
            </div>
          }
        />

        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>

          {currentTab === 'user-info' &&
            (loading ||
            !currentUserInfo ||
            approvedpersonsLoading ||
            !approvedpersons ||
            suppliersLoading ||
            !suppliers ? (
              <FormSkeleton fields={9} />
            ) : (
              <UserNewEditForm
                ref={userInfoForm}
                currentUser={currentUserInfo}
                operation="edit"
                approvedpersons={approvedpersons}
                approvedpersonsLoading={approvedpersonsLoading}
                suppliersLoading={suppliersLoading}
                suppliers={suppliers}
              />
            ))}

          {currentTab === 'preferences' &&
            (loading ||
            !currentUserPreferences ||
            DEFAULT_DATE_FORMAT_Loading ||
            !DEFAULT_DATE_FORMAT ||
            timeZonesLoading ||
            !timeZones ||
            languagesLoading ||
            !languages ? (
              <FormSkeleton fields={5} />
            ) : (
              <UserPreferences
                ref={userPreferencesForm}
                operation="edit"
                currentUserPreferences={currentUserPreferences}
                DEFAULT_DATE_FORMAT_Loading={DEFAULT_DATE_FORMAT_Loading}
                DEFAULT_DATE_FORMAT={DEFAULT_DATE_FORMAT}
                timeZonesLoading={timeZonesLoading}
                timeZones={timeZones}
                languagesLoading={languagesLoading}
                languages={languages}
              />
            ))}

          {currentTab === 'permissions' && (
            <UserRoles
              ref={userRolesForm}
              currentUserRoles={currentUserRoles || []}
              operation="edit"
            />
          )}

          {currentTab === 'data-access' &&
            (loading ||
            !currentUserDataAccess ||
            approvedpersonsLoading ||
            !approvedpersons ||
            approvedorganizationsLoading ||
            !approvedorganizations ||
            approvedlocationsLoading ||
            !approvedlocations ||
            legalEntitiesLoading ||
            !legalEntities ||
            businessUnitesLoading ||
            !businessUnites ||
            ledgersLoading ||
            !ledgers ||
            accountsLoading ||
            !accounts ? (
              <FormSkeleton fields={14} />
            ) : (
              <UserDataAccess
                ref={userDataAccessForm}
                currentUserDataAccess={currentUserDataAccess}
                approvedpersonsLoading={approvedpersonsLoading}
                approvedpersons={approvedpersons}
                approvedorganizationsLoading={approvedorganizationsLoading}
                approvedorganizations={approvedorganizations}
                approvedlocationsLoading={approvedlocationsLoading}
                approvedlocations={approvedlocations}
                legalEntitiesLoading={legalEntitiesLoading}
                legalEntities={legalEntities}
                businessUnitesLoading={businessUnitesLoading}
                businessUnites={businessUnites}
                accountsLoading={accountsLoading}
                accounts={accounts}
                ledgersLoading={ledgersLoading}
                ledgers={ledgers}
              />
            ))}
        </Card>
      </Container>
    </DashboardContent>
  );
}
