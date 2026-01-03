import { useEffect, useState } from "react";
//import { api } from "../../api/api";
import "./Index.css" ;

// Import map
import Map from '../../components/Map/Map';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import FiltersPannel from "../../components/FiltersPannel/FiltersPannel";

function Index(){
    //const [birds, setBirds] = useState([]); // Birds list

    // Obtein data from server
    /*useEffect(() => {
        api.get('/eBird')
        .then(response => {
            console.log(response.data);
            setBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);*/
    

    return(
        <MainLayout>
            <h1>Página inicio</h1>
            <h2>Prueba obtención datos de eBird:</h2>
            <Map></Map>
            <FiltersPannel></FiltersPannel>
        </MainLayout>
    );
}

export default Index;