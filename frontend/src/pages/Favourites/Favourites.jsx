import "./Favourites.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { UseAuth } from "../../auth/useAuth";
import { Navigate } from "react-router-dom";
import GridLayout from "../../layouts/GridLayout/GridLayout";
import Pagination from "../../components/Pagination/Pagination";
import BirdCard from "../../components/BirdCard/BirdCard";
import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useBirds } from "../../contexts/BirdsProvider";
import { useSearchUI } from "../../contexts/SearchUIProvider";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { FaDove } from "react-icons/fa";
import { BsFillBookmarkStarFill } from "react-icons/bs";


function Favourites(){
    const { t, i18n } = useTranslation();
    const { isAuth, user } = UseAuth();
    const { favourites } = useBirds();
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);
    const { setFilters, value, setValue, setSearchType } = useSearchUI();
    const navigate = useNavigate();
    
    useEffect(() => {
        setFilters(false);
        setSearchType('catalog');
        setValue('');
    }, []);

    // Si no autorizado, se redirige a login
    /*if (!isAuth) {
        return <Navigate to="/login" replace />;
    }*/

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }
    }, [isAuth]);

    useEffect(() => {
        if(current==="") return;
        // Petición al servidor
        api.get(`/favourite/${user._id}`, {
            params: { page: Number(current), limit:10, name: value, locale: i18n.resolvedLanguage }
        })
        .then(response => {
            console.log(response.data.data);
            setData(response.data.data);
            setTotal(response.data.totalPages);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [current, favourites, value, i18n]);


    return(
        <MainLayout>
            <h1>{t('page.title.saved')}</h1>
            {favourites.size > 0 ? (
                <>
                <GridLayout>
                    {data
                        .map(d => (
                            <li key={d.bird._id}>
                                <BirdCard
                                    data={d.bird}
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
                <>
                <div className="without-saved">
                    <BsFillBookmarkStarFill />
                    <p>{t('saved.without')}</p>
                </div>
                </>
            )}
        </MainLayout>
    );
}

export default Favourites;