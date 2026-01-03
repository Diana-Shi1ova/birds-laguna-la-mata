import "./Button.css";
import { FaBook } from "react-icons/fa";


function Button ({name="", type="text", func = () => {}, classAdditional="", children }) {
    return (
        <button
            className={
                ((type === "text" && "normal-button ") ||
                (type === "icon" && "icon-button ")) +
                classAdditional
            }
            onClick={func}
        >
            {children}{name}
        </button>
    );
};

export default Button;