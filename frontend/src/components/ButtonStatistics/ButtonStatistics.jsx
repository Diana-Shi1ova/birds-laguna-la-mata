import './ButtonStatistics.css';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

// Icons
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa"; // filled
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaTrashAlt } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";


function ButtonStatistics ({  }) {
    return (
        <Button classAdditional='chart-button'><FaChartBar />Ver dinámica</Button>
    );
};

export default ButtonStatistics;