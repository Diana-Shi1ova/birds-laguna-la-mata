import "./InputNumber.css";


function InputNumber ({id, name, classAdditional="", label, change=()=>{}, enter=()=>{}, blur=()=>{}, defValue, value, min, max, step}) {
    const validChange = (event) => {
        let value = event.target.value;
        let numericValue = Number(event.target.value);

        if(value!==""){
            if(min && numericValue<min) event.target.value=min;
            if(max && numericValue>max) event.target.value=max;
        }

        change(event);
    }
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter")
            enter(event);
        if (!/[0-9]/.test(event.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key))
            event.preventDefault();
    };

    return (
        <label className={"input-number-container "+classAdditional}>{label}
            <input
                type='number'
                id={id}
                name={name}
                onChange={validChange}
                onKeyDown={handleKeyDown}
                onBlur={blur}
                defaultValue={defValue}
                value={value}
                min={min}
                max={max}
                step={step}
            />
        </label>
    );
};

export default InputNumber;