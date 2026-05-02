import "./InputSelect.css";


function InputSelect ({id, name, selected, classAdditional="", label, change=()=>{}, options=[], title=""}) {
    return (
         <label className={"select-container " + classAdditional}>
            {label}
            <select
                className="custom-select"
                id={id}
                name={name}
                value={selected}
                onChange={change}
                title={title}
            >
                {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
                ))}
            </select>
        </label>
    );
}


export default InputSelect;