import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { OrganizationsEditView } from 'src/sections/hr/organizations/view';

// ----------------------------------------------------------------------

export default function OrganizationsEditPage() {
  const params = useParams();

  const { id } = params;


  return (
    <>
    <Helmet>
        <title> Organizations Edit</title>
      </Helmet>
      <OrganizationsEditView id={`${id}`}/>

    </>
  );
}