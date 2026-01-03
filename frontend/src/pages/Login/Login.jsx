import FormLayout from "../../layouts/FormLayout/FormLayout";
import Input from "../../components/Input/Input";

import { useState } from "react";
import { api } from "../../api/api";
import { UseAuth } from "../../auth/useAuth";

function Login () {
    const { login, isAuth } = UseAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [responseData, setResponseData] = useState();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        /*setLoading(true);
        setError("");*/

        // Petición al servidor
        api.post('/user/login', formData)
        .then(response => {
            console.log(response.data);
            setResponseData(response.data);
            login(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    console.log(isAuth);

    return (
        <>
            {/* <h1>Login</h1> */}
            <FormLayout title={"Login"} url="login" submit="Iniciar sesión" submitFunction={handleSubmit} close={true}>
                <Input label="Email" req={true} name="email" auto="email" change={handleChange} type="text"></Input>
                <Input label="Contraseña" req={true} name="password" change={handleChange} type="password"></Input>
            </FormLayout>
        </>
    );
};

export default Login;