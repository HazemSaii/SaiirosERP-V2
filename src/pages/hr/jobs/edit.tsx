import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

// import { JobsEditView } from 'src/sections/hr/jobs/view';

export default function JobsEditPage(){
    const params = useParams();

    const { id } = params;
  
    return(
        <>
        
        <Helmet>
        <title> Jobs Edit</title>
       </Helmet>

       {/* <JobsEditView id={`${id}`}/> */}
        
        </>
    )
}