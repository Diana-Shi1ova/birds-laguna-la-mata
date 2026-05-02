import "./ResultsList.css";
import { useBirds } from "../../contexts/BirdsProvider";
import { useTranslation } from "react-i18next";


function ResultsList ({results, func=() => {}, display}) {
    const { t } = useTranslation();
    /*const {searchQuery, setSearchQuery} = useBirds();

    function updateSearch(sciName){
        // setSearchQuery()

        let names = [];
        names.push(sciName);

        setSearchQuery(prevFormData => ({
            ...prevFormData,
            species: names
        }));
    }*/

    return (
        // <ul className={display ? "results-list" : "results-list results-hidden"}>
        <ul className="results-list">
            {results.map((item) => (
                <li key={item._id}>
                    <button onMouseDown={() => func(item.sciName, item._id)} title={t('searchbar.results.button.tooltip') + " " + item.sciName}>
                        <span className="common-name">{item.comName}</span> <span className="scientific-name">({item.sciName})</span>
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ResultsList;