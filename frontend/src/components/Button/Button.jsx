import "./Button.css";
import { FaBook } from "react-icons/fa";
import {
  useFloating,
  offset,
  flip,
  shift
} from '@floating-ui/react';


function Button ({name="", type="text", colorType="primary", func = () => {}, classAdditional="", children, submit=false, tooltip='', ref, disabled=false }) {
    return (
        <button
            className={
                ((type === "text" && "normal-button-"+ colorType + " ") ||
                (type === "icon" && "icon-button ")) +
                classAdditional
            }
            onClick={func}
            type={submit ? "submit" : "button"}
            title={tooltip}
            ref={ref}
            disabled={disabled}
        >
            {children}{name}
        </button>
    );
};

export default Button;