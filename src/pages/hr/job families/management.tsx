import { Helmet } from "react-helmet-async";

import JobFamiliesManagementView from "src/sections/hr/job families/view/jobFamilies-management-view";

export default function JobFamiliesManagementPage(){
    return(
        <>
         <Helmet>
        <title> Job Families Management</title>
        </Helmet>
        <JobFamiliesManagementView/>
        </>
    )

}