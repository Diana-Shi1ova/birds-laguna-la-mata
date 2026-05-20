import "./InputCheckbox.css";


function InputCheckbox ({id, name, classAdditional="", label, change=()=>{}, checked}) {
    return (
        <label className={"input-checkbox-container "+classAdditional}>
            <input
                type='checkbox'
                id={id}
                name={name}
                onChange={change}
                checked={checked}
            />
            {label}
        </label>
    );
};

export default InputCheckbox;