import { Helmet } from "react-helmet-async";

import GradesCreateView from "src/sections/hr/grades/view/grades-create-view";

export default function GradesCreatePage(){
    return(
        <>
         <Helmet>
         <title> Grades Create </title>
         </Helmet>
         <GradesCreateView/>
        </>
    )
}