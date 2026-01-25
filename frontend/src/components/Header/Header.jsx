import "./Header.css";
import Searchbar from "../Searchbar/Searchbar";
import UserIcon from "../UserIcon/UserIcon";
import { useSearchUI } from "../../contexts/SearchUIProvider";


function Header () {
    const { isSearchOpen, openSearch, closeSearch } = useSearchUI();

    return (
        <header>
            {/* <Sidebar></Sidebar> */}
            <Searchbar></Searchbar>
            {!isSearchOpen && <UserIcon />}
        </header>
    );
};

export default Header;