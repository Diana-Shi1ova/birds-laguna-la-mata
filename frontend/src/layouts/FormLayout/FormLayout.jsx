import "./FormLayout.css";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

import { FaTimes } from "react-icons/fa";


function FormLayout ({ children, title, url="", submit="Enviar", submitFunction, close=false }) {
    const navigate = useNavigate();

    const navFunction = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <div className="form-container">
            <form action="" className="auth-form">
                {close && (<Button classAdditional="close-button" type="icon" func={(e) => navFunction(e)}><FaTimes /></Button>)}
                <h1>{title}</h1>
                {children}
                <Button
                    name={submit}
                    func={submitFunction}
                >
                </Button>
                {url === "login" && (
                    <>
                        <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
                    </>
                )}
                {url === "register" && (
                    <>
                        <p>¿Ya tienes cuenta? <Link to="/login">Ir al login</Link></p>
                    </>
                )}
            </form>
        </div>
        
    );
};

export default FormLayout;