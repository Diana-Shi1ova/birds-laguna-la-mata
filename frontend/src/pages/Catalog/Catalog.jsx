import "./Catalog.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import BirdCard from "../../components/BirdCard/BirdCard";
import GridLayout from "../../layouts/GridLayout/GridLayout";
import Pagination from "../../components/Pagination/Pagination";
import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useSearchUI } from "../../contexts/SearchUIProvider";


function Catalog(){
    const [birds, setBirds] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);
    const { setFilters, value, setValue, setSearchType } = useSearchUI();

    useEffect(() => {
        setFilters(false);
        setSearchType('catalog');
        setValue('');
    }, []);


    // Hacer petición de pájaros
    useEffect(() => {
        if(current==="") return;
        // Petición al servidor
        api.get('/bird', {
            params: { page: Number(current), limit:10, name: value }
        })
        .then(response => {
            console.log(response.data.data);
            setBirds(response.data.data);
            setTotal(response.data.totalPages);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [current, value]);


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
                                data={bird}
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