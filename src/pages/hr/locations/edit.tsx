import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { LocationsEditView } from 'src/sections/hr/locations/view';

// ----------------------------------------------------------------------

export default function LocationsEditPage() {
  const params = useParams();

  const { id } = params;


  return (
    <>
    <Helmet>
        <title> Locations Edit</title>
      </Helmet>
      <LocationsEditView locationId={`${id}`}/>
    </>
  );
}