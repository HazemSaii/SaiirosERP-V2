import { Helmet } from "react-helmet-async";

import { PersonManagementView } from "src/sections/hr/personManagement/view";

export default function PersonManagementPage(){
    return(
        <>
         <Helmet>
        <title> Person Management</title>
        </Helmet>
        <PersonManagementView/>
        
        </>
    )

}