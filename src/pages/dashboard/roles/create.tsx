import { Helmet } from 'react-helmet-async';

import { RolesCreateView } from 'src/sections/roles/view';
// ----------------------------------------------------------------------

export default function RolesCreatePage() {
  return (
    <>
      <Helmet>
        <title> Roles Create</title>
      </Helmet>
      <RolesCreateView />
    </>
  );
}
