import { Helmet } from 'react-helmet-async';

import {DelegationsCreateView  } from 'src/sections/delegations/view';
// ----------------------------------------------------------------------

export default function RolesCreatePage() {
  return (
    <>
      <Helmet>
        <title> Delegation Create </title>
      </Helmet>
      <DelegationsCreateView />
    </>
  );
}
