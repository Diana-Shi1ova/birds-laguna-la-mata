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
/*function InputRadiobutton ({id, name, value, classAdditional="", label, change=()=>{}, checked}) {
    const inputProps = {
        type: 'radio',
        id: id,
        name: name,
        value: value,
        // className: classAdditional,
        onChange: change
    };

    // Añadir defaultChecked solo si checked es true
    if (checked) {
        inputProps.defaultChecked = true;
    }

    return (
        <label className={"input-radio-container  "+classAdditional}>
            <input {...inputProps} />
            {label}
        </label>
    );
}*/


export default InputRadiobutton;