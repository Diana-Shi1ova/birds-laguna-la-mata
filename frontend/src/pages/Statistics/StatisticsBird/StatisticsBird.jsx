import "./StatisticsBird.css" ;
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonInfo from "../../../components/ButtonInfo/ButtonInfo";
import StatisticsCircle from "../../../components/StatisticsCircle/StatisticsCircle";
import Chart from "../../../components/Chart/Chart";
import { api } from "../../../api/api";
import ButtonFavourite from "../../../components/ButtonFavourite/ButtonFavourite";


function StatisticsBird({park, createOption = () => ({})}){
    const { bird } = useParams();
    const [birdData, setBirdData] = useState();
    const [data, setData] = useState([]);
    const message = "Los datos utilizados para el análisis provienen de la ciencia ciudadana (fuente: eBird). Reflejan únicamente lo que los observadores incluyendo no profesionales han logrado registrar y pueden diferir en cierto grado de la realidad.";
    const [today, setToday] = useState();
    const [week, setWeek] = useState();
    const [month, setMonth] = useState();


    const chartsConfig = [
        {
            title: "Actividad diaria",
            key: "hourly",
            xLabel: "Hora del día",
            xKey: "hour",
            yLabel: "Probabilidad",
            yKey: "freq",
        },
        {
            title: "Estacionalidad",
            key: "seasonality",
            xLabel: "Semana del año",
            xKey: "week",
            yLabel: "Probabilidad",
            yKey: "freq",
        },
        {
            title: "Tendencia (últimos 5 años)",
            key: "trend",
            xLabel: "Año",
            xKey: "year",
            yLabel: "Probabilidad",
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
        api.get(`/bird/${bird}`)
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
    }, [park, bird]);


    // Sumar avistamientos
    const sumHowMany = (arr) => (arr ?? []).reduce((sum, item) => {
        return sum + (Number(item?.howMany) || 0);
    }, 0);

    
    // Fiabilidad
    function getConfidence(f) {
        switch(f){
            case "none":
                return 'ninguna'
                break;
            case "low":
                return 'baja'
                break;
            case "medium":
                return 'media'
                break;
            case "high":
                return 'alta'
                break;
            case "very_high":
                return 'muy alta'
                break;
        }
    }


    // Tendencia
    function getTrend(t) {
        switch (t) {
            case "stable":
            return "estable";

            case "increasing":
            return "en aumento";

            case "decreasing":
            return "en descenso";

            default:
            return "desconocida";
        }
    }


    // Estacionalidad
    function interpretSeasonality(seasonality) {
        if (!seasonality || seasonality.peakWeek === null) {
            return "No se observa una estacionalidad clara.";
        }

        const { peakWeek, strength } = seasonality;

        let intensity = "";

        if (strength < 1.5) intensity = "débil";
        else if (strength < 2.5) intensity = "moderada";
        else intensity = "marcada";

        return `Pico en la semana ${peakWeek}. Estacionalidad ${intensity}.`;
    }


    // Actividad diaria
    function interpretHourly(hourly) {
        if (!hourly || hourly.peakHour === null) {
            return "No hay un patrón horario definido.";
        }

        const { peakHour, morningBias } = hourly;

        let period = "";

        if (morningBias === null) {
            period = "";
        } else if (morningBias) {
            period = " Mayor actividad por la mañana.";
        } else {
            period = " Mayor actividad por la tarde.";
        }

        return `Mayor actividad alrededor de las ${peakHour}:00.${period}`;
    }



    return(
        <>
            <h1 className="birdName">{birdData?.comName ?? ''}
                <span>({birdData?.sciName ?? ''})</span>
                <ButtonFavourite bird={birdData?._id}></ButtonFavourite>
                <ButtonInfo message={message}></ButtonInfo>
            </h1>
            <div className="statistics-container">
                <div className="horizontal">
                    <div className="image-container">
                        {birdData &&
                        <img src={birdData?.wikidata?.images[birdData?.wikidata?.images.length-1]} alt={birdData.comName} />
                        }
                        <p>Probabilidad de avistar: <span>{(data?.[0]?.overall?.probability * 100).toFixed(2) ?? ''}%</span></p>
                    </div>
                        <section className="today-statistics">
                            <h2>Cantidad registrada</h2>
                            <div className="circles">
                                <StatisticsCircle label='Hoy' value={today}></StatisticsCircle>
                                <StatisticsCircle label='Semana' value={week}></StatisticsCircle>
                                <StatisticsCircle label='Mes' value={month}></StatisticsCircle>
                            </div>
                            <h3>Resumen:</h3>
                            <ul>
                                <li><span>{data?.[0]?.overall?.detections}</span> observaciones en <span>{data?.[0]?.overall?.totalChecklists}</span> checklists</li>
                                <li>Fiabilidad del análisis: <span>{getConfidence(data?.[0]?.overall?.confidence)}</span> <span>({(data?.[0]?.overall?.confidenceScore * 100)}%)</span></li>
                                {data?.[0]?.insights?.hasData && (
                                    <>
                                    <li>Tendencia: <span>{getTrend(data?.[0]?.insights?.trend?.direction)}</span></li>
                                    <li>Actividad diaria: <span>{interpretHourly(data?.[0]?.insights?.hourly)}</span></li>
                                    <li>Estacionalidad: <span>{interpretSeasonality(data?.[0]?.insights?.seasonality)}</span></li>
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
                            chart.yLabel
                        )}
                    />
                ))}
            </div>
        </>
    );
}

export default StatisticsBird;