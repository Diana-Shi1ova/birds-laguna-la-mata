import './Logo.css';
import { FaFeatherAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function Logo () {
    return (
        <>
            <Link to="/about" title='Avistory'>
                <div className='logo-container'>
                    <FaFeatherAlt />
                </div>
            </Link>
        </>
    );
}

export default Logo