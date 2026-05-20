import './ButtonFavourite.css';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';
import { api } from "../../api/api";
import { UseAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router-dom';

// Icons
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa"; // filled
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaTrashAlt } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { useBirds } from '../../contexts/BirdsProvider';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


function ButtonFavourite ({ bird }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {user} = UseAuth();
    const {favourites, setFavourites} = useBirds();
    const [saved, setSaved] = useState(favourites.has(bird));

    useEffect(() => {
        setSaved(favourites.has(bird));
    }, [favourites, bird]);

    function save(){
        console.log(favourites.has(bird))
        if(!user){
            navigate('/login');
            return
        }

        if(!saved){
            // Guardar
            api.post("/favourite", {
                userId: user._id,
                specieId: bird
            })
                .then(response => {
                    console.log(response.data);
                    if(response.data){
                        setSaved(true);
                        setFavourites(prev => {
                            const newMap = new Map(prev);
                            newMap.set(bird, response.data._id);
                            return newMap;
                        });
                    }
                })
                .catch(error => {
                    console.error("Error creating favourite:", error);
                    throw error;
                });
        }
        else{
            // Eliminar
            const favouriteId = favourites.get(bird);

            api.delete(`/favourite/${favouriteId}`)
                .then(response => {
                    console.log(response.data);
                    if(response.data.favourite){
                        setSaved(false);
                        setFavourites(prev => {
                            const newMap = new Map(prev);
                            newMap.delete(bird);
                            return newMap;
                        });
                    }
                })
                .catch(error => {
                    console.error("Error creating favourite:", error);
                    throw error;
                });
        }
        
    }

    return (
        <>
            <Button type='icon' classAdditional={saved ? 'favorite-button saved' : 'favorite-button'} func={save} tooltip={saved ? t('button.unsave') : t('button.save')}>
                {saved ? <FaBookmark /> : <FaRegBookmark />}
            </Button>
        </>
    );
};

export default ButtonFavourite;