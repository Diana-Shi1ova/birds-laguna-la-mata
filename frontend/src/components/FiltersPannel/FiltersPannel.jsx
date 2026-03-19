import "./FiltersPannel.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import Chips from "../Chip/Chips";
import { useEffect } from "react";
import { useBirds } from "../../contexts/BirdsProvider";
import { api } from "../../api/api";


function FiltersPannel () {
    const [formData, setFormData] = useState({
            species: [],
            name: "",
            date: new Date(),
            sources: [] 
        });

    const { area } = useBirds();

    
    const close = (e) => {
        e.preventDefault();
        document.querySelector(".filters-pannel").classList.add('closed');
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onEnter = (e) => {
        e.preventDefault();
        if(e.target.name === 'name'){ // Añadir elementos sin repetir
            const value = e.target.value.trim();
            e.target.value="";

            if (value === "") return;

            setFormData(prev => ({
                ...prev,
                species: prev.species.includes(value)
                    ? prev.species
                    : [...prev.species, value]
            }));
        }
        else
            setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const deleteSpecieFromList = (value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            species: prevFormData.species.filter(species => species !== value)
        }));
    }

    const clearSpecieFromList = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            species: []
        }));
    }

    // Hacer petición del historial en una fecha
    useEffect(() => {
        // Petición al servidor
        api.get('/eBird/history', {
            params: {
                hotspot: area,
                date: formatDate(formData.date)
            }
        })
        .then(response => {
            console.log(response.data);
            // setBirds(response.data);
            // setFilteredBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [formData, area]);

    // Formatear fecha al formato aaaa/mm/dd
    function formatDate(date = new Date()) {
        const d = new Date(date);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        return `${yyyy}/${mm}/${dd}`;
    }


    return (
        <form className="filters-pannel closed">
            <Button
                type="icon"
                classAdditional="close-button"
                func={(e) => close(e)}
            >
                <FaTimes />
            </Button>
            <h2>Filtros</h2>
            <Input label={'Especies:'} name={'name'} placeholder={'Nombre común o científico'} change={onChange} enter={onEnter}></Input>
            {/* <ul>
                {formData.species.length > 0 && (
                    formData.species.map((sp, index) => (
                    <li key={index}>
                        {sp}
                        <Button type="icon">X</Button>
                    </li>
                    ))
                )}
            </ul> */}
            <Chips values={formData.species} remove={deleteSpecieFromList}></Chips>
            <div className="btns-horizontal">
                <Button func={clearSpecieFromList}>Limpiar</Button>
                <Button>Solo favoritos</Button>
            </div>
            
            <Input label={'Fecha:'} name={'date'} type={'date'} change={onChange}></Input>
            <p>Fuente:</p>
            {/* Añadir botones con información */}
            <Input label={'eBird'} type={'checkbox'}></Input>
            <Input label={'Raspberries'} type={'checkbox'}></Input>
        </form>
    );
}

export default FiltersPannel