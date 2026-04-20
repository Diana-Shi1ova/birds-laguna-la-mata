import "./Statistics.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useLocation } from "react-router-dom";
import { api } from "../../api/api";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import Chart from "../../components/Chart/Chart";
import InputSelect from "../../components/InputSelect/InputSelect";
import Tabs from "../../components/Tabs/Tabs";
import StatisticsCircle from "../../components/StatisticsCircle/StatisticsCircle";
import InfoButton from "../../components/InfoButton/InfoButton";

function Statistics(){
    const [data, setData] = useState([]);
    const [park, setPark] = useState(location.state || '69e16d8d48ce5b0d0d8f9b23');
    const [parkData, setParkData] = useState();
    const [parkList, setParkList] = useState([]);
    const [bird, setBird] = useState(location.state || '6987948a2e98ed23fd2c37c0');
    const [birdData, setBirdData] = useState();
    // const [bySpecie, setBySpecie] = useState(true);
    const [today, setToday] = useState();
    const [week, setWeek] = useState();
    const [month, setMonth] = useState();
    const [activeTab, setActiveTab] = useState('general');

    const message = "Los datos utilizados para el análisis provienen de la ciencia ciudadana (fuente: eBird). Reflejan únicamente lo que los observadores incluyendo no profesionales han logrado registrar y pueden diferir en cierto grado de la realidad.";

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

    useEffect(() => {
        // Obetner parques
        api.get(`/park`)
            .then(response => {
                console.log(response.data);
                const result = response.data.map(item => ({
                    value: item._id,
                    label: item.name
                }));
                setParkList(result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    // Sumar avistamientos
    const sumHowMany = (arr) => (arr ?? []).reduce((sum, item) => {
        return sum + (Number(item?.howMany) || 0);
    }, 0);


    // Obtener datos
    useEffect(() => {
        // Obetner parques
        if(activeTab==='species'){
            // Estadística de especie
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

                } catch (error) {
                    console.error('Error:', error);
                }
            };

            if (bird && park) {
                fetchData();
            }
        }
        else{
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
            api.get(`/statistics/park/${park}`)
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [park, activeTab, bird]);


    const createOption = (arr, xKey, xLabel, yKey, yLabel) => ({
        tooltip: { trigger: "axis" },

        xAxis: {
            type: "category",
            data: arr?.map(d => d[xKey]) || [],
            name: xLabel,
            nameLocation: "middle",
            nameGap: 30,
            nameTextStyle: {
            color: "#000",
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "Arial",
            },
        },

        yAxis: {
            type: "value",
            name: yLabel,
            nameLocation: "middle",
            nameGap: 30,
            nameTextStyle: {
            color: "#000",
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "Arial",
            },
        },

        series: [
            {
            data: arr?.map(d => d[yKey]) || [],
            type: "line",
            smooth: true,
            },
        ],
    });

    const onSelectChange = (e) => {
        console.log(e.target.value);
        setPark(e.target.value);
    }

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
        <MainLayout>
            <div className="chartpage-header">
                <Tabs
                    tabs={[
                            { label: 'Estadística general', value: 'general' },
                            { label: 'Estadística por especie', value: 'species' },
                        ]}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                />
                <InputSelect name='park' options={parkList} selected={park} change={onSelectChange}></InputSelect>
            </div>

            {activeTab==='general' ? (
                <>
                {/* Estadística general */}
                <h1 className="birdName">{parkData?.name}<InfoButton message={message}></InfoButton></h1>
                <div className="statistics-container">
                    <div className="horizontal horizontal-2">
                        <img src={import.meta.env.VITE_PARKS_PATH+parkData?.image} alt={parkData?.name} />
                        <section className="park-summary">
                                <h2>Resumen (últimos 5 años)</h2>
                                <div className="circles">
                                    <StatisticsCircle label='Especies' value={data?.totalSpecies}></StatisticsCircle>
                                    <StatisticsCircle label='Checklists' value={data?.totalChecklists}></StatisticsCircle>
                                </div>
                                <p className="explaining">Tendencia de especies: <span>{getTrend(data?.trend?.direction)}</span> (fiabilidad <span>{(data?.trend?.confidence*100).toFixed(2)}%</span>)</p>
                        </section>
                    </div>
                    <div className="top-species">
                        <p>dvasdf</p>
                    </div>
                    <div>
                        <Chart
                            title={'Biodiversidad (últimos 5 años)'}
                            options={createOption(
                                data?.yearlySpecies,
                                'year',
                                'Año',
                                'speciesCount',
                                'Cantidad'
                            )}
                        />
                    </div>
                </div>
                </>
            ) : (
                <>
                {/* Estadística por especie */}
                <h1 className="birdName">{birdData?.comName ?? ''}<span>({birdData?.sciName ?? ''})</span><InfoButton message={message}></InfoButton></h1>
                <div className="statistics-container">
                    <div className="horizontal">
                        <div className="image-container">
                            {birdData &&
                            <img src={birdData?.wikidata?.images[0]} alt={birdData.comName} />
                            }
                            <p>Probabilidad de avistar: <span>{(data?.[0]?.overall?.probability * 100).toFixed(2) ?? ''}%</span></p>
                        </div>
                        {/* <div className="prob-container"> */}
                            
                        {/* </div> */}
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
                    {/* <section className="trends">
                        <h2>Tendencias</h2>
                    </section> */}
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
            )}
            
            
            

        </MainLayout>
    );
}

export default Statistics;