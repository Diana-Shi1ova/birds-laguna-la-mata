import "./InputSelect.css";


function InputSelect ({id, name, selected, classAdditional="", label, change=()=>{}, options=[]}) {
    return (
        // <label className="select-container">{label}
        //     <select
        //         className={"custom-select "+classAdditional}
        //         id={id}
        //         onChange={change}
        //     >
        //         {children}
        //     </select>
        // </label>
         <label className={"select-container " + classAdditional}>
            {label}
            <select
                className="custom-select"
                id={id}
                name={name}
                value={selected}
                onChange={change}
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