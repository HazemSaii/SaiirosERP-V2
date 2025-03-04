import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import {DelegationsEditView  } from 'src/sections/delegations/view';
// ----------------------------------------------------------------------

export default function RolesEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Delegation Edit</title>
      </Helmet>

      <DelegationsEditView id={`${id}`} />
    </>
  );
}
