import { useState, useEffect } from 'react';
import { api } from '../../api/api';

import './MarkerInfoCard.css';
import Button from '../Button/Button';

import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaChartBar } from "react-icons/fa";



function MarkerInfoCard({birds}) {
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

    useEffect(() => {
        console.log('Birds: ', birds);
        console.log('Birds length: ', birds.length);
        setTotal(birds.length);

        // Petición al servidor
        api.get('/bird/wikidata', {
            params: { sciName: birds[current-1]['sciName'] }
        })
        .then(response => {
            console.log(response.data);
            setWikidata(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [current]);
    
    return(
        <div className='marker-info-container'>
            {/* <Button><FaCaretLeft /></Button> */}
            {/* <div className='marker-info-main'> */}
                <p className='source'>eBird</p>
                <Button type='icon' classAdditional='save-button'><FaRegBookmark /></Button>
                <a href={wikidata && wikidata['wikipediaURL']}>
                    <h1>{birds && birds[current-1]['comName']}</h1>
                </a>
                <p className='lat-name'>({birds[current-1]['sciName']})</p>
                <a href={wikidata && wikidata['wikipediaURL']}>
                    <img className='info-img' src={wikidata && wikidata['images'][0]} alt={birds[current-1]['comName']} />
                </a>
                <p className='info'>Avistado: <span>{formatDateTime(birds[current-1]['obsDt'])}</span></p>
                <p className='info'>Coordenadas: <span>({birds[current-1]['lat'].toFixed(3)}, {birds[current-1]['lng'].toFixed(3)})</span></p>
                <Button classAdditional='chart-button'><FaChartBar />Ver dinámica</Button>
                {total>1 && (
                    <>
                        <p className='pages'><span>{current}</span>/<span>{total}</span></p>
                        <div className='buttons'>
                            <Button func={previousPage}><FaCaretLeft /></Button>
                            <Button func={nextPage}><FaCaretRight /></Button>
                        </div>
                    </>
                )}
                
        </div>
    );
}

export default MarkerInfoCard;