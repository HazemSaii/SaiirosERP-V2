import { paths } from 'src/routes/paths';
import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';

import { UserNewEditForm } from '../user-new-edit-form';
import { UserPreferences } from '../user-preferences';
// import { UserRoles } from '../user-roles';
// import { UserDataAccess } from '../user-data-access';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'user-info',
    label: 'User Info',
    icon: <Iconify icon="solar:user-id-linear" width={24} />,
    component: UserNewEditForm,
  },
  {
    value: 'preferences',
    label: 'Preferences',
    icon: <Iconify icon="pajamas:preferences" width={24} />,
    component: UserPreferences,
  },
  // {
  //   value: 'permissions',
  //   label: 'Permissions',
  //   icon: <Iconify icon="icon-park-outline:permissions" width={24} />,
  //   component: UserRoles,
  // },
  // {
  //   value: 'data-access',
  //   label: 'Data Access',
  //   icon: <Iconify icon="icon-park-outline:data-user" width={24} />,
  //   component: UserDataAccess,
  // },
];

export function UserCreateView() {
  const [currentTab, setCurrentTab] = useState('user-info');

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading="Create a new user"
          links={[
            { name: 'Security', href: paths.security.root },
            { name: 'User', href: paths.security.users.root },
            { name: 'New user' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
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

          <Box sx={{ p: 3 }}>
            {TABS.map((tab) => {
              const Component = tab.component;
              return currentTab === tab.value && <Component key={tab.value} />;
            })}
          </Box>
        </Card>
      </Container>
    </DashboardContent>
  );
}
