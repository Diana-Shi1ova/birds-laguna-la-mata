import "./Header.css";
import Searchbar from "../Searchbar/Searchbar";
import UserIcon from "../UserIcon/UserIcon";
import { useSearchUI } from "../../contexts/SearchUIProvider";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { GB, ES, RU } from 'country-flag-icons/react/3x2'
import Button from "../Button/Button";
import { FaBars } from "react-icons/fa";
import { useTranslation } from "react-i18next";


function Header () {
    const { t } = useTranslation();
    const { isSearchOpen, setSidebarOpen, sidebarOpen } = useSearchUI();

    function showSidebar(){
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <header>
            {/* <Sidebar></Sidebar> */}
            {!isSearchOpen && (
                <Button type="icon" classAdditional="open-sidebar" func={showSidebar} tooltip={sidebarOpen ? t('sidebar.menu.close') : t('sidebar.menu.open')}><FaBars /></Button>
            )}
            <Searchbar></Searchbar>
            {!isSearchOpen && (
                <>
                <LanguageSelector name="language" classAdditional="language"></LanguageSelector>
                <UserIcon />
                </>
            )}
        </header>
    );
};

export default Header;