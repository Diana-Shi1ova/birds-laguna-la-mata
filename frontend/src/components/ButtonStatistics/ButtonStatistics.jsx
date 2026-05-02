import './ButtonStatistics.css';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

// Icons
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa"; // filled
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaTrashAlt } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


function ButtonStatistics ({ bird, park }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const showStatistics = () => {
        navigate(`/statistics/bird/${bird}`, { state: { park } });
    };

    return (
        <Button classAdditional='chart-button' func={showStatistics}><FaChartBar />{t('button.statistics')}</Button>
    );
};

export default ButtonStatistics;