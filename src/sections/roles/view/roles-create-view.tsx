import type { IUserItem } from 'src/types/user';

import { useRef, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatDateTimeToISOString } from 'src/utils/general-utils';
import { roleAdditionalData, FunctionForRoleAddData } from 'src/utils/role/role-additional-data';

import { useLocales, useTranslate } from 'src/locales';
import { useGetUsers } from 'src/actions/security/user';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllApplications } from 'src/actions/shared/shared';
import { UseAddRole, useGetAllFunctions } from 'src/actions/security/role';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RoleUsers from '../role-users';
import RoleFunctions from '../roles-functions';
import RolesNewEditForm from '../roles-new-edit-form';

import type { RoleUsersFormHandle } from '../role-users';
import type { RoleFunctionsFormHandle } from '../roles-functions';
import type { RoleNewEditFormHandle } from '../roles-new-edit-form';
// ----------------------------------------------------------------------
type FormValues = {
  id: number;
  applicationCode: string;
  roleCode: string;
  startDate: Date;
  endDate: Date | null;
  builtIn: number;
  lang: {
    AR?: string;
    EN?: string;
  };
};
export default function RolesCreateView() {
  const router = useRouter();
  const { t } = useTranslate();
  const TABS = [
    {
      value: 'role-info',
      label: t('Role Info'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
    {
      value: 'role-functions',
      label: t('Role Functions'),
      icon: <Iconify icon="pajamas:preferences" width={24} />,
    },
    {
      value: 'role-users',
      label: t('Users'),
      icon: <Iconify icon="icon-park-outline:permissions" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentRoleInfo, setcurrentRoleInfo] = useState<FormValues>();
  const [currentRoleUsres, setcurrentRoleUsres] = useState<IUserItem[]>([]);
  const [currentRoleFunction, setcurrentRoleFunction] = useState<any[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('role-info');
  const roleInfoForm = useRef<RoleNewEditFormHandle>(null);
  const roleUsersForm = useRef<RoleUsersFormHandle>(null);
  const roleFunctionsForm = useRef<RoleFunctionsFormHandle>(null);
  const { currentLang } = useLocales();
  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;
  const { applications, applicationsLoading } = useGetAllApplications(currentLanguage);
  const { rolefunction, rolefunctionLoading } = useGetAllFunctions();
  const { users, usersLoading } = useGetUsers();
  const handleSubmit = async () => {
    let currentData = null;
    let data: any = null;
    let formValid = false;

    if (roleInfoForm.current) {
      formValid = await roleInfoForm.current.validate();
      currentData = roleInfoForm.current.formData();
      data = { ...currentData };
    }
    if (roleUsersForm.current) {
      formValid = true;
      currentData = roleUsersForm.current.getSelectedUsers();
      data = { ...currentRoleInfo };
    }
    if (roleFunctionsForm.current) {
      formValid = true;
      currentData = roleFunctionsForm.current.getSelectedRoleFunctions();
      data = { ...currentRoleInfo };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    data.startDate = formatDateTimeToISOString(data.startDate);
    data.endDate = formatDateTimeToISOString(data.endDate) || null;
    if (!formValid) return;

    try {
      setSubmitLoading(true);
      const res = await UseAddRole(data);
      if (res.status === 200) {
        toast.success(t('Role created successfully'));
        roleAdditionalData({
          roleId: res.data.id,
          selectedRoleUsers:
            currentTab === 'role-users'
              ? roleUsersForm.current?.getSelectedUsers()
              : currentRoleUsres,
          operation: 'create',
        });
        FunctionForRoleAddData({
          roleId: res.data.id,
          SelectedRoleFunctions:
            currentTab === 'role-functions'
              ? roleFunctionsForm.current?.getSelectedRoleFunctions() || []
              : currentRoleFunction,
          operation: 'create',
        });
        router.push(paths.security.roles.management);
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
      if (currentTab === 'role-info' && roleInfoForm.current) {
        isValid = await roleInfoForm.current.validate();
        formData = await roleInfoForm.current.formData();
        setcurrentRoleInfo(formData);
      }
      if (currentTab === 'role-functions' && roleFunctionsForm.current) {
        formData = roleFunctionsForm.current.getSelectedRoleFunctions();
        setcurrentRoleFunction(formData);
      }
      if (currentTab === 'role-users' && roleUsersForm.current) {
        formData = roleUsersForm.current.getSelectedUsers();
        setcurrentRoleUsres(formData);
      }

      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, roleInfoForm, roleUsersForm]
  );

  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Create a new Role')}
          links={[
            {
              name: t('security'),
              href: paths.security.root,
            },
            {
              name: t('Roles'),
              href: paths.security.roles.root,
            },
            { name: t('New Role') },
          ]}
          action={
            <div>
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
            </div>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
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
        {currentTab === 'role-info' && !applicationsLoading && (
          <RolesNewEditForm
            ref={roleInfoForm}
            currentRole={currentRoleInfo}
            operation="create"
            applicationsData={applications}
            applicationsLoading={applicationsLoading}
          />
        )}
        {currentTab === 'role-functions' && !rolefunctionLoading && (
          <RoleFunctions
            ref={roleFunctionsForm}
            currentRoleFunctions={currentRoleFunction}
            operation="create"
            rolefunction={rolefunction}
            rolefunctionLoading={rolefunctionLoading}
          />
        )}
        {currentTab === 'role-users' && !usersLoading && (
          <RoleUsers
            ref={roleUsersForm}
            currentRoleUsers={currentRoleUsres}
            operation="create"
            users={users}
            usersLoading={usersLoading}
          />
        )}
      </Container>
    </DashboardContent>
  );
}
