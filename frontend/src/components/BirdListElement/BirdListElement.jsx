import './BirdListElement.css';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

// Icons
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa"; // filled
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa"; // filled
import { FaTrashAlt } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";


function BirdListElement ({ type='normal', data }) {
    return (
        <li className='bird-list-element'>
            <div className='bird'>
                <Link to={data.link} className='bird-image-link'>
                    <img className='bird-image' src={data.imagelink} alt={data.name} />
                </Link>
                <div className='bird-names'>
                    <Link to={data.link} className='common'>
                        {/* <p className='common'>Gavión atlántico</p> */}
                        {data.name}
                    </Link>
                    <p className='scientific'>({data.scientific})</p>
                </div>
            </div>
            
            <p className='obs'>Observación: <span>{data.observation}</span></p>
            <div className='buttons'>
                <Button type='icon'>
                    <FaChartBar />
                </Button>
                <Button type='icon'>
                    <FaRegBell />
                </Button>
                <Button  type='icon'>
                    {type==="normal" ? (<FaRegBookmark />) : (<FaTrashAlt />)}
                </Button>
            </div>
        </li>
    );
};

export default BirdListElement;