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
import { useTranslation } from "react-i18next";
import { useSearchUI } from "../../contexts/SearchUIProvider";


function Sidebar () {
    const { sidebarOpen, setSidebarOpen } = useSearchUI();
    const { isAuth, logout } = UseAuth();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    // Mostrar menú (móvil)
    function showMenu(){
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <div className={sidebarOpen ? "sidebar-container sidebar-container-opened" : "sidebar-container"}>
            <ul className="sidebar">
                <li className="logo">
                    <Logo></Logo>
                </li>
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""} title={t('sidebar.map')}>
                        <FaMapMarkerAlt />
                        <p className="p-mobile">{t('sidebar.map')}</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/catalog" end className={({ isActive }) => isActive ? "active" : ""} title={t('sidebar.catalog')}>
                        <FaBook />
                        <p className="p-mobile">{t('sidebar.catalog')}</p>
                    </NavLink>
                </li>
                {isAuth && (
                    <li>
                        <NavLink to="/favourites" end className={({ isActive }) => isActive ? "active" : ""} title={t('sidebar.saved')}>
                            <BsBookmarkStarFill />
                            <p className="p-mobile">{t('sidebar.saved')}</p>
                        </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to="/statistics" className={({ isActive }) => isActive ? "active" : ""} title={t('sidebar.statistics')}>
                        <FaChartBar />
                        <p className="p-mobile">{t('sidebar.statistics')}</p>
                    </NavLink>
                </li>
                {isAuth && (
                    <li className="li-exit">
                        <Button
                            type="icon"
                            classAdditional="exit"
                            func={logout}
                            tooltip={t('sidebar.logout')}
                        >
                            <FaSignOutAlt />
                            <p className="p-mobile">{t('sidebar.logout')}</p>
                        </Button>
                    </li>
                )}
            </ul>
            {sidebarOpen &&
            <Button
                type="icon"
                classAdditional="menu-button"
                func={() => showMenu()}
                tooltip={sidebarOpen ? t('sidebar.menu.close') : t('sidebar.menu.open')}
            >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
            </Button>
            }
        </div>
    );
};

export default Sidebar;