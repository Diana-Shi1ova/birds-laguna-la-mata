import { useState, useRef } from "react";
import "./LanguageSelector.css";
import { GB, ES, RU } from 'country-flag-icons/react/3x2'
import { useTranslation } from "react-i18next";
import { FaAngleDown } from "react-icons/fa";


function LanguageSelector ({id, name, selected, change=()=>{}}) {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.resolvedLanguage);

    function change(e){
        setLanguage(e.target.value);
        i18n.changeLanguage(e.target.value);
    }


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
                <option value="es">{t('select.language.option.spanish')}</option>
                <option value="en">{t('select.language.option.english')}</option>
                <option value="ru">{t('select.language.option.russian')}</option>
            </select>
        </div>
        
    );
}


export default LanguageSelector;