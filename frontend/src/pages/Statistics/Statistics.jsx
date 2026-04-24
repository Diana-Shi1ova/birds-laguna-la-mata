import "./Statistics.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useLocation } from "react-router-dom";
import { api } from "../../api/api";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "../../components/Chart/Chart";
import InputSelect from "../../components/InputSelect/InputSelect";
import Tabs from "../../components/Tabs/Tabs";
import ButtonInfo from "../../components/ButtonInfo/ButtonInfo";
import { useParams } from "react-router-dom";
import { useBirds } from "../../contexts/BirdsProvider";
import { FaDove } from "react-icons/fa";
import BirdCarousel from "../../components/BirdCarousel/BirdCarousel";
import StatisticsBird from "./StatisticsBird/StatisticsBird";
import StatisticsPark from "./StatisticsPark/StatisticsPark";


function Statistics(){
    const location = useLocation();
    const { park: initialPark } = location.state || {};
    const [park, setPark] = useState(initialPark || '69e16d8d48ce5b0d0d8f9b23');
    const [data, setData] = useState([]);
    
    const [parkList, setParkList] = useState([]);
    // const [bird, setBird] = useState(location.state || '6987948a2e98ed23fd2c37c0');
    const [birdData, setBirdData] = useState();
    const [today, setToday] = useState();
    const [week, setWeek] = useState();
    const [month, setMonth] = useState();
    
    const navigate = useNavigate();
    const { bird } = useParams();
    const [activeTab, setActiveTab] = useState(bird ? "species" : "general");
    const [birdId, setBirdId] = useState(bird ? bird : "");
    
    // const activeTab = bird ? "species" : "general";

    const message = "Los datos utilizados para el análisis provienen de la ciencia ciudadana (fuente: eBird). Reflejan únicamente lo que los observadores incluyendo no profesionales han logrado registrar y pueden diferir en cierto grado de la realidad.";

    

    useEffect(() => {
        
        setActiveTab (bird ? "species" : "general");
        setBirdId(bird ? bird : "");
    }, [bird]);

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




    return(
        <MainLayout>
            <div className="chartpage-header">
                <Tabs
                    tabs={[
                            { label: 'Estadística general', value: 'general', url: '/statistics' },
                            { label: 'Estadística por especie', value: 'species', url: `/statistics/bird/${birdId}` },
                        ]}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                />
                <InputSelect name='park' options={parkList} selected={park} change={onSelectChange}></InputSelect>
            </div>

            {activeTab==='general' ? (
                <>
                {/* Estadística general */}
                <StatisticsPark park={park} createOption={createOption}></StatisticsPark>
                </>
            ) : (
                <>
                {/* Estadística por especie */}
                {birdId? (
                    <>
                    {/* Hay especie */}
                    <StatisticsBird park={park} createOption={createOption}></StatisticsBird>
                    </>
                ) : (
                    <>
                        {/* No hay especie */}
                        <div className="without-data">
                            <h1>Especie no seleccionada</h1>
                            <FaDove />
                            <p>Utiliza el buscador para buscar la especie</p>
                        </div>
                    </>
                )}
                
                
                </>
            )}
            
            
            

        </MainLayout>
    );
}

export default Statistics;