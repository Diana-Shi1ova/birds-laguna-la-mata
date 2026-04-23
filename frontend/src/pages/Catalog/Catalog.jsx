import "./Catalog.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import BirdCard from "../../components/BirdCard/BirdCard";
import GridLayout from "../../layouts/GridLayout/GridLayout";
import Pagination from "../../components/Pagination/Pagination";
import { useState, useEffect } from "react";
import { api } from "../../api/api";

function Catalog(){
    /*const data = {
        name: 'Gavión atlántico',
        cientific: 'Larus Marinus',
        link: 'https://es.wikipedia.org/wiki/Larus_marinus',
        imagelink: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Great_Black-backed_Gull_Larus_marinus.jpg',
        observation: 'cerca del agua, entre 14:00-18:00'
    }*/

    const [birds, setBirds] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);

    // Hacer petición de pájaros
    useEffect(() => {
        if(current==="") return;
        // Petición al servidor
        api.get('/bird', {
            params: { page: Number(current), limit:10 }
        })
        .then(response => {
            console.log(response.data.data);
            setBirds(response.data.data);
            setTotal(response.data.totalPages);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [current]);

    // Normalizar datos
    function normalizeBird(item) {
        return {
            name: item.comName,
            scientific: item.sciName,
            link: item.wikidata?.wikipediaURL || null,
            imagelink: item.wikidata?.images?.[item.wikidata?.images?.length-1] || null,
            id: item._id,
            code: item.speciesCode
        };
    }


    return(
        <MainLayout>
            <h1>Catálogo de especies</h1>
            <GridLayout>
                {/* <BirdCard data={data}></BirdCard>
                <BirdCard data={data}></BirdCard>
                <BirdCard data={data}></BirdCard>
                <BirdCard data={data}></BirdCard>
                <BirdCard data={data}></BirdCard> */}
                {/*birds.map((bird) => (
                <BirdCard
                    key={bird.speciesCode}
                    data={normalizeBird(bird)}
                    />
                ))*/}
                {birds
                    .filter(bird => !bird.comName?.toLowerCase().includes('(híbrido)'))
                    .map(bird => (
                        <li key={bird.speciesCode}>
                            <BirdCard
                                data={normalizeBird(bird)}
                            />
                        </li>
                    ))
                }
            </GridLayout>
            <Pagination
                total={total}
                current={current}
                onCurrentChange={setCurrent}
            />
        </MainLayout>
    );
}

export default Catalog;