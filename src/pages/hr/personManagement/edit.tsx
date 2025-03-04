import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { GradeRatesEditView } from 'src/sections/hr/gradeRates/view';



export default function PersonEditPage(){
    const params = useParams();

    const { id } = params;
    
    return(
        <>
        
        <Helmet>
        <title> Person Edit</title>
       </Helmet>
       <GradeRatesEditView id={`${id}`}/>
    
        </>
    )
}