const React = require('react');
const io = require('socket.io-client')();

const Highcharts = require('highcharts/highstock');

let chartData = [];
let chartDates = [];

class Graph extends React.Component{
    constructor(props){
        super(props)
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

//put google finance data into chart-friendly form!
function returnNewData(data, callback){
    if(chartData.length === 0 || chartData.length === data.data.length){
        //create chart or refresh all stocks with updated data
        let dates = [];
        let seriesData = [];
        //i will always be 0 except on refresh
        for(let i = 0; i < data.data.length; i++){
            let stockPrice = [];
            for(let j = 0; j < data.data[i].length; j++){
                if(i === 0){
                    let thisDate = data.data[i][j].date.split("T");
                    dates.push(thisDate[0]);
                }
                stockPrice.push(data.data[i][j].open);
            }
            let thisObj = {
                name: data.data[i][0].symbol,
                data: stockPrice
            }
            seriesData.push(thisObj);
        }
        chartData = seriesData;
        chartDates = dates;
        callback();
    } else if (chartData.length < data.data.length){
        //add stock to chart
        let thisData = data.data[data.data.length - 1];
        let stockPrice = [];

        for(let i = 0; i < thisData.length; i++){
            stockPrice.push(thisData[i].open);
        }
        let thisObj = {
            name: thisData[0].symbol,
            data: stockPrice,
            _colorIndex: chartData.length % 21,
            _symbolIndex: chartData.length % 4
        } 
        chartData.push(thisObj);
        callback();
    } else if (chartData.length > data.data.length){
        //remove stock from chart
        let i = 0;
        while(i < chartData.length){
            let thisIndex = getIndex(chartData[i].name, data.data);
            if(thisIndex === -1){
                chartData.splice(i, 1);
                realignIndex();
                callback();
                i = chartData.length;
            }
            i++;
        }
    }
}

function getIndex(name, newData){
    let i = 0;
    while(i < newData.length){
        if(name === newData[i][0].symbol){
            return i;
        }
        i++
    }
    return -1;
}
//reset the symbol and color indexes so the chart can display properly
function realignIndex(){
    for(let i = 0; i < chartData.length; i++){
        chartData[i]._colorIndex = i % 21;
        chartData[i]._symbolIndex = i % 4;
    }
}