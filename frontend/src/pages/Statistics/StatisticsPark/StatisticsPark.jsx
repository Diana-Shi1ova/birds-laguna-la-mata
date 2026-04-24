import "./StatisticsPark.css" ;
import { useState, useEffect } from "react";
import ButtonInfo from "../../../components/ButtonInfo/ButtonInfo";
import StatisticsCircle from "../../../components/StatisticsCircle/StatisticsCircle";
import Chart from "../../../components/Chart/Chart";
import { api } from "../../../api/api";
import BirdCarousel from "../../../components/BirdCarousel/BirdCarousel";

function StatisticsPark({park, createOption = () => ({})}){
    const message = "Los datos utilizados para el análisis provienen de la ciencia ciudadana (fuente: eBird). Reflejan únicamente lo que los observadores incluyendo no profesionales han logrado registrar y pueden diferir en cierto grado de la realidad.";
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
        api.get(`/statistics/park/${park}`)
        .then(response => {
            console.log(response.data);
            setData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    }, [park]);


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

    
    return(
        <>
            <h1 className="birdName">{parkData?.name}<ButtonInfo message={message}></ButtonInfo></h1>
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
                    <h2>Top 10 especies más frecuentes</h2>
                    <BirdCarousel birds={data?.top10}></BirdCarousel>
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
    );
}

export default StatisticsPark;