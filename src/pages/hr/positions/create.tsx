import { Helmet } from 'react-helmet-async';

import { PositionsCreateView } from 'src/sections/hr/positions/view';

// ----------------------------------------------------------------------

export default function PositionsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Position Create </title>
      </Helmet>
      <PositionsCreateView/>
    </>
  );
}
