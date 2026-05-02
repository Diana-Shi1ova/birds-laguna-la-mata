import './BirdCard.css';
import Button from '../Button/Button';
import ButtonFavourite from '../ButtonFavourite/ButtonFavourite';
import ButtonStatistics from '../ButtonStatistics/ButtonStatistics';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useState, useEffect } from 'react';

// Icons
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa"; // filled
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaTrashAlt } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


function BirdCard ({ type='normal', data }) {
    const { t } = useTranslation();
    const [imgLoading, setImgLoading] = useState(true);

    return (
        <>
        {/*<li className='bird-list-element'>
            <div className='bird'>
                <Link to={data.link} className='bird-image-link'>
                    <img className='bird-image' src={data.imagelink} alt={data.name} />
                </Link>
                <div className='bird-names'>
                    <Link to={data.link} className='common'>
                        {data.name}
                    </Link>
                    <p className='scientific'>({data.scientific})</p>
                </div>
            </div>
            
            <p className='obs'>Observación: <span>{data.observation}</span></p>
            <div className='buttons'>
                <Button type='icon'>
                    <FaChartBar />
                </Button>
                <Button type='icon'>
                    <FaRegBell />
                </Button>
                <Button  type='icon'>
                    {type==="normal" ? (<FaRegBookmark />) : (<FaTrashAlt />)}
                </Button>
            </div>
        </li>*/}
        <div className='bird-card'>
            <Link 
                to={data?.wikidata?.wikipediaURL}
                className='common'
                target="_blank" 
                rel="noopener noreferrer"
                title={t('catalog.link.placeholder')}
            >
                {data?.comName}
            </Link>
            <p className='scientific'>({data?.sciName})</p>
            {/* <div  className='image-wrapper'> */}
            {imgLoading && (
                <Spinner></Spinner>
            )}
                <Link
                    to={data?.wikidata?.wikipediaURL}
                    className='bird-image-link'
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={t('catalog.link.placeholder')}
                >
                    <img className='bird-image'
                        src={data?.wikidata?.images?.[data?.wikidata?.images?.length-1]}
                        key={data?.wikidata?.images?.[data?.wikidata?.images?.length-1]}
                        onLoad={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                        style={{
                            opacity: imgLoading ? 0 : 1,
                            transition: 'opacity 0.15s ease'
                        }}
                        alt={data?.comName} />
                </Link>
            {/* </div> */}
            <div className='buttons'>
                {/* <Button type='icon'>
                    <FaChartBar />
                </Button> */}
                {/* <Button type='icon'>
                    <FaRegBell />
                </Button> */}
                {/* <Button  type='icon'>
                    {type==="normal" ? (<FaRegBookmark />) : (<FaTrashAlt />)}
                </Button> */}
                <ButtonStatistics bird={data._id}></ButtonStatistics>
                <ButtonFavourite bird={data._id}></ButtonFavourite>
            </div>
        </div>
        </>
    );
};

export default BirdCard;