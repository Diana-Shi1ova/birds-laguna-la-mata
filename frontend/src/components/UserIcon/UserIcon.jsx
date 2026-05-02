import "./UserIcon.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { UseAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";


function UserIcon () {
    const { t } = useTranslation();
    const { isAuth } = UseAuth();

    return (
        <div className="user-icon-container">
            <Link to={'/login'} title={isAuth ? t('usericon.profile') : t('usericon.login')}><FaUserCircle /></Link>
        </div>
    );
};

export default UserIcon;