import ReactECharts from "echarts-for-react";
import './Chart.css';


function Chart ({title, options}) {
    return (
        <section className="chart-container">
            <h2>{title}</h2>
            {/* <div style={{ width: "100%", height: "350px" }}> */}
                <ReactECharts option={options} />
            {/* </div> */}
        </section>
    );
}

export default Chart;