import "./Input.css";
import ResultsList from "../ResultsList/ResultsList";


function Input ({name, id, classAdditional="", label, type, req=false, auto=null, change=()=>{}, enter=()=>{}, value, defaultValue, placeholder="", resultsList=[], resultsListFunc=()=>{}, ref}) {
    const isControlled = value !== undefined; // controlar value solo si ha llegado
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enter(event);
        }
    };

    return (
        <label className={"input-container "+classAdditional}>{label} {req && ("*")}
            <div className="input-results-container">
                <input
                    ref={ref}
                    type={type}
                    required={req}
                    name={name}
                    id={id}
                    {...(auto ? { autoComplete: auto } : {})} 
                    onChange={change}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    value={value}
                    defaultValue={defaultValue}
                />
                    {resultsList.length>0 && <ResultsList results={resultsList} func={resultsListFunc}></ResultsList>}
            </div>
            
        </label>
    );
};

export default Input;