import "./FormLayout.css";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

import { FaTimes } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import { useTranslation } from "react-i18next";


function FormLayout ({ children, title, url="", submit="Enviar", submitFunction, close=false }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navFunction = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <div className="form-container">
            {close && (
                <>
                <Button classAdditional="back" colorType="secondary" func={(e) => navFunction(e)}><FaAngleLeft />{t('form.button.back')}</Button>
                <Button classAdditional="back-icon" type="icon" tooltip={t('form.button.back')} func={(e) => navFunction(e)}><FaArrowLeft/></Button>
                </>
            )}
            <form onSubmit={submitFunction} className="auth-form">
                <h1>{title}</h1>
                {children}
                <p className="explain">{t('form.explain')}</p>
                <Button
                    name={submit}
                    submit={true}
                >
                </Button>
                {url === "login" && (
                    <>
                        <p>{t('login.without_account')} <Link to="/register">{t('login.link.register')}</Link></p>
                    </>
                )}
                {url === "register" && (
                    <>
                        <p>{t('regiter.with_account')} <Link to="/login">{t('register.link.login')}</Link></p>
                    </>
                )}
            </form>
        </div>
        
    );
};

export default FormLayout;