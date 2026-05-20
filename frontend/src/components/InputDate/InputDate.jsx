import "./InputDate.css";


function InputDate ({id, name, classAdditional="", auto, label, req=false, value, change=()=>{}, enter=()=>{}, defValue, placeholder=""}) {
    return (
        <div className={"input-date-container "+classAdditional}>
            <label>{label} {req && ("*")}
                <input
                    type='date'
                    required={req}
                    name={name}
                    id={id}
                    autoComplete={auto}
                    onChange={change}
                    placeholder={placeholder}
                    defaultValue={defValue}
                    value={value}
                />
            </label>
        </div>
    );
};

export default InputDate;