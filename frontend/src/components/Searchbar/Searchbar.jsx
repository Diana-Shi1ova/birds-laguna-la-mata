import "./Searchbar.css";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import Button from "../Button/Button";
import { useRef, useState, useEffect, use } from "react";
import { useSearchUI } from "../../contexts/SearchUIProvider";
import { useBirds } from "../../contexts/BirdsProvider";
import { api } from "../../api/api";

import { FaArrowLeft } from "react-icons/fa";
import ResultsList from "../ResultsList/ResultsList";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function Searchbar () {
    const { t, i18n } = useTranslation();
    const inputRef = useRef(null);
    const filtersRef = useRef(null);
    const [focus, setFocus] = useState(false);
    const [mobile, setMobile] = useState(false);

    const { isSearchOpen, openSearch, closeSearch, searchType, filters, value, setValue, filtersPannel, setFiltersPannel } = useSearchUI();
    const { filteredBirds, setFilteredBirds, birds, setSimpleSearch, searchQuery, setSearchQuery, appliedFilters } = useBirds();
    // const {searchQuery, setSearchQuery} = useBirds();

    const [results, setResults] = useState([]);
    // const [value, setValue] = useState('');
    const [suggestions, setSuggentions] = useState(false);

    const navigate = useNavigate();

    const [width, setWidth] = useState(window.innerWidth);

    const [searchButtonTooltip, setSearchButtonTooltip] = useState('');

    // Actualizar anchura
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);

            if(window.innerWidth<=600) setSearchButtonTooltip(t('searchbar.button.show'));
            else setSearchButtonTooltip('');
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const open = () => {
        setFiltersPannel(!filtersPannel);
    }

    const showSearchbar = () => { // Añadir que si el tamaño es menor que 465px, se esconden los otros elementos
        if (width <= 600){
            setMobile(true);
            setFocus(true);
            openSearch(); // uso del contexto para esconder otros elementos
        }
    }

    const hideSearchBar = () => {
        setFocus(false);
        setMobile(false);
        closeSearch(); // uso del contexto para volver a mostrar otros elementos
    }

    const handleBlur = () => {
        /*setFocus(false);
        setMobile(false);
        closeSearch(); // uso del contexto para volver a mostrar otros elementos*/
        setSuggentions(false);
    }

    useEffect(() => {
        if (focus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focus]);

    // Normalizar texto para búsqueda (minúsculas y no tener en cuenta los acentos y ñ)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    const dynamicSearch = (e) => {
        if (searchType==='catalog'){
            setSuggentions(false);
            setValue(e.target.value);
        }
        else{
            if(e.target.value) setSuggentions(true);
            else setSuggentions(false);
            
            setValue(e.target.value);

            // Hacer petición de especies
            api.get('/bird', {
                params: { page: 1, limit: 10, name: e.target.value.toLowerCase(), locale: i18n.resolvedLanguage}
            })
            .then(response => {
                console.log(response.data.data);
                setResults(response.data.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }

    // Aplicar al pulsar sobre sugerencia
    function updateSearch(sciName, birdId){
        let names = [];
        names.push(sciName);

        switch(searchType){
            case 'map':
                setSearchQuery(prevFormData => ({
                    ...prevFormData,
                    species: names
                }));
                setValue(sciName);
                break;
            case 'statistics':
                setValue('');
                navigate(`/statistics/bird/${birdId}`);
            break;
        }

        setSuggentions(false);
    }

    function clear(){
        setSearchQuery(prevFormData => ({
            ...prevFormData,
            species: prevFormData.species.filter(
                specie => specie !== value
            )
        }));
        setValue("");
    }


    return (
        <div className="searchbar-container">
            {isSearchOpen && 
                <Button type="icon" classAdditional="arrow-button" func={hideSearchBar} tooltip={t('searchbar.button.hide')}>
                    <FaArrowLeft />
                </Button>
            }
            <div className="searchbar">
                <input
                    ref={inputRef}
                    type="text"
                    className={`searchbar-input ${mobile ? 'mobile' : ''}`}
                    onBlur={handleBlur}
                    onChange={dynamicSearch}
                    placeholder={t('searchbar.placeholder')}
                    autoComplete="off"
                    name="searchbar"
                    value={value}
                />
                {value ? (
                    <Button
                        type="icon"
                        classAdditional="search-button"
                        func={clear}
                        tooltip={t('searchbar.button.clear')}
                    >
                        <FaTimes />
                    </Button>
                ) : (
                    <Button
                        type="icon"
                        classAdditional="search-button"
                        func={showSearchbar}
                        tooltip={searchButtonTooltip}
                    >
                        <FaSearch />
                    </Button>
                )}
                
                {suggestions && (
                    <ResultsList results={results} func={updateSearch}></ResultsList>
                )}
            </div>
            {filters && (
                <>
                <Button
                    // ref={filtersRef}
                    // classAdditional={`filters${mobile ? '-show' : ''}`}
                    classAdditional='filters'
                    func={open}
                    tooltip={t('button.open_filters')}
                >
                    <FaFilter />
                </Button>
                    {appliedFilters && <div className="red-indicator"></div>}
                </>
            )}
            
        </div>
    );
};

export default Searchbar;