import ReactECharts from "echarts-for-react";
import './Chart.css';


function Chart ({title, options}) {
    return (
        <section className="chart-container">
            <h2>{title}</h2>
                <ReactECharts option={options} />
        </section>
    );
}

export default Chart;