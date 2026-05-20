import "./Catalog.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import BirdCard from "../../components/BirdCard/BirdCard";
import GridLayout from "../../layouts/GridLayout/GridLayout";
import Pagination from "../../components/Pagination/Pagination";
import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useSearchUI } from "../../contexts/SearchUIProvider";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";


function Catalog(){
    const { t, i18n } = useTranslation();
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
            params: { page: Number(current), limit:10, name: value, locale: i18n.resolvedLanguage }
        })
        .then(response => {
            setBirds(response.data.data);
            setTotal(response.data.totalPages);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [current, value, i18n]);


    useEffect(() => {
        setCurrent(1);
    }, [value]);

    return(
        <MainLayout>
            <h1>{t('page.title.catalog')}</h1>
            {total>0 ? (
                <>
                <GridLayout>
                    {birds
                        .filter(bird => !bird.comName?.toLowerCase().includes('(híbrido)'))
                        .map(bird => (
                            <li key={bird._id}>
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
                </>
            ) : (
                <div className="no-results">
                    <FaSearch />
                    <p>{t('catalog.without')}</p>
                </div>
            )}
            
            
        </MainLayout>
    );
}

export default Catalog;