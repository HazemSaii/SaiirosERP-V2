import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import JobesFamiliesEditView from 'src/sections/hr/job families/view/jobFamilies-edit-view';

export default function JobFamiliesEditPage(){
    const params = useParams();

    const { id } = params;
  
    return(
        <>
        
        <Helmet>
        <title> Jobs Families Edit</title>
       </Helmet>

       <JobesFamiliesEditView id={`${id}`}/>
        
        </>
    )
}
