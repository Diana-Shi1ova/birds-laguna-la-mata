import "./Input.css";


function Input ({name, id, classAdditional="", label, type, req=false, auto=null, change=()=>{}, enter=()=>{}, value, defaultValue, placeholder=""}) {
    const isControlled = value !== undefined; // controlar value solo si ha llegado
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enter(event);
        }
    };

    return (
        <label className={"input-container "+classAdditional}>{label} {req && ("*")}
            <input
                type={type}
                required={req}
                name={name}
                id={id}
                // className={classAdditional}
                // autoComplete={auto}
                {...(auto ? { autoComplete: auto } : {})} 
                onChange={change}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                // {...(isControlled
                //     ? { value }
                //     : { defaultValue: "" })}
                defaultValue={defaultValue}
            />
        </label>
    );
};

export default Input;