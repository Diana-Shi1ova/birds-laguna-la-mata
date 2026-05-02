import "./StatisticsPark.css" ;
import { useState, useEffect } from "react";
import ButtonInfo from "../../../components/ButtonInfo/ButtonInfo";
import StatisticsCircle from "../../../components/StatisticsCircle/StatisticsCircle";
import Chart from "../../../components/Chart/Chart";
import { api } from "../../../api/api";
import BirdCarousel from "../../../components/BirdCarousel/BirdCarousel";
import { useTranslation } from "react-i18next";

function StatisticsPark({park, createOption = () => ({})}){
    const { t, i18n } = useTranslation();
    const message = t('statistics.park.warning');
    const [parkData, setParkData] = useState();
    const [data, setData] = useState([]);

    // Obtener datos
    useEffect(() => {
        // Datos del parque
        api.get(`/park/${park}`)
        .then(response => {
            console.log(park);
            console.log(response.data);
            setParkData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Estadística del parque
        api.get(`/statistics/park/${park}`,
            {
                params: { locale: i18n.resolvedLanguage }
            }
        )
        .then(response => {
            console.log(response.data);
            setData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    }, [park, i18n.resolvedLanguage]);


    // Tendencia
    function getTrend(trend) {
        switch (trend) {
            case "stable":
            return t('statistics.park.summary.trend.option.stable');

            case "increasing":
            return t('statistics.park.summary.trend.option.increasing');

            case "decreasing":
            return t('statistics.park.summary.trend.option.decreasing');

            default:
            return t('statistics.park.summary.trend.option.unknown');
        }
    }

    
    return(
        <>
            <h1 className="birdName">{parkData?.name}<ButtonInfo message={message}></ButtonInfo></h1>
            <div className="statistics-container">
                <div className="horizontal horizontal-2">
                    <img src={import.meta.env.VITE_PARKS_PATH+parkData?.image} alt={parkData?.name} />
                    <section className="park-summary">
                            <h2>{t('statistics.park.summary.title')}</h2>
                            <div className="circles">
                                <StatisticsCircle label={t('statistics.park.summary.circle.species')} value={data?.totalSpecies}></StatisticsCircle>
                                <StatisticsCircle label={t('statistics.park.summary.circle.checklists')} value={data?.totalChecklists}></StatisticsCircle>
                            </div>
                            <p className="explaining">{t('statistics.park.summary.trend.title')} <span>{getTrend(data?.trend?.direction)}</span> ({t('statistics.park.summary.trend.confidence')} <span>{(data?.trend?.confidence*100).toFixed(2)}%</span>)</p>
                    </section>
                </div>
                <div className="top-species">
                    <h2>{t('statistics.park.top.title')}</h2>
                    <BirdCarousel birds={data?.top10}></BirdCarousel>
                </div>
                <div>
                    <Chart
                        title={t('statistics.park.biodiversity.title')}
                        options={createOption(
                            data?.yearlySpecies,
                            'year',
                            t('statistics.park.biodiversity.year'),
                            'speciesCount',
                            t('statistics.park.biodiversity.species')
                        )}
                    />
                </div>
            </div>
        </>
    );
}

export default StatisticsPark;