import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { RolesEditView } from 'src/sections/roles/view';
// ----------------------------------------------------------------------

export default function RolesEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Roles Edit</title>
      </Helmet>

      <RolesEditView id={`${id}`} />
    </>
  );
}
