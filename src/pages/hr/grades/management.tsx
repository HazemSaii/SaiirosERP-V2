import { Helmet } from "react-helmet-async";

import GradesManagementView from "src/sections/hr/grades/view/grades-management-view";

export default function GradesManagementPage(){
    return(
        <>
         <Helmet>
        <title> Grades Management</title>
        </Helmet>
        <GradesManagementView/>
        
        </>
    )

}