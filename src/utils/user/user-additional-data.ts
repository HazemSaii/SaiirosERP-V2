import { toast } from 'sonner';

import {
  useAddUserDataAccess,
  useUpdateUserDataAccess,
  useAddUserRoles,
  useEditUserRoles,
} from 'src/actions/security/user';
import { UseAddRoleUsers } from 'src/actions/security/role';

import { IRoleItem } from '../../types/role';

export async function userAdditionalData({
  userId,
  SelectedUserRoles,
  userDataAccess,
  operation,
  originalUserRoles,
}: {
  userId: string;
  SelectedUserRoles: IRoleItem[] | undefined | null;
  userDataAccess: any;
  operation: 'edit' | 'create';
  originalUserRoles?: IRoleItem[] | undefined;
}) {
  try {
    if (operation === 'create') {
      if (SelectedUserRoles && SelectedUserRoles.length > 0) {
        const roles = SelectedUserRoles.map((role) => ({
          users: userId,
          roles: role.id,
          operations: 1,
        }));
        const res = await UseAddRoleUsers(roles);
      }
    } else if (operation === 'edit') {
      const roles =
        SelectedUserRoles?.filter(
          (role) => !originalUserRoles?.some((originalRole) => originalRole.roleId === role.roleId)
        ).map((role) => ({
          users: userId,
          roles: role.roleId,
          operations: 1,
        })) || [];
      const removedRoles =
        originalUserRoles
          ?.filter(
            (originalRole) =>
              !SelectedUserRoles?.some((role) => role.roleId === originalRole.roleId)
          )
          .map((role) => ({
            users: userId,
            roles: role.roleId,
            operations: 3,
          })) || [];

      const data = [...roles, ...removedRoles];
      const res = await UseAddRoleUsers(data);
    }
  } catch (e) {
    toast.error((e as Error).message || 'An error occurred');
  }
}
export async function userDataAccess(
  user_DataAccess: any,
  operation: 'create' | 'edit',
  userId?: string,
  refetch?: any
) {
  const userDataAccessObject = Object.keys(user_DataAccess)
    .map((key) => {
      let dataAccessContext = '';
      let hierarchyTopValueId: number | null = null;
      let scope = user_DataAccess[key];

      if (scope === null || scope === undefined) {
        return null;
      }

      let userDataAccessScopeDTOS: any[] = [];

      switch (key) {
        case 'personScope':
          dataAccessContext = 'PERSON';
          hierarchyTopValueId = user_DataAccess.personHierarchy ? user_DataAccess.manager : 0;

          userDataAccessScopeDTOS =
            user_DataAccess.person.length > 0
              ? user_DataAccess.person.map((personValue: number) => ({
                  userId,
                  dataAccessContext,
                  valueOrHierarchy: user_DataAccess.personHierarchy ? 2 : 1,
                  fixedValue: personValue,
                  hierarchyTopValueId: hierarchyTopValueId,
                  includeTopValue: user_DataAccess.perTop ? 1 : 0,
                  active: 1,
                }))
              : [
                  {
                    userId,
                    dataAccessContext,
                    valueOrHierarchy: user_DataAccess.personHierarchy ? 2 : 1,
                    fixedValue: -200,
                    hierarchyTopValueId,
                    includeTopValue: user_DataAccess.perTop ? 1 : 0,
                    active: 1,
                  },
                ];
          break;

        case 'organizationScope':
          dataAccessContext = 'ORGANIZATION';
          hierarchyTopValueId = user_DataAccess.organizationHierarchy
            ? user_DataAccess.organizationManager
            : 0;

          userDataAccessScopeDTOS =
            user_DataAccess.organization.length > 0
              ? user_DataAccess.organization.map((orgValue: number) => ({
                  userId,
                  dataAccessContext,
                  valueOrHierarchy: user_DataAccess.organizationHierarchy ? 2 : 1,
                  fixedValue: orgValue,
                  hierarchyTopValueId,
                  includeTopValue: user_DataAccess.orgTop ? 1 : 0,
                  active: 1,
                }))
              : [
                  {
                    userId,
                    dataAccessContext,
                    valueOrHierarchy: user_DataAccess.organizationHierarchy ? 2 : 1,
                    fixedValue: -200,
                    hierarchyTopValueId,
                    includeTopValue: user_DataAccess.orgTop ? 1 : 0,
                    active: 1,
                  },
                ];
          break;

        case 'locationScope':
          dataAccessContext = 'LOCATION';
          userDataAccessScopeDTOS =
            user_DataAccess.location.length > 0
              ? user_DataAccess.location.map((locValue: any) => ({
                  userId,
                  dataAccessContext,
                  fixedValue: locValue,
                  active: 1,
                }))
              : [{ userId, dataAccessContext, fixedValue: -200, active: 1 }];
          break;

        case 'ledgerScope':
          dataAccessContext = 'LEDGER';
          userDataAccessScopeDTOS =
            user_DataAccess.ledger.length > 0
              ? user_DataAccess.ledger.map((ledgerValue: number) => ({
                  userId,
                  dataAccessContext,
                  fixedValue: ledgerValue,
                  active: 1,
                }))
              : [];
          break;

        case 'legalEntityScope':
          dataAccessContext = 'LEGAL_ENTITY';
          userDataAccessScopeDTOS =
            user_DataAccess.legalEntity.length > 0
              ? user_DataAccess.legalEntity.map((entityValue: number) => ({
                  userId,
                  dataAccessContext,
                  fixedValue: entityValue,
                  active: 1,
                }))
              : [];
          break;

        case 'businessUnitScope':
          dataAccessContext = 'BUSINESS_UNIT';
          userDataAccessScopeDTOS =
            user_DataAccess.businessUnit.length > 0
              ? user_DataAccess.businessUnit.map((unitValue: number) => ({
                  userId,
                  dataAccessContext,
                  fixedValue: unitValue,
                  active: 1,
                }))
              : [];
          break;

        case 'accountScope':
          dataAccessContext = 'ACCOUNT';
          userDataAccessScopeDTOS =
            user_DataAccess.account.length > 0
              ? user_DataAccess.account.map((accountValue: number) => ({
                  userId,
                  dataAccessContext,
                  fixedValue: accountValue,
                  active: 1,
                }))
              : [{ userId, dataAccessContext, fixedValue: -200, active: 1 }];
          break;

        default:
          return null;
      }

      return {
        userId,
        dataAccessContext,
        scope,
        active: 1,
        userDataAccessScopeDTOS,
      };
    })
    .filter((item) => item !== null);

  if (operation === 'create') {
    await useAddUserDataAccess(userDataAccessObject);
  } else {
    await useUpdateUserDataAccess(userDataAccessObject);
  }
}
