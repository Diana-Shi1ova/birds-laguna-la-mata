import FormLayout from "../../layouts/FormLayout/FormLayout";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/api";
import { UseAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";


function Login () {
    const { t } = useTranslation();
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
            if(error.status === 400) setError(t('login.invalid'));
            else setError(t('sever_error'));
        });
    };

    // Si autorizado, se redirige a inicio
    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {/* <h1>Login</h1> */}
            <FormLayout title={t('page.title.login')} url="login" submit={t('login.button.login')} submitFunction={handleSubmit} close={true}>
                <p className={error ? ('error-message-general opened') : ('error-message-general')}>{error}</p>
                <Input label={t('login.email.label')} req={true} name="email" auto="email" change={handleChange} type="email"></Input>
                <Input label={t('login.password.label')} req={true} name="password" change={handleChange} type="password"></Input>
            </FormLayout>
        </>
    );
};

export default Login;