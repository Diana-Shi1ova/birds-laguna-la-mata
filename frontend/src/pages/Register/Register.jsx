import FormLayout from "../../layouts/FormLayout/FormLayout";
import Input from "../../components/Input/Input";
import { useState } from "react";
import { api } from "../../api/api";
import { useTranslation } from "react-i18next";


function Register () {
    const { t } = useTranslation();
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
            newErrors.email = t('register.error.required.email');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t('register.error.format');
        }

        // 2. Name
        if (!formData.name) {
            newErrors.name = t('register.error.required.name');
        }

        // 3. Password
        if (!formData.password) {
            newErrors.password = t('register.error.required.password');
        } else if (formData.password.length < 8) {
            newErrors.password = t('register.error.password.length');
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = t('register.error.password.content');
            }
        }

        // 4. Confirm Password
        if (formData.password !== formData.password2) {
            newErrors.password2 = t('register.error.password.repeat');
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
                if(error.status === 409) setError(t('register.error.exist'));
                else setError(t('sever_error'));
            });
        }
    };

    return (
        <>
            <FormLayout title={t('page.title.register')} url="register" submit={t('regiter.button.register')} submitFunction={handleSubmit} close={true}>
                <p className={error ? ('error-message-general opened') : ('error-message-general')}>{error}</p>
                <Input type={'text'} label={t('regiter.email.label')} name={'email'} change={handleChange} req={true} auto="email" classAdditional={errors.email ? "error" : ""}></Input>
                {errors.email && <p className={errors.email ? ('error-message-general opened') : ('error-message-general')}>{errors.email}</p>}
                <Input type={'text'} label={t('regiter.name.label')} name={'name'} change={handleChange} req={true} auto="name" classAdditional={errors.email ? "error" : ""}></Input>
                {errors.name && <p className={errors.name ? ('error-message-general opened') : ('error-message-general')}>{errors.name}</p>}
                <Input type={'password'} label={t('regiter.password.label')} name={'password'} change={handleChange} req={true} classAdditional={errors.email ? "error" : ""}></Input>
                {errors.password && <p className={errors.password ? ('error-message-general opened') : ('error-message-general')}>{errors.password}</p>}
                <Input type={'password'} label={t('regiter.repeat_password.label')} change={handleChange} name={'password2'} req={true} classAdditional={errors.email ? "error" : ""}></Input>
                {errors.password2 && <p className={errors.password2 ? ('error-message-general opened') : ('error-message-general')}>{errors.password2}</p>}
            </FormLayout>
        </>
    );
};

export default Register;