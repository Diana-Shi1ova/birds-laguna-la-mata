import "./StatisticsBird.css" ;
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonInfo from "../../../components/ButtonInfo/ButtonInfo";
import StatisticsCircle from "../../../components/StatisticsCircle/StatisticsCircle";
import Chart from "../../../components/Chart/Chart";
import { api } from "../../../api/api";
import ButtonFavourite from "../../../components/ButtonFavourite/ButtonFavourite";
import { useTranslation } from "react-i18next";


function StatisticsBird({park, createOption = () => ({})}){
    const { t, i18n } = useTranslation();
    const { bird } = useParams();
    const [birdData, setBirdData] = useState();
    const [data, setData] = useState([]);
    const message = t('statistics.specie.warning');
    const [today, setToday] = useState();
    const [week, setWeek] = useState();
    const [month, setMonth] = useState();


    const chartsConfig = [
        {
            title: t('statistics.specie.hourly.title'),
            key: "hourly",
            xLabel: t('statistics.specie.hourly.hour'),
            xKey: "hour",
            yLabel: t('statistics.specie.hourly.probability'),
            yKey: "freq",
        },
        {
            title: t('statistics.specie.seasonality.title'),
            key: "seasonality",
            xLabel: t('statistics.specie.seasonality.week'),
            xKey: "week",
            yLabel: t('statistics.specie.seasonality.probability'),
            yKey: "freq",
            xGroups: [
                { start: 1,  end: 5,  label: t('month.jan') },
                { start: 5,  end: 9,  label: t('month.feb') },
                { start: 9,  end: 14, label: t('month.mar') },
                { start: 14, end: 18, label: t('month.apr') },
                { start: 18, end: 23, label: t('month.may') },
                { start: 23, end: 27, label: t('month.jun') },
                { start: 27, end: 32, label: t('month.jul') },
                { start: 32, end: 36, label: t('month.aug') },
                { start: 36, end: 40, label: t('month.sep') },
                { start: 40, end: 44, label: t('month.oct') },
                { start: 44, end: 48, label: t('month.nov') },
                { start: 48, end: 53, label: t('month.dec') }
            ]
        },
        {
            title: t('statistics.specie.trend.title'),
            key: "trend",
            xLabel: t('statistics.specie.trend.year'),
            xKey: "year",
            yLabel: t('statistics.specie.trend.probability'),
            yKey: "freq",
        },
    ];

    // Obtener datos
    useEffect(() => {
        api.get(`/statistics/specie/${bird}`, {
            params: {
                parkId: park
            }
        })
        .then(response => {
            console.log(response.data);
            setData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Datos de especie
        api.get(`/bird/${bird}`, {params: { locale: i18n.resolvedLanguage }})
        .then(response => {
            console.log(response.data);
            setBirdData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });


        // Observaciones recientes
        const fetchData = async () => {
            try {
                const [todayRes, weekRes, monthRes] = await Promise.all([
                    api.get(`/eBird/${bird}`, {
                        params: { parkId: park, back: 1 }
                    }),
                    api.get(`/eBird/${bird}`, {
                        params: { parkId: park, back: 7 }
                    }),
                    api.get(`/eBird/${bird}`, {
                        params: { parkId: park, back: 30 }
                    })
                ]);

                const todayTotal = sumHowMany(todayRes.data);
                const weekTotal = sumHowMany(weekRes.data);
                const monthTotal = sumHowMany(monthRes.data);

                setToday(todayTotal);
                setWeek(weekTotal);
                setMonth(monthTotal);
                console.log(todayTotal)

            } catch (error) {
                console.error('Error:', error);
            }
        };
        
        console.log(bird);
        console.log(park);
        if (bird && park) {
            fetchData();
        }
    }, [park, bird, i18n.resolvedLanguage]);


    // Sumar avistamientos
    const sumHowMany = (arr) => (arr ?? []).reduce((sum, item) => {
        return sum + (Number(item?.howMany) || 0);
    }, 0);

    
    // Fiabilidad
    function getConfidence(f) {
        switch(f){
            case "none":
                return t('statistics.specie.quantity.summary.confidence.options.none');
                break;
            case "low":
                return t('statistics.specie.quantity.summary.confidence.options.low');
                break;
            case "medium":
                return t('statistics.specie.quantity.summary.confidence.options.medium');
                break;
            case "high":
                return t('statistics.specie.quantity.summary.confidence.options.high');
                break;
            case "very_high":
                return t('statistics.specie.quantity.summary.confidence.options.vey_high');
                break;
        }
    }


    // Tendencia
    function getTrend(trend) {
        switch (trend) {
            case "stable":
            return t('statistics.specie.quantity.summary.trend.options.stable');

            case "increasing":
            return t('statistics.specie.quantity.summary.trend.options.increasing');

            case "decreasing":
            return t('statistics.specie.quantity.summary.trend.options.decreasing');

            default:
            return t('statistics.specie.quantity.summary.trend.options.unknown');
        }
    }


    // Estacionalidad
    function interpretSeasonality(seasonality) {
        if (!seasonality || seasonality.peakWeek === null) {
            return t('statistics.specie.quantity.summary.seasonality.option.without');
        }

        const { peakWeek, strength } = seasonality;

        let intensity = "";

        if (strength < 1.5) intensity = t('statistics.specie.quantity.summary.seasonality.option.weak');
        else if (strength < 2.5) intensity = t('statistics.specie.quantity.summary.seasonality.option.moderate');
        else intensity = t('statistics.specie.quantity.summary.seasonality.option.strong');

        return t('statistics.specie.quantity.summary.seasonality.peak')+` ${peakWeek}. `+t('statistics.specie.quantity.summary.seasonality.seasonality') + ` ${intensity}.`;
    }


    // Actividad diaria
    function interpretHourly(hourly) {
        if (!hourly || hourly.peakHour === null) {
            return t('statistics.specie.quantity.summary.hourly.without');
        }

        const { peakHour, morningBias } = hourly;

        let period = "";

        if (morningBias === null) {
            period = "";
        } else if (morningBias) {
            period = ' '+t('statistics.specie.quantity.summary.hourly.activity.morning');
        } else {
            period = ' '+t('statistics.specie.quantity.summary.hourly.activity.evening');
        }

        return t('statistics.specie.quantity.summary.hourly.activity.hour')+` ${peakHour}:00.${period}`;
    }



    return(
        <>
            <h1 className="birdName">{birdData?.comName ?? ''}
                <span>({birdData?.sciName ?? ''})</span>
                <ButtonFavourite bird={birdData?._id}></ButtonFavourite>
                <ButtonInfo message={message} title={t('button.info')}></ButtonInfo>
            </h1>
            <div className="statistics-container">
                <div className="horizontal">
                    <div className="image-container">
                        {/* {(birdData && birdData!==undefined) &&
                        <img src={birdData?.wikidata?.images[birdData?.wikidata?.images?.length-1]} alt={birdData?.comName} />
                        } */}
                        {birdData?.wikidata?.images?.length > 0 && (
                            <img
                                src={birdData.wikidata.images.at(-1)}
                                alt={birdData.comName}
                            />
                        )}
                        <p>{t('statistics.specie.probability')} <span>{(data?.[0]?.overall?.probability * 100).toFixed(2) ?? ''}%</span></p>
                    </div>
                        <section className="today-statistics">
                            <h2>{t('statistics.specie.quantity.title')}</h2>
                            <div className="circles">
                                <StatisticsCircle label={t('statistics.specie.quantity.today')} value={today}></StatisticsCircle>
                                <StatisticsCircle label={t('statistics.specie.quantity.week')} value={week}></StatisticsCircle>
                                <StatisticsCircle label={t('statistics.specie.quantity.month')} value={month}></StatisticsCircle>
                            </div>
                            <h3>{t('statistics.specie.quantity.summary.title')}</h3>
                            <ul>
                                <li><span>{data?.[0]?.overall?.detections}</span> {t('statistics.specie.quantity.summary.observed')} <span>{data?.[0]?.overall?.totalChecklists}</span> {t('statistics.specie.quantity.summary.checklists')}</li>
                                <li>{t('statistics.specie.quantity.summary.confidence.title')} <span>{getConfidence(data?.[0]?.overall?.confidence)}</span> <span>({(data?.[0]?.overall?.confidenceScore * 100)}%)</span></li>
                                {data?.[0]?.insights?.hasData && (
                                    <>
                                    <li>{t('statistics.specie.quantity.summary.trend.options.title')} <span>{getTrend(data?.[0]?.insights?.trend?.direction)}</span></li>
                                    <li>{t('statistics.specie.quantity.summary.hourly.options.title')} <span>{interpretHourly(data?.[0]?.insights?.hourly)}</span></li>
                                    <li>{t('statistics.specie.quantity.summary.seasonality.options.title')} <span>{interpretSeasonality(data?.[0]?.insights?.seasonality)}</span></li>
                                    </>
                                )}
                            </ul>
                        </section>
                </div>
                {chartsConfig.map((chart) => (
                    <Chart
                        key={chart.key}
                        title={chart.title}
                        options={createOption(
                            data?.[0]?.[chart.key],
                            chart.xKey,
                            chart.xLabel,
                            chart.yKey,
                            chart.yLabel,
                            chart.xGroups
                        )}
                    />
                ))}
            </div>
        </>
    );
}

export default StatisticsBird;