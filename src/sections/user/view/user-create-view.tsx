import { useRef, useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { toast } from 'sonner';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import FormSkeleton from 'src/components/Form/form-skelton';
import BackButton from 'src/components/buttons/back-button';
import { UseGetApprovedPersons } from 'src/actions/Hr/person';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { useGetAllLanguages } from 'src/actions/settings/languages';
import { useAddUser, useValidateUser } from 'src/actions/security/user';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';
import {
  useGetAllLookups,
  useGetAllTimezones,
  useGetAllLegalEnitites,
  useGetAllBusinessUnites,
  useGetAllSuppliers,
  useGetAllAccounts,
  useGetAllLedgers,
} from 'src/actions/shared/shared';
import { formatDateTimeToISOString } from 'src/utils/general-utils';
import { userDataAccess, userAdditionalData } from 'src/utils/user/user-additional-data';
import { IRoleItem } from 'src/types/role';
import { IUserInfo, IUserDataAccess, IUserPreferences } from 'src/types/user';
import UserNewEditForm, { UserNewEditFormHandle } from '../user-new-edit-form';
import UserPreferences, { UserPreferencesFormHandle } from '../user-preferences';
import UserRoles, { UserRolesFormHandle } from '../user-roles';
import UserDataAccess, { UserDataAccessFormHandle } from '../user-data-access';

export function UserCreateView() {
  const { t } = useTranslate();
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
  const router = useRouter();
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
  const settings = useSettingsContext();
  const [currentUserInfo, setcurrentUserInfo] = useState<IUserInfo>();
  const [currentUserPreferences, setcurrentUserPreferences] = useState<IUserPreferences>({
    defaultLangCode: 'EN',
    defaultTimezoneId: 94,
    startPage: 1,
    defaultDateFormat: 'dd-MM-yyyy',
    receiveEmail: 1,
  });
  const [currentUserRoles, setcurrentUserRoles] = useState<IRoleItem[]>([]);
  const [currentUserDataAccess, setcurrentUserDataAccess] = useState<IUserDataAccess>();
  const [currentTab, setCurrentTab] = useState('user-info');
  const [submitLoading, setSubmitLoading] = useState(false);
  const userInfoForm = useRef<UserNewEditFormHandle>(null);
  const userPreferencesForm = useRef<UserPreferencesFormHandle>(null);
  const userRolesForm = useRef<UserRolesFormHandle>(null);
  const userDataAccessForm = useRef<UserDataAccessFormHandle>(null);
  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
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
        formData = userDataAccessForm.current.formData();
        isValid = await userDataAccessForm.current.validate();
        setcurrentUserDataAccess(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, userInfoForm, userPreferencesForm, userRolesForm, userDataAccessForm]
  );
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
      formValid = true;
      currentData = userDataAccessForm.current.formData();
      data = { ...currentUserInfo, ...currentUserPreferences };
    }
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    data.startDate = formatDateTimeToISOString(data.startDate);
    data.endDate = formatDateTimeToISOString(data.endDate) || null;
    // data.defaultTimezoneId=data.defaultTimezoneId?.code||null;
    data.mustChangePassword = 0;
    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const apiValid = await useValidateUser(data, 1);
      const res = await useAddUser(data);
      if (res.status === 200 && apiValid.status === 200) {
        if (userDataAccessForm.current?.formData() || currentUserDataAccess) {
          const userDataAccessloading = await userDataAccess(
            currentTab === 'data-access'
              ? userDataAccessForm.current?.formData()
              : currentUserDataAccess,
            'create',
            res.data.id
          );
        }

        const userAdditionalDataloading = await userAdditionalData({
          userId: res.data.id,
          SelectedUserRoles:
            currentTab === 'permissions'
              ? userRolesForm.current?.getSelectedRoles()
              : currentUserRoles,
          userDataAccess: currentUserDataAccess,
          operation: 'create',
        });

        toast.success(t('Created successfully!'));
        router.push(paths.security.users.management);
      }
    } catch (e) {
      setSubmitLoading(false);
      toast.error((e as Error).message || 'An error occurred');
    }
  };
  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading="Create a new user"
          links={[
            { name: 'Security', href: paths.security.root },
            { name: 'Users', href: paths.security.users.root },
            { name: 'New user' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
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
            (approvedpersonsLoading || !approvedpersons || suppliersLoading || !suppliers ? (
              <FormSkeleton fields={9} />
            ) : (
              <UserNewEditForm
                ref={userInfoForm}
                currentUser={currentUserInfo || undefined}
                operation="create"
                approvedpersons={approvedpersons}
                approvedpersonsLoading={approvedpersonsLoading}
                suppliersLoading={suppliersLoading}
                suppliers={suppliers}
              />
            ))}
          {currentTab === 'preferences' &&
            (DEFAULT_DATE_FORMAT_Loading ||
            !DEFAULT_DATE_FORMAT ||
            timeZonesLoading ||
            !timeZones ||
            languagesLoading ||
            !languages ? (
              <FormSkeleton fields={5} />
            ) : (
              <UserPreferences
                ref={userPreferencesForm}
                operation="create"
                currentUserPreferences={currentUserPreferences || undefined}
                DEFAULT_DATE_FORMAT_Loading={DEFAULT_DATE_FORMAT_Loading}
                DEFAULT_DATE_FORMAT={DEFAULT_DATE_FORMAT}
                timeZonesLoading={timeZonesLoading}
                timeZones={timeZones}
                languagesLoading={languagesLoading}
                languages={languages}
              />
            ))}
          {currentTab === 'permissions' && (
            <UserRoles ref={userRolesForm} currentUserRoles={currentUserRoles} operation="create" />
          )}
          {currentTab === 'data-access' &&
            (approvedpersonsLoading ||
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
                currentUserDataAccess={currentUserDataAccess || undefined}
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
