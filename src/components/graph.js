const React = require('react');

const Highcharts = require('highcharts/highstock');

let chartData = [];
let chartDates = [];

class Graph extends React.Component{
    constructor(props){
        super(props)

        this.state = {};
    }
    componentWillReceiveProps(newProps){
        returnNewData(newProps, () => {

        let chart = Highcharts.chart('chart-container', {
                chart: {
                    type: 'line', 
                    backgroundColor: '#1E1E1E',
                },
                legend: { itemHoverStyle: { color: 'whitesmoke' }, itemStyle: { color: 'gainsboro' }},
                colors: ['magenta', 'lightgreen', 'salmon', 'lightblue', 'yellow', 'orange', 'pink', 'gold', 'fushia', 'silver', 'olive', 'teal', 'lime', 'aqua', 'chocolate', 'CornflowerBlue', 'Crimson', 'Cyan', 'HoneyDew', 'Lavender', 'Khaki', 'LightSalmon'],
                title: {
                    text: 'Compare Stock Prices',
                    style: {
                        color: 'gainsboro'
                    }
                },
                xAxis: {
                    categories: chartDates,
                    labels: { style: { color: 'gainsboro'} }
                },
                yAxis: { 
                    gridLineColor: '#555555',
                    labels: { style: { color: 'gainsboro'} },
                    title: {
                        text: 'Price($)',
                        style: { color: 'gainsboro'}
                    }
                },
                series: chartData
            });
        });
    }
    render() { 
        return(
            <div id="chart-container" className="chart-div">
            </div> 
        )
    } 
}

module.exports = Graph; 

function returnNewData(data, callback){
    if(chartData.length === 0 || chartData.length === data.data.length){
        let dates = [];
        let seriesData = [];

        for(let i = 0; i < data.data.length; i++){
            let stockName = data.data[i][0].symbol;
            let stockPrice = [];
            for(let j = 0; j < data.data[i].length; j++){
                if(i === 0){
                    let thisDate = data.data[i][j].date.split("T");
                    dates.push(thisDate[0]);
                }
                stockPrice.push(data.data[i][j].open);
            }
            let thisObj = {
                name: stockName,
                data: stockPrice
            }
            seriesData.push(thisObj);
        }
        chartData = seriesData;
        chartDates = dates;
        callback();
    } else if (chartData.length < data.data.length){
        let thisData = data.data[data.data.length - 1];
        let stockName = thisData[0].symbol;
        let stockPrice = [];

        for(let i = 0; i < thisData.length; i++){
            stockPrice.push(thisData[i].open);
        }
        let thisObj = {
            name: stockName,
            data: stockPrice,
            _colorIndex: chartData.length % 21,
            _symbolIndex: chartData.length % 4
        } 
        chartData.push(thisObj);
        callback();
    } else if (chartData.length > data.data.length){
        console.log('stock removed');
        console.log(data.data[0][0].symbol);
        console.log(chartData[0].name);
        for(let i = 0; i < chartData.length;i++){
            
        }
    }
}