import { Helmet } from "react-helmet-async";

import JobsManagementview from "src/sections/hr/jobs/view/jobs-management-view";

export default function JobsManagementPage(){
    return(
        <>
         <Helmet>
        <title> Jobs Management</title>
        </Helmet>
        <JobsManagementview/>
        </>
    )
}