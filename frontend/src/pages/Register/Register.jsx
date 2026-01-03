import FormLayout from "../../layouts/FormLayout/FormLayout";
import Input from "../../components/Input/Input";
import { useState } from "react";
import { api } from "../../api/api";

function Register () {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [responseData, setResponseData] = useState();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        /*try {
            const response = await fetch("https://your-api.com/register", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Ошибка регистрации");
            }

            const data = await response.json();
            console.log("Пользователь зарегистрирован:", data);
            // Например, можно сразу залогинить пользователя:
            // login(data.user); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }*/
       // Petición al servidor
        api.post('/user', formData)
        .then(response => {
            console.log(response.data);
            setResponseData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <>
            <FormLayout title={'Registrarse'} url="register" submit="Registrarse" submitFunction={handleSubmit} close={true}>
                <Input type={'text'} label={'Email'} name={'email'} change={handleChange} req={true} auto="email"></Input>
                <Input type={'text'} label={'Nombre'} name={'name'} change={handleChange} req={true} auto="name"></Input>
                <Input type={'password'} label={'Contraseña'} name={'password'} change={handleChange} req={true}></Input>
                <Input type={'password'} label={'Repetir contraseña'} change={handleChange} name={'password2'} req={true}></Input>
            </FormLayout>
        </>
    );
};

export default Register;