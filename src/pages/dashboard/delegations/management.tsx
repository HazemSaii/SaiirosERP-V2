import { Helmet } from 'react-helmet-async';

import {DelegationsManagementView  } from 'src/sections/delegations/view';

// ----------------------------------------------------------------------

export default function RolesManagementPage() {
  return (
    <>
      <Helmet>
        <title> Delegations Management</title>
      </Helmet>
      <DelegationsManagementView />
    </>
  );
}
