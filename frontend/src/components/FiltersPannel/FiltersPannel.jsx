import "./FiltersPannel.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import Chips from "../Chips/Chips";
import { useEffect, useRef } from "react";
import { useBirds } from "../../contexts/BirdsProvider";
import { api } from "../../api/api";
import InputCheckbox from "../InputCheckbox/InputCheckbox";
import InputRadiobutton from "../InputRadiobutton/InputRadiobutton";
import InputSelect from "../InputSelect/InputSelect";
import InputDate from "../InputDate/InputDate";
import InputNumber from "../InputNumber/InputNumber";
import { UseAuth } from "../../auth/useAuth";
import { useSearchUI } from "../../contexts/SearchUIProvider";
import { useTranslation } from "react-i18next";
import ResultsList from "../ResultsList/ResultsList";
import isEqual from 'lodash/isEqual';
// import { set } from "mongoose";
// import { BsEraser } from "react-icons/bs";


function FiltersPannel () {
    const { t, i18n } = useTranslation();
    /*const [formData, setFormData] = useState({
            species: [],
            favourites: false,
            period: true,
            selectedPeriod: 'today',
            date: new Date(),
            days: 1,
            ebird: true,
            rpa: true,
            rpi: true,
        });*/

    const { area, setSearchQuery, searchQuery, filteredBirds, raspResults, appliedFilters, setAppliedFilters } = useBirds();
    const { filtersPannel, setFiltersPannel } = useSearchUI();
    const { user, isAuth } = UseAuth();
    const [formData, setFormData] = useState(searchQuery);

    

    const [numResults, setNumResults] = useState(0);
    const [showNumResults, setshowNumResults] = useState(false);
    const [showPeriodInput, setShowPeriodInput] = useState(false);
    const [specieValue, setSpecieValue] = useState('');
    const [results, setResults] = useState([]);
    const inputSpecieRef = useRef();

    const PERIOD_OPTIONS = [
        { value: "today", label: t('filters.period.select.option.today') },
        { value: "week", label: t('filters.period.select.option.week') },
        { value: "month", label: t('filters.period.select.option.month') },
        { value: "custom", label: t('filters.period.select.option.custom') }
    ];

    useEffect(() => {
        if(isEqual(searchQuery, formData)) setAppliedFilters(false);
        else  setAppliedFilters(true);
    }, [searchQuery]);

    const close = (e) => {
        e.preventDefault();
        setFiltersPannel(false);
    }

    const onChange = (e) => {
        // setFormData({ ...formData, [e.target.name]: e.target.value });
        // console.log(formData);
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value })
    }

   const onEnter = (e) => {
        e.preventDefault();
        console.log('enter')

        if (e.target.name === "birdNames") {
            const value = e.target.value.trim();

            if (value === "") return;

            addBirdToList(specieValue);
        } else {
            e.target.blur();
        }
    };

    function addBirdToList(value){
        /*setFormData(prev => ({
            ...prev,
            species: prev.species.includes(value)
                ? prev.species
                : [...prev.species, value]
        }));*/

        setSearchQuery(prev => ({
            ...prev,
            species: prev.species.includes(value)
                ? prev.species
                : [...prev.species, value]
        }));

        setSpecieValue("");
        setResults([]);
    }

    const deleteSpecieFromList = (value) => {
        /*setFormData(prevFormData => ({
            ...prevFormData,
            species: prevFormData.species.filter(species => species !== value)
        }));*/
        setSearchQuery(prevFormData => ({
            ...prevFormData,
            species: prevFormData.species.filter(species => species !== value)
        }));
    }

    const clearSpecieFromList = () => {
        /*setFormData(prevFormData => ({
            ...prevFormData,
            species: []
        }));*/
        setSearchQuery(prevFormData => ({
            ...prevFormData,
            species: []
        }));
    }

    // Lista de sujerencias
    useEffect(() => {
        if(specieValue==="") {
            setResults([]);
            return
        }
        // Hacer petición de especies
        api.get('/bird', {
            params: { page: 1, limit: 10, name: specieValue.toLowerCase(), locale: i18n.resolvedLanguage}
        })
        .then(response => {
            console.log(response.data.data);
            setResults(response.data.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [specieValue, i18n.resolvedLanguage]);

    // Al pulsar sobre el resultado
    function addSpecie(sciName, id) {
        addBirdToList(sciName);
    }

    /*useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            species: searchQuery.species
        }));
    }, [formData]);*/

    const onTemporalRadioChange = (e) => {
        console.log(e.target.value);
        if(e.target.value === 'date'){
            /*setFormData(prevFormData => ({
                ...prevFormData,
                period: false
            }));*/
            setSearchQuery(prevFormData => ({
                ...prevFormData,
                period: false
            }));
        }
        else{
            /*setFormData(prevFormData => ({
                ...prevFormData,
                period: true
            }));*/
            setSearchQuery(prevFormData => ({
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

        /*setFormData(prevFormData => ({
            ...prevFormData,
            selectedPeriod: value
        }));*/
        setSearchQuery(prevFormData => ({
            ...prevFormData,
            selectedPeriod: value
        }));
    }

    const onCheckboxesChange = (e) => {
        const { name, checked } = e.target;

        /*setFormData(prev => ({
            ...prev,
            [name]: checked
        }));*/

        setSearchQuery(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const onFavouritesChange = (e) => {
        onCheckboxesChange(e);

        const { checked } = e.target;

        if (!user) return;

        // Si desmarcado
        if (!checked) {
            /*setFormData(prev => ({
                ...prev,
                species: []
            }));*/
            setSearchQuery(prev => ({
                ...prev,
                species: []
            }));
            return;
        }

        // Si marcado
        api.get(`/favourite/${user._id}`)
            .then(response => {
                const data = response.data.data;

                const sciNames = data.map(item => item.bird.sciName);

                /*setFormData(prev => ({
                    ...prev,
                    species: sciNames
                }));*/
                setSearchQuery(prev => ({
                    ...prev,
                    species: sciNames
                }));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const onDaysChange = (e) => {
        const val = e.target.value;
        console.log(val)

        // Si vacío, dejamos vacío
        if (val === "") return;

        /*setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));*/
        setSearchQuery(prev => ({
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
        /*setFormData({
            species: [],
            name: "",
            favourites: false,
            period: true,
            selectedPeriod: 'today',
            date: new Date(),
            days: 1,
            ebird: true,
            rpa: true,
            rpi: true,
        });*/
        const data = {
            species: [],
            // name: "",
            favourites: false,
            period: true,
            selectedPeriod: 'today',
            date: new Date(),
            days: 1,
            ebird: true,
            rpa: true,
            rpi: true,
        }
        setSearchQuery(data);
        setFormData(data);
        setShowPeriodInput(false);
    }

    


    return (
        <form className={filtersPannel ? "filters-pannel" : "filters-pannel closed"} onSubmit={(e)=>{e.preventDefault()}}>
            <Button
                type="icon"
                classAdditional="close-button"
                func={(e) => close(e)}
                tooltip={t('filters.button.close')}
            >
                <FaTimes />
            </Button>
            <section className="filter-section-general">
                <h1>{t('filters.title')}</h1>
                    <p className="results">{t('filters.results')} <span>{filteredBirds.length + raspResults}</span></p>
                <section className="filter-section species-section">
                    <h2>{t('filters.species.title')}</h2>
                        <Input
                            label={t('filters.species.input.label')}
                            name={'birdNames'}
                            auto='off'
                            placeholder={t('filters.species.input.placeholder')}
                            enter={onEnter}
                            change={(e) => setSpecieValue(e.target.value)}
                            value={specieValue}
                            resultsList={results}
                            resultsListFunc={addSpecie}
                        >
                        </Input>
                        {/* <Chips values={formData.favourites ? [] : searchQuery.species} remove={deleteSpecieFromList}></Chips> */}
                        <Chips values={searchQuery.favourites ? [] : searchQuery.species} remove={deleteSpecieFromList}></Chips>
                    {isAuth === true && (
                        // <InputCheckbox name='favourites' label={t('filters.species.checkbox.label')} classAdditional="favourite" change={onFavouritesChange} checked={formData.favourites}></InputCheckbox>
                        <InputCheckbox name='favourites' label={t('filters.species.checkbox.label')} classAdditional="favourite" change={onFavouritesChange} checked={searchQuery.favourites}></InputCheckbox>
                    )}
                </section>
                <section className="filter-section">
                    <h2>{t('filters.period.title')}</h2>
                    {/* <InputRadiobutton id='period' label={t('filters.period.radiobutton.period.label')} name="filtrado-temporal" value='period' checked={formData.period} change={onTemporalRadioChange}></InputRadiobutton>
                    <InputRadiobutton id='day' label={t('filters.period.radiobutton.date.label')} name="filtrado-temporal" value='date' checked={!formData.period} change={onTemporalRadioChange}></InputRadiobutton> */}
                    <InputRadiobutton id='period' label={t('filters.period.radiobutton.period.label')} name="filtrado-temporal" value='period' checked={searchQuery.period} change={onTemporalRadioChange}></InputRadiobutton>
                    <InputRadiobutton id='day' label={t('filters.period.radiobutton.date.label')} name="filtrado-temporal" value='date' checked={!searchQuery.period} change={onTemporalRadioChange}></InputRadiobutton>                    
                    {searchQuery.period === true ? (
                        <InputSelect name='period' label={t('filters.period.select.label')} change={onPeriodChange} selected={searchQuery.selectedPeriod} options={PERIOD_OPTIONS}></InputSelect>
                    ) : (
                        <InputDate label={t('filters.period.date.label')} name={'date'} change={onChange} defValue={formatDate(searchQuery.date)}></InputDate>
                    )}
                    { showPeriodInput === true && searchQuery.period === true && (
                        <InputNumber name='days' label={t('filters.period.days.label')} defValue={searchQuery.days} max={30} min={1} step={1} change={onDaysChange} enter={onEnter}></InputNumber>
                    )}
                </section>
                <section className="filter-section">
                <h2>{t('filters.source.title')}</h2>
                    {/* Añadir botones con información */}
                    <InputCheckbox name='ebird' label={t('filters.source.checkbox.ebird.label')} checked={searchQuery.ebird} change={onCheckboxesChange}></InputCheckbox>
                    <InputCheckbox name='rpa' label={t('filters.source.checkbox.rasp_audio.label')} checked={searchQuery.rpa} change={onCheckboxesChange}></InputCheckbox>
                    <InputCheckbox name='rpi' label={t('filters.source.checkbox.rasp_image.label')} checked={searchQuery.rpi} change={onCheckboxesChange}></InputCheckbox>
                </section>
            </section>
            <Button colorType='secondary' func={resetFilters}>{t('filters.button.reset')}</Button>
        </form>
    );
}

export default FiltersPannel;