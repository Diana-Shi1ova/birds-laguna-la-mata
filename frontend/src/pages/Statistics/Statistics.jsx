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
import { useSearchUI } from "../../contexts/SearchUIProvider";
import { useTranslation } from "react-i18next";


function Statistics(){
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const { park: initialPark } = location.state || {};
    const [park, setPark] = useState(initialPark || '69e16d8d48ce5b0d0d8f9b23');
    const [parkList, setParkList] = useState([]);
    const { bird } = useParams();
    const [activeTab, setActiveTab] = useState(bird ? "species" : "general");
    const [birdId, setBirdId] = useState(bird ? bird : "");
    const { setFilters, setValue, setSearchType } = useSearchUI();
    
    useEffect(() => {
        setFilters(false);
        setSearchType('statistics');
        setValue('');
    }, []);


    // Cambio de pestaña
    useEffect(() => {
        setActiveTab (bird ? "species" : "general");
        setBirdId(bird ? bird : "");
    }, [bird]);

    
    // Obetner parques
    useEffect(() => {
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


    // Datos y estilos de gráficas
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

    // Cambio de parque
    const onSelectChange = (e) => {
        console.log(e.target.value);
        setPark(e.target.value);
    }


    return(
        <MainLayout>
            <div className="chartpage-header">
                <Tabs
                    tabs={[
                            { label: t('statistics.tabs.general'), value: 'general', url: '/statistics' },
                            { label: t('statistics.tabs.specie'), value: 'species', url: `/statistics/bird/${birdId}` },
                        ]}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                />
                <InputSelect name='park' options={parkList} selected={park} change={onSelectChange} title={t('select.park')}></InputSelect>
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
                            <h1>{t('statistics.specie.no_selected.title')}</h1>
                            <FaDove />
                            <p>{t('statistics.specie.no_selected.message')}</p>
                        </div>
                    </>
                )}
                </>
            )}
        </MainLayout>
    );
}

export default Statistics;