import "./InputRadiobutton.css";


function InputRadiobutton ({id, name="", value, classAdditional="", label, change=()=>{}, checked=false}) {
    return (
        <div className="input-radio-container">
                <input
                    type='radio'
                    id={id}
                    className={classAdditional}
                    onChange={change}
                    checked={checked}
                    name={name}
                    value={value}
                />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};


export default InputRadiobutton;