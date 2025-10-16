import { useEffect, useState } from "react";
import { api } from "../../api/api";
import "./Index.css" ;

function Index(){
    const [birds, setBirds] = useState([]); // Birds list

    // Obtein data from server
    useEffect(() => {
        api.get('/eBird')
        .then(response => {
            console.log(response.data);
            setBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);
    

    return(
        <>
            <h1>Página inicio</h1>
            <h2>Prueba obtención datos de eBird:</h2>
            <ul>
                {birds.map((obs, index) => (
                    <li key={`${obs.subId}-${index}`}>
                        <strong>{obs.comName}</strong> ({obs.sciName}) <br />
                        Location: {obs.locName} ({obs.lat}, {obs.lng}) <br />
                        Observed at: {obs.obsDt}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Index;