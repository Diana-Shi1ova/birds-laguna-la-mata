import { useState, useEffect } from 'react';
import { api } from '../../api/api';

import './MarkerInfoCard.css';
import Button from '../Button/Button';

import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaChartBar } from "react-icons/fa";
import { FaSignal } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import Spinner from '../Spinner/Spinner';
import Dialog from '../Dialog/Dialog';
import ButtonStatistics from '../ButtonStatistics/ButtonStatistics';
import ButtonFavourite from '../ButtonFavourite/ButtonFavourite';
import { Link } from "react-router-dom";
import { useBirds } from '../../contexts/BirdsProvider';
import { useTranslation } from "react-i18next";


function MarkerInfoCard({birds, source='eBird', lat, long, popup}) {  //tipo: eBird, RPA, RPI
    const { t, i18n } = useTranslation();
    const {parkData} = useBirds();
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);
    const [wikidata, setWikidata] = useState();
    const [imgLoading, setImgLoading] = useState(true);

    const nextPage = () => {
        if(current<total) setCurrent(current+1);
    }

    const previousPage = () => {
        if(current>1) setCurrent(current-1);
    }

    function formatDateTime(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [year, month, day] = datePart.split('-');

        if(timePart) return `${day}/${month}/${year} ${timePart}`;
        else return `${day}/${month}/${year}`;
    }

    const formatDateTimeRasp = (isoString) => {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const formatFromFilename = (filename) => {
        const [datePart, timePart] = filename.split('_');

        const [year, month, day] = datePart.split('-');
        const [hours, minutes, secondsWithExt] = timePart.split('-');

        const seconds = secondsWithExt.split('.')[0]; // eliminar .jpg

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const closePopup = () => {
        popup?.remove();
    };

    useEffect(() => {
        setImgLoading(true);
        setTotal(birds.length);

        if(source==='eBird'){
            // Petición al servidor
            api.get('/bird/wikidata', {
                params: { sciName: birds[current-1]['sciName'], locale: i18n.resolvedLanguage }
            })
            .then(response => {
                setWikidata(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [current, i18n.resolvedLanguage]);


    if(source==='eBird'){
        return(
            <div className={'marker-info-container'}>
                    <p className={'source '+source}>{source}</p>
                    <Button type='icon' classAdditional='close-button' tooltip={t('map.observation.button.close')} func={closePopup}><FaTimes /></Button>
                    <Link 
                        to={wikidata && wikidata['wikipediaURL']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title={t('map.observation.link.placeholder')}
                    >
                        <h1>{birds && birds[current-1]['comName']}</h1>
                    </Link>
                    <p className='lat-name'>({birds[current-1]['sciName']})</p>
                    <div  className='image-wrapper'>
                        {imgLoading && (
                            <Spinner></Spinner>
                        )}
                        <Link 
                            to={wikidata && wikidata['wikipediaURL']} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={t('map.observation.link.placeholder')}
                        >
                            <img
                                className='info-img'
                                key={wikidata?.images?.length-1}
                                src={wikidata?.images?.[wikidata?.images?.length-1]}
                                alt={birds[current-1]['comName']}
                                onLoad={() => setImgLoading(false)}
                                onError={() => setImgLoading(false)}
                                style={{
                                    opacity: imgLoading ? 0 : 1,
                                    transition: 'opacity 0.15s ease'
                                }}
                            />
                        </Link>
                    </div>
                    <p className='info'>{t('map.observation.observed')} <span>{formatDateTime(birds[current-1]['obsDt'])}</span></p>
                    <p className='info'>{t('map.observation.quantity')} <span>{birds[current-1]['howMany'] ? birds[current-1]['howMany'] : t('map.quantity.unknown')}</span></p>
                    <p className='info'>{t('map.observation.coords')} <span>({birds[current-1]['lat'].toFixed(3)}, {birds[current-1]['lng'].toFixed(3)})</span></p>
                    <div className='actions'>
                        <ButtonStatistics bird={wikidata?.id} park={parkData.parkId}></ButtonStatistics>
                        <ButtonFavourite bird={wikidata?.id}></ButtonFavourite>
                    </div>

                    {total>1 && (
                        <>
                            <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                            <div className='buttons'>
                                <Button func={previousPage} tooltip={t('map.observation.button.previous')} disabled={(current-1<1) ? true : false}><FaCaretLeft /></Button>
                                <Button func={nextPage} tooltip={t('map.observation.button.next')}  disabled={(current+1>total) ? true : false}><FaCaretRight /></Button>
                            </div>
                        </>
                    )}

            </div>
        );
    }
    else if(source==='audio'){
        return(
            <div className={'marker-info-container'}>
                    <p className={'source RPA'}>RPA</p>
                        <Button type='icon' classAdditional='close-button' tooltip={t('map.observation.button.close')} func={closePopup}><FaTimes /></Button>
                        {birds.length>0 ? (
                            <>
                            <h1>{birds?.[current - 1]?.name_eng}</h1>
                            <audio
                                key={birds?.[current - 1]?.path}
                                controls
                                src={
                                    birds?.[current - 1]?.path
                                        ? import.meta.env.VITE_RASPBERRIES_AUDIO_PATH + birds[current - 1].path.replace(/:/g, '_')
                                        : ''
                                    }
                            ></audio>

                            <p className='info'>{t('map.observation.observed')} <span>{formatDateTimeRasp(birds[current-1]['timestamp'])}</span></p>
                            <p className='info info-margin-bottom'>{t('map.observation.coords')} <span>({lat.toFixed(3)}, {long.toFixed(3)})</span></p>
                            </>
                        ) : (
                            <div className='without-detections'>
                                <h1>{t('map.observation.raspberry.title.audio')}</h1>
                                    <FaSignal />
                                <p>{t('map.observation.raspberry.message')}</p>
                            </div>
                        )}

                    {total>1 && (
                        <>
                            <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                            <div className='buttons audio'>
                                <Button func={previousPage} tooltip={t('map.observation.button.previous')} disabled={(current-1<1) ? true : false}><FaCaretLeft /></Button>
                                <Button func={nextPage} tooltip={t('map.observation.button.next')}  disabled={(current+1>total) ? true : false}><FaCaretRight /></Button>
                            </div>
                        </>
                    )}

            </div>
        );
    }
    else if(source==='image'){
        return(
            <div className={'marker-info-container'}>
                    <p className={'source RPI'}>RPI</p>
                    <Button type='icon' classAdditional='close-button' tooltip={t('map.observation.button.close')} func={closePopup}><FaTimes /></Button>
                    {birds.length>0 ? (
                            <>
                            <h1>
                                {birds?.[current - 1]?.species_detected !== 'x'
                                    ? birds?.[current - 1]?.species_detected
                                    : t('map.observation.raspberry.unknown')}
                            </h1>
                            <img src={import.meta.env.VITE_RASPBERRIES_IMAGES_PATH+'frame_'+birds?.[current - 1]?.image_name} className='info-img rpi' alt={
                                    birds?.[current - 1]?.species_detected !== 'x'
                                        ? birds?.[current - 1]?.species_detected
                                        : t('map.observation.raspberry.unknown')} />

                            <p className='info'>{t('map.observation.observed')} <span>{formatFromFilename(birds[current-1]['image_name'])}</span></p>
                            <p className='info'>{t('map.observation.coords')} <span>({lat.toFixed(3)}, {long.toFixed(3)})</span></p>
                            <Dialog buttonTitle={t('map.observation.raspberry.open_image')} buttonClass='chart-button'>
                                <img src={import.meta.env.VITE_RASPBERRIES_IMAGES_PATH+'frame_'+birds?.[current - 1]?.image_name} className='big-image' alt={
                                    birds?.[current - 1]?.species_detected !== 'x'
                                        ? birds?.[current - 1]?.species_detected
                                        : t('map.observation.raspberry.unknown')} />
                            </Dialog>
                            </>
                        ) : (
                            <div className='without-detections'>
                                <h1>{t('map.observation.raspberry.title.image')}</h1>
                                    <FaSignal />
                                <p>{t('map.observation.raspberry.message')}</p>
                            </div>
                        )}
                    {total>1 && (
                        <>
                            <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                            <div className='buttons'>
                                <Button func={previousPage} tooltip={t('map.observation.button.previous')} disabled={(current-1<1) ? true : false}><FaCaretLeft /></Button>
                                <Button func={nextPage} tooltip={t('map.observation.button.next')}  disabled={(current+1>total) ? true : false}><FaCaretRight /></Button>
                            </div>
                        </>
                    )}

            </div>
        );
    }
}

export default MarkerInfoCard;