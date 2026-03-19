import "./Input.css";


function Input ({name, classAdditional="", label, type, req=false, auto=null, change=()=>{}, enter=()=>{}, value, placeholder=""}) {
    const isControlled = value !== undefined; // controlar value solo si ha llegado
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enter(event);
        }
    };

    return (
        <div className="input-container">
            <p>{label} {req && ("*")}</p>
            <input
                type={type}
                required={req}
                name={name}
                className={classAdditional}
                autoComplete={auto}
                onChange={change}
                onKeyDown={handleKeyDown}
                // value={value ?? ""}
                placeholder={placeholder}
                {...(isControlled
                    ? { value }
                    : { defaultValue: "" })}
            />
        </div>
    );
};

export default Input;