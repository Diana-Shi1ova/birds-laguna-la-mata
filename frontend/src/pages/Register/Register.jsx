import FormLayout from "../../layouts/FormLayout/FormLayout";
import Input from "../../components/Input/Input";
import { useState } from "react";
import { api } from "../../api/api";

function Register () {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    const [responseData, setResponseData] = useState();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // 1. Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Campo "Email" es obligatorio';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Formato incorrecto";
        }

        // 2. Name
        if (!formData.name) {
            newErrors.name = 'Campo "Nombre" es obligatorio';
        }

        // 3. Password
        if (!formData.password) {
            newErrors.password = 'Campo "Contraseña" es obligatorio';
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener como mínimo 8 caracteres";
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = "La contraseña debe contener mayúscula, minúscula, número y símbolo";
            }
        }

        // 4. Confirm Password
        if (formData.password !== formData.password2) {
            newErrors.password2 = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[e.target.name];
            return newErrors;
        });
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
        if (validate()) {
            api.post('/user', formData)
            .then(response => {
                console.log(response.data);
                setResponseData(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.response.data.message);
            });
        }
    };

    return (
        <>
            <FormLayout title={'Registrarse'} url="register" submit="Registrarse" submitFunction={handleSubmit} close={true}>
                <p className={error ? ('error-message-general opened') : ('error-message-general')}>{error}</p>
                <Input type={'text'} label={'Email'} name={'email'} change={handleChange} req={true} auto="email" classAdditional={errors.email ? "error" : ""}></Input>
                {errors.email && <p className={errors.email ? ('error-message-general opened') : ('error-message-general')}>{errors.email}</p>}
                <Input type={'text'} label={'Nombre'} name={'name'} change={handleChange} req={true} auto="name" classAdditional={errors.email ? "error" : ""}></Input>
                {errors.name && <p className={errors.name ? ('error-message-general opened') : ('error-message-general')}>{errors.name}</p>}
                <Input type={'password'} label={'Contraseña'} name={'password'} change={handleChange} req={true} classAdditional={errors.email ? "error" : ""}></Input>
                {errors.password && <p className={errors.password ? ('error-message-general opened') : ('error-message-general')}>{errors.password}</p>}
                <Input type={'password'} label={'Repetir contraseña'} change={handleChange} name={'password2'} req={true} classAdditional={errors.email ? "error" : ""}></Input>
                {errors.password2 && <p className={errors.password2 ? ('error-message-general opened') : ('error-message-general')}>{errors.password2}</p>}
            </FormLayout>
        </>
    );
};

export default Register;