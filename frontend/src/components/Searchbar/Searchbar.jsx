import "./Searchbar.css";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import Button from "../Button/Button";
import { useRef, useState, useEffect } from "react";


function Searchbar () {
    const inputRef = useRef(null);
    const [focus, setFocus] = useState(false);
    const [mobile, setMobile] = useState(false);

    const open = () => {
        document.querySelector('.filters-pannel').classList.remove('closed');
    }

    const showSearchbar = () => {
        /*console.log(document.querySelector(".searchbar-input"));*/
        // document.querySelector(".searchbar-input").classList.add('mobile');
        setMobile(true);
        setFocus(true);
    }

    const handleBlur = () => {
        setFocus(false);
        setMobile(false);
    }

    useEffect(() => {
        if (focus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focus]);

    return (
        <div className="searchbar-container">
            <div className="searchbar">
                <input
                    ref={inputRef}
                    type="text"
                    className={`searchbar-input ${mobile ? 'mobile' : ''}`}
                    onBlur={handleBlur}
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
                classAdditional="filters"
                func={open}
            >
                <FaFilter />
            </Button>
        </div>
    );
};

export default Searchbar;