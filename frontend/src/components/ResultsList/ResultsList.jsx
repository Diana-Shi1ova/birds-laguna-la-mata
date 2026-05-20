import "./ResultsList.css";
import { useBirds } from "../../contexts/BirdsProvider";
import { useTranslation } from "react-i18next";


function ResultsList ({results, func=() => {}, display}) {
    const { t } = useTranslation();

    function onEnter(e, sci, id){
        if (e.key === "Enter") func(sci, id);
    }

    return (
        <ul className="results-list">
            {results.map((item) => (
                <li key={item._id}>
                    <button onMouseDown={() => func(item.sciName, item._id)} onKeyDown={(e) => onEnter(e, item.sciName, item._id)} title={t('searchbar.results.button.tooltip') + " " + item.sciName}>
                        <span className="common-name">{item.comName}</span> <span className="scientific-name">({item.sciName})</span>
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ResultsList;