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



function MarkerInfoCard({birds, source='eBird', lat, long, popup}) {  //tipo: eBird, RPA, RPI
    /*const birds = [
        {
            comName: 'Gavión atlántico',
            sciName: 'Larus Marinus',
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Great_Black-backed_Gull_Larus_marinus.jpg/1280px-Great_Black-backed_Gull_Larus_marinus.jpg',
            obsDt: '2026-02-11 20:53',
            lat: 38.022,
            lng: -0.732
        },
        {
            comName: 'Bird 2',
            sciName: 'Larus Marinus',
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Great_Black-backed_Gull_Larus_marinus.jpg/1280px-Great_Black-backed_Gull_Larus_marinus.jpg',
            obsDt: '2026-02-11 15:47',
            lat: 38.0221,
            lng: -0.7327
        },
    ]*/

    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);
    const [wikidata, setWikidata] = useState();
    const [imgLoading, setImgLoading] = useState(true);
    // const [showBig, setShowBig] = useState(false);

    const nextPage = () => {
        if(current<total) setCurrent(current+1);
    }

    const previousPage = () => {
        if(current>1) setCurrent(current-1);
    }

    function formatDateTime(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [year, month, day] = datePart.split('-');

        return `${day}/${month}/${year} ${timePart}`;
    }

    const formatDateTimeRasp = (isoString) => {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours(); // как у тебя — без 0 спереди
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 👈 добавили

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const formatFromFilename = (filename) => {
        // 2025-02-21_12-38-26.jpg
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
        // console.log('Birds: ', birds);
        // console.log('Birds length: ', birds.length);
        setImgLoading(true);
        setTotal(birds.length);
        console.log(birds)

        if(source==='eBird'){
            // Petición al servidor
            api.get('/bird/wikidata', {
                params: { sciName: birds[current-1]['sciName'] }
            })
            .then(response => {
                // console.log(response.data);
                setWikidata(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [current]);


    if(source==='eBird'){
        return(
            <div className={'marker-info-container'}>
                {/* <Button><FaCaretLeft /></Button> */}
                {/* <div className='marker-info-main'> */}
                    <p className={'source '+source}>{source}</p>
                    {/* <Button type='icon' classAdditional='save-button'><FaRegBookmark /></Button> */}
                    <Button type='icon' classAdditional='close-button' tooltip='Cerrar' func={closePopup}><FaTimes /></Button>
                    <a href={wikidata && wikidata['wikipediaURL']}>
                        <h1>{birds && birds[current-1]['comName']}</h1>
                    </a>
                    <p className='lat-name'>({birds[current-1]['sciName']})</p>
                    <div  className='image-wrapper'>
                        {imgLoading && (
                            <Spinner></Spinner>
                        )}
                        <a href={wikidata && wikidata['wikipediaURL']}>
                            <img
                                className='info-img'
                                key={wikidata?.images?.[0]}
                                src={wikidata && wikidata['images'][0]}
                                alt={birds[current-1]['comName']}
                                onLoad={() => setImgLoading(false)}
                                onError={() => setImgLoading(false)}
                                style={{
                                    opacity: imgLoading ? 0 : 1,
                                    transition: 'opacity 0.15s ease'
                                }}
                            />
                        </a>
                    </div>
                    <p className='info'>Avistado: <span>{formatDateTime(birds[current-1]['obsDt'])}</span></p>
                    <p className='info'>Cantidad: <span>{birds[current-1]['howMany']}</span></p>
                    <p className='info'>Coordenadas: <span>({birds[current-1]['lat'].toFixed(3)}, {birds[current-1]['lng'].toFixed(3)})</span></p>
                    <div className='actions'>
                        <Button classAdditional='chart-button'><FaChartBar />Ver dinámica</Button>
                        <Button type='icon' classAdditional='save-button' tooltip='Guardar especie'><FaRegBookmark /></Button>
                    </div>

                    {total>1 && (
                        <>
                            <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                            <div className='buttons'>
                                <Button func={previousPage} tooltip='Anterior'><FaCaretLeft /></Button>
                                <Button func={nextPage} tooltip='Siguiente'><FaCaretRight /></Button>
                            </div>
                        </>
                    )}

            </div>
        );
    }
    else if(source==='audio'){
        return(
            <div className={'marker-info-container'}>
                {/* <Button><FaCaretLeft /></Button> */}
                {/* <div className='marker-info-main'> */}
                    <p className={'source RPA'}>RPA</p>
                    {/* <Button type='icon' classAdditional='save-button'><FaRegBookmark /></Button> */}
                    {/* <a href={wikidata && wikidata['wikipediaURL']}> */}
                        {/* <h1>{birds && birds[current-1]['name_eng']}</h1> */}
                        <Button type='icon' classAdditional='close-button' tooltip='Cerrar' func={closePopup}><FaTimes /></Button>
                        {birds.length>0 ? (
                            <>
                            <h1>{birds?.[current - 1]?.name_eng}</h1>
                            {/* <audio src='https://www.dropbox.com/scl/fi/glmr0fehfrtxcupqh17c1/Eurasian_Coot-71-2024-09-24-birdnet-09_50_11.mp3?rlkey=qpf1uphf2fbhuv8u2treapme7&st=wpnkbg86&dl=1' controls></audio> */}
                            <audio
                                key={birds?.[current - 1]?.path}
                                controls
                                src={
                                    birds?.[current - 1]?.path
                                        ? import.meta.env.VITE_RASPBERRIES_AUDIO_PATH + birds[current - 1].path.replace(/:/g, '_')
                                        : ''
                                    }
                            ></audio>

                            <p className='info'>Avistado: <span>{formatDateTimeRasp(birds[current-1]['timestamp'])}</span></p>
                            <p className='info info-margin-bottom'>Coordenadas: <span>({lat.toFixed(3)}, {long.toFixed(3)})</span></p>
                            </>
                        ) : (
                            <div className='without-detections'>
                                <h1>Raspberry Pi (audio)</h1>
                                    <FaSignal />
                                <p>No hay especies detectadas</p>
                            </div>
                        )}


                        {/* <audio src={birds?.[current - 1]?.path} controls></audio> */}

                        {/* <iframe width="711" height="144" frameBorder="0" src="https://mega.nz/embed/CwxSjKZC#OZlCqU3o0gC2G9QBGhF1ughYvby1FipeyYie3zyhTEc!1v1c" allowFullScreen ></iframe> */}



                    {/* </a> */}
                    {/* <p className='lat-name'>({birds[current-1]['sciName']})</p>
                    <a href={wikidata && wikidata['wikipediaURL']}>
                        <img className='info-img' src={wikidata && wikidata['images'][0]} alt={birds[current-1]['comName']} />
                    </a>
                    <p className='info'>Avistado: <span>{formatDateTime(birds[current-1]['obsDt'])}</span></p>
                    <p className='info'>Cantidad: <span>{birds[current-1]['howMany']}</span></p>
                    <p className='info'>Coordenadas: <span>({birds[current-1]['lat'].toFixed(3)}, {birds[current-1]['lng'].toFixed(3)})</span></p>
                    <Button classAdditional='chart-button'><FaChartBar />Ver dinámica</Button> */}
                    {total>1 && (
                        <>
                            <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                            <div className='buttons audio'>
                                <Button func={previousPage} tooltip='Anterior'><FaCaretLeft /></Button>
                                <Button func={nextPage} tooltip='Siguiente'><FaCaretRight /></Button>
                            </div>
                        </>
                    )}

            </div>
        );
    }
    else if(source==='image'){
        return(
            <div className={'marker-info-container'}>
                {/* <Button><FaCaretLeft /></Button> */}
                {/* <div className='marker-info-main'> */}
                    <p className={'source RPI'}>RPI</p>
                    {/* <Button type='icon' classAdditional='save-button'><FaRegBookmark /></Button>
                    <a href={wikidata && wikidata['wikipediaURL']}> */}
                    <Button type='icon' classAdditional='close-button' tooltip='Cerrar' func={closePopup}><FaTimes /></Button>
                    {birds.length>0 ? (
                            <>
                            <h1>
                                {birds?.[current - 1]?.species_detected !== 'x'
                                    ? birds?.[current - 1]?.species_detected
                                    : 'Especie desconocida'}
                            </h1>
                            {/* <img className='info-img' src="https://raw.githubusercontent.com/Diana-Shi1ova/Avistory-audio-storage/refs/heads/main/frame_2025-02-21_12-38-26.jpg?token=GHSAT0AAAAAAD2VHW65QSB5Y6EYZO5EWTQW2PC25UQ" alt="" /> */}
                            <img src={import.meta.env.VITE_RASPBERRIES_IMAGES_PATH+'frame_'+birds?.[current - 1]?.image_name} className='info-img rpi' alt={
                                    birds?.[current - 1]?.species_detected !== 'x'
                                        ? birds?.[current - 1]?.species_detected
                                        : 'Especie desconocida'} />

                            <p className='info'>Avistado: <span>{formatFromFilename(birds[current-1]['image_name'])}</span></p>
                            <p className='info'>Coordenadas: <span>({lat.toFixed(3)}, {long.toFixed(3)})</span></p>
                            {/* <Button classAdditional='chart-button' func={() => {setShowBig(!showBig)}}>Abrir imagen</Button> */}
                            <Dialog buttonTitle='Abrir imagen' buttonClass='chart-button'>
                                {/* <div className='big-image-wrapper'></div> */}
                                <img src={import.meta.env.VITE_RASPBERRIES_IMAGES_PATH+'frame_'+birds?.[current - 1]?.image_name} className='big-image' alt={
                                    birds?.[current - 1]?.species_detected !== 'x'
                                        ? birds?.[current - 1]?.species_detected
                                        : 'Especie desconocida'} />
                            </Dialog>
                            </>
                        ) : (
                            <div className='without-detections'>
                                <h1>Raspberry Pi (imagen)</h1>
                                    <FaSignal />
                                <p>No hay especies detectadas</p>
                            </div>
                        )}

                    {/* </a> */}
                    {/* <p className='lat-name'>({birds[current-1]['sciName']})</p>
                    <a href={wikidata && wikidata['wikipediaURL']}>
                        <img className='info-img' src={wikidata && wikidata['images'][0]} alt={birds[current-1]['comName']} />
                    </a>
                    <p className='info'>Avistado: <span>{formatDateTime(birds[current-1]['obsDt'])}</span></p>
                    <p className='info'>Cantidad: <span>{birds[current-1]['howMany']}</span></p>
                    <p className='info'>Coordenadas: <span>({birds[current-1]['lat'].toFixed(3)}, {birds[current-1]['lng'].toFixed(3)})</span></p>
                    <Button classAdditional='chart-button'><FaChartBar />Ver dinámica</Button> */}
                    {total>1 && (
                        <>
                            <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                            <div className='buttons'>
                                <Button func={previousPage} tooltip='Anterior'><FaCaretLeft /></Button>
                                <Button func={nextPage} tooltip='Siguiente'><FaCaretRight /></Button>
                            </div>
                        </>
                    )}

            </div>
        );
    }
}

export default MarkerInfoCard;