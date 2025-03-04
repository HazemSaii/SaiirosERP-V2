import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import GradesEditView from 'src/sections/hr/grades/view/grades-edit-view';


export default function GradesEditPage(){
    const params = useParams();

    const { id } = params;
    
    return(
        <>
        
        <Helmet>
        <title> Grades Edit</title>
       </Helmet>
       <GradesEditView id={`${id}`}/>
    
        </>
    )
}