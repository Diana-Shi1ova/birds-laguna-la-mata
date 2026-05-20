import { useEffect, useState } from "react";
import "./Index.css" ;
import Map from '../../components/Map/Map';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import FiltersPannel from "../../components/FiltersPannel/FiltersPannel";
import { useSearchUI } from "../../contexts/SearchUIProvider";


function Index(){
    const { setFilters, value, setValue, setSearchType } = useSearchUI();
    
    useEffect(() => {
        setFilters(true);
        setSearchType('map');
        setValue('');
    }, []);
    

    return(
        <MainLayout>
            <Map></Map>
            <FiltersPannel></FiltersPannel>
        </MainLayout>
    );
}

export default Index;