import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

//  import { PersonUpdateView } from 'src/sections/hr/personManagement/view';



export default function PersonUpdatePage(){
    const params = useParams();

    const { id } = params;
    
    return(
        <>
        
        <Helmet>
        <title> Person Update</title>
       </Helmet>
       {/* <PersonUpdateView id={`${id}`}/> */}
    
        </>
    )
}