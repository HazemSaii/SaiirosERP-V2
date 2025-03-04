import { Helmet } from 'react-helmet-async';

import { RolesManagementView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export default function RolesManagementPage() {
  return (
    <>
      <Helmet>
        <title>Roles Management</title>
      </Helmet>
      <RolesManagementView />
    </>
  );
}
