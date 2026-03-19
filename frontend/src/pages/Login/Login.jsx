import FormLayout from "../../layouts/FormLayout/FormLayout";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/api";
import { UseAuth } from "../../auth/useAuth";

function Login () {
    const { login, isAuth } = UseAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [responseData, setResponseData] = useState();
    const [error, setError] = useState();

    const handleChange = (e) => {
        setError(null);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Petición al servidor
        api.post('/user/login', formData)
        .then(response => {
            console.log(response.data);
            setResponseData(response.data);
            login(response.data);
            navigate('/');
        })
        .catch(error => {
            console.error('Error:', error.response.data.message);
            setError(error.response.data.message);
        });
    };

    // Si autorizado, se redirige a inicio
    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {/* <h1>Login</h1> */}
            <FormLayout title={"Login"} url="login" submit="Iniciar sesión" submitFunction={handleSubmit} close={true}>
                <p className={error ? ('error-message-general opened') : ('error-message-general')}>{error}</p>
                <Input label="Email" req={true} name="email" auto="email" change={handleChange} type="email"></Input>
                <Input label="Contraseña" req={true} name="password" change={handleChange} type="password"></Input>
            </FormLayout>
        </>
    );
};

export default Login;