import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

 import { PersonEditView } from 'src/sections/hr/personManagement/view';



export default function PersonCorrectPage(){
    const params = useParams();

    const { id } = params;
    
    return(
        <>
        
        <Helmet>
        <title> Person Correct</title>
       </Helmet>
       <PersonEditView id={`${id}`}/>
        </>
    )
}