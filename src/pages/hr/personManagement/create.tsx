import { Helmet } from "react-helmet-async";

import { PersonCreateView } from "src/sections/hr/personManagement/view";

export default function PersonCreatePage(){
    return(
        <>
         <Helmet>
         <title> Person Hire </title>
         </Helmet>
         <PersonCreateView/>
        </>
    )
}