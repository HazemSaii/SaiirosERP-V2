import { Helmet } from 'react-helmet-async';

import { OrganizationsCreateView } from 'src/sections/hr/organizations/view';

// ----------------------------------------------------------------------

export default function OrganizationsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Organizations Create </title>
      </Helmet>
      <OrganizationsCreateView/>
    </>
  );
}
