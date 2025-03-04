import type { IUserItem } from 'src/types/user';
import type { IRoleFunctionInfo } from 'src/types/role';

import { UseAddRoleUsers, UseAddFunctionForRole } from 'src/actions/security/role';

import { toast } from 'src/components/snackbar';

export async function roleAdditionalData({
  roleId,
  selectedRoleUsers,
  operation,
  originalRoleUsers,
}: {
  roleId: string;
  selectedRoleUsers: IUserItem[] | null | undefined;
  operation: 'edit' | 'create';
  originalRoleUsers?: IUserItem[] | null | undefined;
  refetch?: any;
}) {
  try {
    if (operation === 'create') {
      if (selectedRoleUsers && selectedRoleUsers.length > 0) {
        const users = selectedRoleUsers.map((user) => ({
          roles: roleId,
          users: user.id,
          operations: 1,
        }));
        const res = await UseAddRoleUsers(users);
      }
    } else if (operation === 'edit') {
      const users =
        selectedRoleUsers
          ?.filter(
            (user) =>
              !originalRoleUsers?.some((originalUser) => originalUser.userId === user.userId)
          )
          .map((user) => ({
            roles: roleId,
            users: user.userId,
            operations: 1,
          })) || [];
      const removedUsers =
        originalRoleUsers
          ?.filter(
            (originalUser) =>
              !selectedRoleUsers?.some((user) => user.userId === originalUser.userId)
          )
          .map((user) => ({
            roles: roleId,
            users: user.userId,
            operations: 3,
          })) || [];
      const data = [...users, ...removedUsers];

      await UseAddRoleUsers(data);
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred');
  }
}
export async function FunctionForRoleAddData({
  roleId,
  SelectedRoleFunctions,
  operation,
  currentRoleFunction,
  refetch,
}: {
  roleId: string;
  SelectedRoleFunctions: IRoleFunctionInfo[] | undefined | null;
  operation: string;
  currentRoleFunction?: any;
  refetch?: any;
}) {
  try {
    if (operation === 'create') {
      if (SelectedRoleFunctions && SelectedRoleFunctions.length > 0) {
        const rolesFunctionDTOS = SelectedRoleFunctions.map((roleFunction) => ({
          functionId: roleFunction.functionId,
          accessType: roleFunction.accessType,
          operation: 1,
        }));
        const data = {
          roleId,
          rolesFunctionDTOS,
        };
        await UseAddFunctionForRole(data);
      }
    } else if (operation === 'edit') {
      const functions =
        SelectedRoleFunctions?.filter(
          (f) =>
            !currentRoleFunction?.some(
              (current: any) =>
                current.functionId === f.functionId && current.accessType === f.accessType
            )
        ).map((f) => ({
          functionId: f.functionId,
          accessType: f.accessType,
          operation: 1,
        })) || [];

      const removedFunction =
        currentRoleFunction
          ?.filter(
            (current: any) =>
              !SelectedRoleFunctions?.some(
                (roleFunction: any) =>
                  roleFunction.functionId === current.functionId && current.selected === 1
              )
          )
          .map((roleFunction: any) => ({
            functionId: roleFunction.functionId,
            accessType: roleFunction.accessType,
            operation: 3,
          })) || [];

      const rolesFunctionDTOS = [...functions, ...removedFunction];
      const data = {
        roleId,
        rolesFunctionDTOS,
      };
      await UseAddFunctionForRole(data);
      refetch();
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred');
  }
}
