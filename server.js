const compression = require('compression');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const googleFinance = require('google-finance');

//add middleware
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.use(express.static('static'));

let stockData = [];
let todaysDate = getDates();

googleFinance.historical({ 
    symbol: 'AAPL',
    from: todaysDate[1],
    to: todaysDate[0]
    }, (err, quotes) => {
        if(err) throw err;
        stockData.push(quotes);
});

io.on('connection', (socket) => {
    socket.emit('new user', stockData)
    socket.on('disconnect', () => {
    });
    socket.on('stock request', (request) => {
        getStock(request, (data) => {

            if(data.length > 0){
                stockData.push(data);
                io.emit('stock response', stockData);
            } else {
                console.log('invalid');
                io.emit('invalid entry');
            }
            
        });
    });
    socket.on('stock delete', (request) => {
        for(let i = 0; i < stockData.length; i++){ 
            if(stockData[i][0].symbol == request){
                stockData.splice(i,1);
                i = stockData.length;
                io.emit('stock response', stockData);
            }
        }
    });
});
//refresh data every 6 hours
setInterval(() => {
    refreshStocks(stockData, 0, [], (data) => {
            stockData = data;
            io.emit('stock response', stockData);
        });
}, 21600000);

http.listen(process.env.PORT || 3000, () => {
    console.log('Connected to server');
});

//done with months to allow display of monthly results in the future....maybe
function getDates(){
    let currentDate = new Date().toISOString().substring(0, 10);
    let monthsAgo = currentDate.split('-');

    monthsAgo[1] = (Number(monthsAgo[1]) - 12);

    if(monthsAgo[1] < 1){
        monthsAgo[1] = (monthsAgo[1] + 12);
        monthsAgo[0] = (Number(monthsAgo[0]) - 1).toString();
    } 
    
    if (monthsAgo[1] < 10){
        monthsAgo[1] = "0" + monthsAgo[1].toString();
    } else {
        monthsAgo[1] = monthsAgo[1].toString();
    }

    return [currentDate, monthsAgo.join('-')];
}

function getStock(stockName, callback) {

    if(getIndex(stockName, stockData) !== -1){
        return;
    };

    stockName = stockName.toUpperCase();
    let thisDate = getDates();

    googleFinance.historical({  
    symbol: stockName,
    from: thisDate[1], 
    to: thisDate[0]
    }, (err, quotes) => { 
        if(err) throw err;
        callback(quotes);
    });
}

//check and update stock information
function refreshStocks(stockArray, index, newStockArray, callback){

    if(index === stockArray.length){
        callback(newStockArray); 
        return;
    }
    let thisStock = stockArray[index][0].symbol;
    getStock(thisStock, (data) => {
        newStockArray.push(data);
        refreshStocks(stockArray, index + 1, newStockArray, callback);
    });
}

function getIndex(name, thisData){
    let i = 0;
    name = name.toUpperCase();
    while(i < thisData.length){
        if(name === thisData[i][0].symbol.toUpperCase()){
            return i;
        }
        i++
    }
    return -1;
}