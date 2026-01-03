import "./Header.css";
import Searchbar from "../Searchbar/Searchbar";
import UserIcon from "../UserIcon/UserIcon";


function Header () {
    return (
        <header>
            {/* <Sidebar></Sidebar> */}
            <Searchbar></Searchbar>
            <UserIcon></UserIcon>
        </header>
    );
};

export default Header;