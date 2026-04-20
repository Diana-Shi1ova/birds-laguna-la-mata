import "./Button.css";
import { FaBook } from "react-icons/fa";
import {
  useFloating,
  offset,
  flip,
  shift
} from '@floating-ui/react';


function Button ({name="", type="text", func = () => {}, classAdditional="", children, submit=false, tooltip='', ref }) {
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
            ref={ref}
        >
            {children}{name}
        </button>
    );
};

export default Button;