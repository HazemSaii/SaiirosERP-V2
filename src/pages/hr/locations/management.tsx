import { Helmet } from 'react-helmet-async';

import { LocationsManagementView } from 'src/sections/hr/locations/view';


// ----------------------------------------------------------------------

export default function LocationsManagementPage() {
  return (
    <>
    <Helmet>
        <title> Locations Management</title>
    </Helmet>
    
    <LocationsManagementView />
    </>

  );
}
