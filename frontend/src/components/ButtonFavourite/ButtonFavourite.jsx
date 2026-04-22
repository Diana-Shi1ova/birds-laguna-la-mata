import './ButtonFavourite.css';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

// Icons
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa"; // filled
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaTrashAlt } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";


function ButtonFavourite ({  }) {
    return (
        <>
        <Button type='icon' classAdditional='favorite-button'><FaRegBookmark /></Button>
        </>
    );
};

export default ButtonFavourite;