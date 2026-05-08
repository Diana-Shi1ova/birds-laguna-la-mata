import './Spinner.css';


function Spinner({classAdditional}) {
    return(
        <div className={'spinner-wrapper '+classAdditional}>
            <div className="spinner"></div>
        </div>
    );
}

export default Spinner;