import "./Chips.css";
import Button from "../Button/Button";
import { FaRegTimesCircle } from "react-icons/fa";


function Chips ({values=[], remove=() => {}}) {
    return (
        <ul className="chip-list">
            {values.map((name, index) => (
            <li key={index}>
                {name}
                <Button type="icon" func={() => remove(name)}><FaRegTimesCircle /></Button>
            </li>
            ))}
        </ul>
    );
}

export default Chips;