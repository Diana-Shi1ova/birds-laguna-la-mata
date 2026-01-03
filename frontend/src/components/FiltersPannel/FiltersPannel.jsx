import "./FiltersPannel.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaTimes } from "react-icons/fa";

function FiltersPannel () {
    const close = (e) => {
        e.preventDefault();
        document.querySelector(".filters-pannel").classList.add('closed');
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
            <Input name={'Especies:'}></Input>
        </form>
    );
}

export default FiltersPannel