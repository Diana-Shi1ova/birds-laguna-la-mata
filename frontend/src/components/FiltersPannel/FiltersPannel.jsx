import "./FiltersPannel.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import Chips from "../Chips/Chips";
import { useEffect } from "react";
import { useBirds } from "../../contexts/BirdsProvider";
import { api } from "../../api/api";
import InputCheckbox from "../InputCheckbox/InputCheckbox";
import InputRadiobutton from "../InputRadiobutton/InputRadiobutton";
import InputSelect from "../InputSelect/InputSelect";
import InputDate from "../InputDate/InputDate";
import InputNumber from "../InputNumber/InputNumber";
import { UseAuth } from "../../auth/useAuth";
// import { set } from "mongoose";
// import { BsEraser } from "react-icons/bs";


function FiltersPannel () {
    const [formData, setFormData] = useState({
            species: [],
            name: "",
            favourites: false,
            period: true,
            selectedPeriod: 'today',
            date: new Date(),
            days: 1,
            ebird: true,
            raspberries: true,
        });

    const { area, setSearchQuery } = useBirds();
    const { isAuth } = UseAuth();

    const [numResults, setNumResults] = useState(0);
    const [showNumResults, setshowNumResults] = useState(false);
    const [showPeriodInput, setShowPeriodInput] = useState(false);

    const PERIOD_OPTIONS = [
        { value: "today", label: "Hoy" },
        { value: "week", label: "Última semana" },
        { value: "month", label: "Último mes" },
        { value: "custom", label: "Período personalizado" }
    ];

    const close = (e) => {
        e.preventDefault();
        document.querySelector(".filters-pannel").classList.add('closed');
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    }

    const onEnter = (e) => {
        e.preventDefault();
        if(e.target.name === 'birdNames'){ // Añadir elementos sin repetir
            const value = e.target.value.trim();
            e.target.value="";

            if (value === "") return;

            setFormData(prev => ({
                ...prev,
                species: prev.species.includes(value)
                    ? prev.species
                    : [...prev.species, value]
            }));
        }
        else e.target.blur();
            // setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const deleteSpecieFromList = (value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            species: prevFormData.species.filter(species => species !== value)
        }));
    }

    const clearSpecieFromList = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            species: []
        }));
    }

    // Hacer petición del historial en una fecha
    /*useEffect(() => {
        // Petición al servidor
        api.get('/eBird/history', {
            params: {
                hotspot: area,
                date: formatDateAPI(formData.date)
            }
        })
        .then(response => {
            console.log(response.data);
            // setBirds(response.data);
            // setFilteredBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [formData.date, area]);*/

    useEffect(() => {
        // Petición al servidor
        /*api.get('/eBird/history', {
            params: {
                hotspot: area,
                date: formatDateAPI(formData.date)
            }
        })
        .then(response => {
            console.log(response.data);
            // setBirds(response.data);
            // setFilteredBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });*/
        setSearchQuery(formData);
    }, [formData]);

    /*// Formatear fecha al formato aaaa/mm/dd para hacer petición al API
    function formatDateAPI(date = new Date()) {
        const d = new Date(date);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        return `${yyyy}/${mm}/${dd}`;
    }*/

    const onTemporalRadioChange = (e) => {
        console.log(e.target.value);
        if(e.target.value === 'date'){
            setFormData(prevFormData => ({
                ...prevFormData,
                period: false
            }));
        }
        else{
            setFormData(prevFormData => ({
                ...prevFormData,
                period: true
            }));
        }
    }

    const onPeriodChange = (e) => {
        console.log(e.target.value);
        const value = e.target.value;

        if(value === 'custom') setShowPeriodInput(true);
        else setShowPeriodInput(false);

        /*switch(value){
            case 'today':
                setBack(1);
                break;
            case 'week':
                setBack(7);
                break;
            case 'month':
                setBack(30);
                break;
        }*/

        setFormData(prevFormData => ({
            ...prevFormData,
            selectedPeriod: value
        }));
    }

    const onCheckboxesChange = (e) => {
        const { name, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const onDaysChange = (e) => {
        const val = e.target.value;
        console.log(val)

        // Si vacío, dejamos vacío
        if (val === "") return;

        // // En caso contrario convertimos
        // e.target.value = Number(val.replace(/\D/g, ""));

        // if (e.target.value < 1) e.target.value = 1;
        // if (e.target.value > 30) e.target.value = 30;

        // setBack(e.target.value);

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const resetFilters = () => {
        setFormData({
            species: [],
            name: "",
            favourites: false,
            period: true,
            selectedPeriod: 'today',
            date: new Date(),
            days: 1,
            ebird: true,
            raspberries: true,
        });
    }


    return (
        <form className="filters-pannel closed">
            <Button
                type="icon"
                classAdditional="close-button"
                func={(e) => close(e)}
            >
                <FaTimes />
            </Button>
            <section className="filter-section-general">
                <h1>Filtros</h1>
                {showNumResults && (
                    <p className="results">Resultados encontrados: <span>{numResults}</span></p>
                )}
                <section className="filter-section species-section">
                    <h2>Especies</h2>
                    <Input label={'Empieza a introducir las especies:'} name={'birdNames'} auto='off' placeholder={'Nombre común o científico'} enter={onEnter}></Input>
                    <Chips values={formData.species} remove={deleteSpecieFromList}></Chips>
                    {isAuth === true && (
                        <InputCheckbox name='favourites' label='Solo favoritos' classAdditional="favourite" change={onCheckboxesChange}></InputCheckbox>
                    )}
                </section>
                <section className="filter-section">
                    <h2>Filtrado temporal</h2>
                    <InputRadiobutton id='period' label='Período' name="filtrado-temporal" value='period' checked={true} change={onTemporalRadioChange}></InputRadiobutton>
                    <InputRadiobutton id='day' label='Fecha concreta' name="filtrado-temporal" value='date' change={onTemporalRadioChange}></InputRadiobutton>
                    {formData.period === true ? (
                        <InputSelect name='period' label='Selecciona el período:' change={onPeriodChange} selected={formData.selectedPeriod} options={PERIOD_OPTIONS}></InputSelect>
                    ) : (
                        <InputDate label={'Fecha:'} name={'date'} change={onChange} value={formatDate(formData.date)}></InputDate>
                    )}
                    { showPeriodInput === true && formData.period === true && (
                        <InputNumber name='days' label='Días (max. 30):' defValue={formData.days} max={30} min={1} step={1} change={onDaysChange} enter={onEnter}></InputNumber>
                    )}
                </section>
                <section className="filter-section">
                <h2>Fuente</h2>
                    {/* Añadir botones con información */}
                    <InputCheckbox name='ebird' label='eBird' checked={formData.ebird} change={onCheckboxesChange}></InputCheckbox>
                    <InputCheckbox name='raspberries' label='Raspberries' checked={formData.raspberries} change={onCheckboxesChange}></InputCheckbox>
                </section>
            </section>
            <Button func={resetFilters}>Reestablecer</Button>
        </form>
    );
}

export default FiltersPannel;