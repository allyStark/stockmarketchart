const React = require('react');

const Highcharts = require('highcharts/highstock');

class Graph extends React.Component{
    constructor(props){
        super(props)
    }
    componentWillReceiveProps(newProps){
        returnNewData(newProps, (dates, seriesData) => {
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
                    categories: dates,
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
                series: seriesData
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
    callback(dates, seriesData);
    return;
}