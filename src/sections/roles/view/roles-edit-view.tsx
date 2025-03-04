import type { IUserItem } from 'src/types/user';

import { useRef, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatDateTimeToISOString } from 'src/utils/general-utils';
import { roleAdditionalData, FunctionForRoleAddData } from 'src/utils/role/role-additional-data';

import { useLocales, useTranslate } from 'src/locales';
import { useGetUsers } from 'src/actions/security/user';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllApplications } from 'src/actions/shared/shared';
import {
  useGetRole,
  UseEditRole,
  useGetUsersByRole,
  useGetAllFunctions,
  useGetFunctionForRole,
} from 'src/actions/security/role';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import hasFormChanges from 'src/components/Form/form-data-changes';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RoleUsers from '../role-users';
import RoleFunctions from '../roles-functions';
import RolesNewEditForm from '../roles-new-edit-form';

import type { RoleUsersFormHandle } from '../role-users';
import type { RoleFunctionsFormHandle } from '../roles-functions';
import type { RoleNewEditFormHandle } from '../roles-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};
type FormValues = {
  id: number;
  applicationCode: string;
  roleCode: string;
  startDate: string | Date | null;
  endDate?: string | null;
  builtIn: number;
  lang: {
    EN?: string;
    AR?: string;
  };
};

const useFetchUserData = (id: any) => {
  const [roleData, setRoleData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [FunctionsData, setFunctionsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { role, rolesValidating, refetch: refetchRole } = useGetRole(id);
  const { users, usersValidating, refetch: refetchUsers } = useGetUsersByRole(id);

  const {
    functionForRole,
    functionForRoleValidating,
    refetch: refetchFunctions,
  } = useGetFunctionForRole(id);

  const refetch = useCallback(() => {
    refetchRole();
    refetchUsers();
    refetchFunctions();
  }, [refetchUsers, refetchFunctions, refetchRole]);

  useEffect(() => {
    if (!usersValidating && !rolesValidating && !functionForRoleValidating) {
      setRoleData(role);
      setUsersData(users);
      setFunctionsData(functionForRole);
      setLoading(false);
    }
  }, [usersValidating, rolesValidating, role, users, functionForRoleValidating, functionForRole]);

  return { roleData, usersData, FunctionsData, loading, refetch };
};

export default function RolesEditView({ id }: Props) {
  const { currentLang } = useLocales();
  const currentLanguage = typeof currentLang === 'string' ? currentLang : currentLang.value;

  const settings = useSettingsContext();
  const router = useRouter();
  const { t } = useTranslate();
  const { usersData, roleData, FunctionsData, loading, refetch } = useFetchUserData(id);
  const { applications, applicationsLoading } = useGetAllApplications(currentLanguage);
  const { rolefunction, rolefunctionLoading } = useGetAllFunctions();
  const { users, usersLoading } = useGetUsers();
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

  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentRoleInfo, setCurrentRoleInfo] = useState<any>();
  const [currentRoleUsers, setCurrentRoleUsers] = useState<IUserItem[] | null>([]);
  const [currentRoleFunction, setCurrentRoleFunction] = useState<any[] | null>([]);
  const [currentTab, setCurrentTab] = useState('role-info');

  const roleInfoForm = useRef<RoleNewEditFormHandle>(null);
  const roleUsersForm = useRef<RoleUsersFormHandle>(null);
  const roleFunctionsForm = useRef<RoleFunctionsFormHandle>(null);

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (loading) return;
      if (currentTab === 'role-info' && roleInfoForm.current) {
        isValid = await roleInfoForm.current.validate();
        formData = roleInfoForm.current.formData();
        setCurrentRoleInfo(formData);
      }
      if (currentTab === 'role-functions' && roleFunctionsForm.current) {
        formData = roleFunctionsForm.current.getSelectedRoleFunctions();
        setCurrentRoleFunction(formData);
      }
      if (currentTab === 'role-users' && roleUsersForm.current) {
        formData = roleUsersForm.current.getSelectedUsers();
        setCurrentRoleUsers(formData);
      }

      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, roleInfoForm, roleUsersForm, roleFunctionsForm, loading]
  );

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;

    if (roleInfoForm.current) {
      formValid = await roleInfoForm.current.validate();
      currentData = roleInfoForm.current.formData();
      data = { ...currentData };
    }

    if (roleFunctionsForm.current) {
      formValid = true;
      currentData = roleFunctionsForm.current.getSelectedRoleFunctions();
      data = { ...currentRoleInfo };
    }

    if (roleUsersForm.current) {
      formValid = true;
      currentData = roleUsersForm.current.getSelectedUsers();
      data = { ...currentRoleInfo };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    data.id = Number(id);
    data.startDate = formatDateTimeToISOString(data.startDate);
    data.endDate = formatDateTimeToISOString(data.endDate) || null;
    if (!formValid) return;

    const selectedUsers =
      currentTab === 'role-users' ? roleUsersForm.current?.getSelectedUsers() : currentRoleUsers;
    const filteredoriginalRoleUsers = loading
      ? []
      : usersData.filter((user: any) => user.selected === 1);
    // Sort by userId
    const sortedoriginalRoleUsers = filteredoriginalRoleUsers.sort(
      (a: IUserItem, b: IUserItem) => Number(a.userId) - Number(b.userId)
    );
    const sortedselectedUsers = selectedUsers?.sort(
      (a: IUserItem, b: IUserItem) => Number(a.userId) - Number(b.userId)
    );
    const currentRoleFunctions = loading ? [] : FunctionsData.filter((f: any) => f.selected === 1);
    const SelectedRoleFunctions =
      currentTab === 'role-functions'
        ? roleFunctionsForm.current?.getSelectedRoleFunctions()
        : currentRoleFunction;

    const hasChanges = {
      info: hasFormChanges([mapRolesInfo(roleData)], [data]),
      users: hasFormChanges(sortedoriginalRoleUsers, sortedselectedUsers || []),
      functions: hasFormChanges(currentRoleFunctions, SelectedRoleFunctions || []),
    };

    if (!hasChanges.info && !hasChanges.users && !hasChanges.functions) {
      toast.info(t('No changes to save.'));
      refetch();
      router.push(paths.security.roles.management);
      return;
    }

    try {
      setSubmitLoading(true);
      if (hasChanges.info) {
        await UseEditRole(data);
      }
      if (hasChanges.users) {
        await roleAdditionalData({
          roleId: data.id,
          selectedRoleUsers: sortedselectedUsers,
          operation: 'edit',
          originalRoleUsers: sortedoriginalRoleUsers,
        });
      }
      if (hasChanges.functions) {
        FunctionForRoleAddData({
          roleId: data.id,
          SelectedRoleFunctions,
          operation: 'edit',
          currentRoleFunction: currentRoleFunctions,
          refetch,
        });
      }

      refetch();
      toast.success(t('Edited successfully!'));
      router.push(paths.security.roles.management);
      setCurrentRoleInfo(null);
      setCurrentRoleUsers(null);
      setCurrentRoleFunction(null);
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

  const mapRolesInfo = (role: any): FormValues => ({
    id: Number(role.id) || 0,
    applicationCode: role.applicationCode || '',
    roleCode: role.roleCode || '',
    startDate: role.startDate ? formatDateTimeToISOString(roleData.startDate) : new Date(),
    endDate: role.endDate ? formatDateTimeToISOString(roleData.endDate) : null,
    builtIn: role.builtIn ? 1 : 0,

    lang: {
      ...(role?.lang.EN && { EN: role.lang.EN }),
      ...(role?.lang.AR && { AR: role.lang.AR }),
    },
  });

  useEffect(() => {
    if (!loading) {
      const mappedRoleInfo = mapRolesInfo(roleData);
      const selectedUsers = usersData.filter((user: any) => user.selected === 1);
      const selectedfunctionForRole = FunctionsData.filter((f: any) => f.selected === 1);
      setCurrentRoleInfo(mappedRoleInfo);
      setCurrentRoleUsers(selectedUsers);
      setCurrentRoleFunction(selectedfunctionForRole);
    }
    return () => {
      setCurrentRoleInfo(null);
      setCurrentRoleUsers(null);
      setCurrentRoleFunction(null);
    };
  }, [loading, FunctionsData, roleData, usersData]);
  let RoleName;
  switch (currentLanguage) {
    case 'EN':
      RoleName = currentRoleInfo?.lang.EN;
      break;
    case 'ar':
      RoleName = currentRoleInfo?.lang.AR;
      break;
    default:
      RoleName = currentRoleInfo?.lang.EN;
  }
  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Edit Role ') + (RoleName ?? '')}
          links={[
            {
              name: t('security'),
              href: paths.security.root,
            },
            {
              name: t('Roles'),
              href: paths.security.roles.root,
            },
            { name: t('Edit Role ') },
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
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'role-info' &&
          !applicationsLoading &&
          (loading || !currentRoleInfo ? (
            <FormSkeleton fields={5} />
          ) : (
            <RolesNewEditForm
              ref={roleInfoForm}
              rolesLoading={loading}
              currentRole={currentRoleInfo}
              operation="edit"
              applicationsData={applications}
              applicationsLoading={applicationsLoading}
            />
          ))}

        {currentTab === 'role-functions' &&
          !rolefunctionLoading &&
          (loading || !currentRoleFunction?.filter((user: any) => user.selected === 1) ? (
            <FormSkeleton fields={5} />
          ) : (
            <RoleFunctions
              ref={roleFunctionsForm}
              currentRoleFunctions={currentRoleFunction}
              operation="edit"
              rolefunction={rolefunction}
              rolefunctionLoading={rolefunctionLoading}
            />
          ))}

        {currentTab === 'role-users' &&
          !usersLoading &&
          (loading || !currentRoleUsers ? (
            <FormSkeleton fields={5} />
          ) : (
            <RoleUsers
              ref={roleUsersForm}
              currentRoleUsers={currentRoleUsers}
              operation="edit"
              users={users}
              usersLoading={usersLoading}
            />
          ))}
      </Container>
    </DashboardContent>
  );
}
