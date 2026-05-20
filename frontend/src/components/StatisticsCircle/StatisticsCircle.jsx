import './StatisticsCircle.css';


function StatisticsCircle({label, value}) {
    return(
        <div className='circle-container'>
            <p className='label'>{label}</p>
            <div className='circle'>
                <p>{value}</p>
            </div>
        </div>
    );
}

export default StatisticsCircle;