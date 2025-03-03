import { Helmet } from "react-helmet-async";

import { GradeRatesManagementView } from "src/sections/hr/gradeRates/view";

export default function GradesManagementPage(){
    return(
        <>
         <Helmet>
        <title> Grade Rates Management</title>
        </Helmet>
        <GradeRatesManagementView/>
        
        </>
    )

}