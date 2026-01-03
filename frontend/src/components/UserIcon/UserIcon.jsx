import "./UserIcon.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";


function UserIcon () {
    return (
        <div className="user-icon-container">
            <Link to={'/login'}><FaUserCircle /></Link>
        </div>
    );
};

export default UserIcon;