import "./Input.css";


function Input ({name, classAdditional="", label, type, req=false, auto=null, change=()=>{}}) {
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
            />
        </div>
    );
};

export default Input;