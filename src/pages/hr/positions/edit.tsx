import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

// import { PositionsEditView } from 'src/sections/hr/positions/view';

// ----------------------------------------------------------------------

export default function PositionsEditPage() {
  const params = useParams();

  const { id } = params;


  return (
    <>
    <Helmet>
        <title>Positions Edit</title>
      </Helmet>
      {/* <PositionsEditView id={`${id}`}/> */}

    </>
  );
}