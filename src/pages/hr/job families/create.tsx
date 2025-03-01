import { Helmet } from "react-helmet-async";

import JobFamiliesCreateView from "src/sections/hr/job families/view/jobFamilies-create-view";

export default function JobFamiliesCreatePage(){
    return(
        <>
         <Helmet>
         <title> Job Families Create </title>
         </Helmet>
         <JobFamiliesCreateView/>
        </>
    )
}