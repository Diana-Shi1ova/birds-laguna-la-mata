import { useState } from "react";

import "./Sidebar.css";
import { NavLink, Link } from 'react-router-dom';
import { UseAuth } from "../../auth/useAuth";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";

// Icons
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { BsBookmarkStarFill } from "react-icons/bs";
import { FaChartBar } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";


function Sidebar () {
    const { isAuth } = UseAuth();
    const { logout } = UseAuth();
    const [open, setOpen] = useState(false);

    // Mostrar menú (móvil)
    function showMenu(){
        if(open){ // Mostrar
            document.querySelector('.sidebar-container').classList.remove('sidebar-container-opened');
        }
        else{ // Ocultar
            document.querySelector('.sidebar-container').classList.add('sidebar-container-opened');
        }
        setOpen(!open);
    }

    return (
        <div className="sidebar-container">
            {/* <input type="checkbox" id="menu-toggle" /> */}
            <ul className="sidebar">
                <li className="logo">
                    <Logo></Logo>
                </li>
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                        <FaMapMarkerAlt />
                        <p className="p-mobile">Mapa</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/catalog" end className={({ isActive }) => isActive ? "active" : ""}>
                        <FaBook />
                        <p className="p-mobile">Catálogo de especies</p>
                    </NavLink>
                </li>
                {isAuth && (
                    <li>
                        <NavLink to="/favourites" end className={({ isActive }) => isActive ? "active" : ""}>
                            <BsBookmarkStarFill />
                            <p className="p-mobile">Especies guardadas</p>
                        </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to="/statistics" className={({ isActive }) => isActive ? "active" : ""}>
                        <FaChartBar />
                        <p className="p-mobile">Estadística</p>
                    </NavLink>
                </li>
                {isAuth && (
                    <li className="li-exit">
                        <Button
                            type="icon"
                            classAdditional="exit"
                            func={logout}
                        >
                            <FaSignOutAlt />
                            <p className="p-mobile">Cerrar sesión</p>
                        </Button>
                    </li>
                )}
            </ul>
            <Button
                type="icon"
                classAdditional="menu-button"
                func={() => showMenu()}
            >
                {open ? <FaTimes /> : <FaBars />}
            </Button>
        </div>
    );
};

export default Sidebar;