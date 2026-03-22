import "./Searchbar.css";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import Button from "../Button/Button";
import { useRef, useState, useEffect } from "react";
import { useSearchUI } from "../../contexts/SearchUIProvider";
import { useBirds } from "../../contexts/BirdsProvider";

import { FaArrowLeft } from "react-icons/fa";


function Searchbar () {
    const inputRef = useRef(null);
    const filtersRef = useRef(null);
    const [focus, setFocus] = useState(false);
    const [mobile, setMobile] = useState(false);

    const { isSearchOpen, openSearch, closeSearch } = useSearchUI();
    const { filteredBirds, setFilteredBirds, birds } = useBirds();

    const open = () => {
        document.querySelector('.filters-pannel').classList.remove('closed');
    }

    const showSearchbar = () => { // Añadir que si el tamaño es menor que 465px, se esconden los otros elementos
        /*console.log(document.querySelector(".searchbar-input"));*/
        // document.querySelector(".searchbar-input").classList.add('mobile');
        setMobile(true);
        setFocus(true);
        openSearch(); // uso del contexto para esconder otros elementos
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
        const value = e.target.value.toLowerCase();

        const result = birds.filter(bird => 
            normalizeText(bird.comName).includes(value) ||
            normalizeText(bird.sciName).includes(value)
        );
        
        console.log(result);
        setFilteredBirds(result);
    }



    return (
        <div className="searchbar-container">
            {isSearchOpen && 
                <Button type="icon" classAdditional="arrow-button" func={hideSearchBar}>
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
                    placeholder="Nombre común o científico"
                    autoComplete="off"
                    name="searchbar"
                />
                <Button
                    type="icon"
                    classAdditional="search-button"
                    func={showSearchbar}
                >
                    <FaSearch />
                </Button>
            </div>
            <Button
                // ref={filtersRef}
                // classAdditional={`filters${mobile ? '-show' : ''}`}
                classAdditional='filters'
                func={open}
            >
                <FaFilter />
            </Button>
        </div>
    );
};

export default Searchbar;