import "./Button.css";
import { FaBook } from "react-icons/fa";


function Button ({name="", type="text", func = () => {}, classAdditional="", children, submit=false, tooltip='' }) {
    return (
        <button
            className={
                ((type === "text" && "normal-button ") ||
                (type === "icon" && "icon-button ")) +
                classAdditional
            }
            onClick={func}
            type={submit ? "submit" : "button"}
            title={tooltip}
        >
            {children}{name}
        </button>
    );
};

export default Button;