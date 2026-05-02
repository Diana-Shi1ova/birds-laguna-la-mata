import { useState, useRef } from "react";
import "./LanguageSelector.css";
import { GB, ES, RU } from 'country-flag-icons/react/3x2'
import { useTranslation } from "react-i18next";
import { FaAngleDown } from "react-icons/fa";


function LanguageSelector ({id, name, selected, change=()=>{}}) {
    const { t, i18n } = useTranslation();
    // const selectRef = useRef(null);
    const [language, setLanguage] = useState(i18n.resolvedLanguage);
    console.log(i18n)

    function change(e){
        setLanguage(e.target.value);
        i18n.changeLanguage(e.target.value);
    }

    /*function openSelect() {
        selectRef.current?.focus();
        selectRef.current?.click();
    }*/

    return (
        <div className="language-selector-container" title={t('select.language.title')}>
            { language==='es' && <ES width={40} />}
            { language==='en' && <GB width={40} />}
            { language==='ru' && <RU width={40} />}
            <div className="drop-down">
                <FaAngleDown />
            </div>
            <select
                className="language-selector"
                id={id}
                name={name}
                value={language}
                onChange={change}
                title={t('select.language.title')}
            >
                <option value="es" title={t('select.language.option.spanish')}>ES</option>
                <option value="en" title={t('select.language.option.english')}>EN</option>
                <option value="ru" title={t('select.language.option.russian')}>RU</option>
            </select>
        </div>
        
    );
}


export default LanguageSelector;