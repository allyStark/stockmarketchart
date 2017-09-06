const React = require('react');

const Graph = require('./graph');
const Panel = require('./panel');

const io = require('socket.io-client')();
window.io = io; 

class Main extends React.Component{
    constructor(){
        super()
        
        this.state = {data: [], valid: true};

        io.on('new user', (data) => {
            this.setState({data: data, valid: true});
        });

        io.on('stock response', (data) => {
            this.setState({data: data, valid: true});
            document.getElementById('submit-button').disabled = false;
        });

        io.on('invalid entry', () => {
            document.getElementById('error-message').innerHTML = " Invalid Stock ";
        });
    }
    componentDidMount() {
        io.emit('new user');
    }
    render() {
        return(
            <div>
                
                <Graph data={this.state.data} />
                <Panel data={this.state.data} />
                <input id="get-stock" className="get-stock" /><button id="submit-button" className="submit-button" onClick={() => {
                    if(document.getElementById('get-stock').value) {
                        io.emit('stock request', document.getElementById('get-stock').value);
                        document.getElementById('get-stock').value = "";
                        document.getElementById('error-message').innerHTML = "";
                        document.getElementById('submit-button').disabled = true;
                        setTimeout(() => {
                            document.getElementById('submit-button').disabled = false;
                        }, 1000);
                    } else {
                        document.getElementById('error-message').innerHTML = " Please enter a stock symbol ";
                    }
                        return false;
                    }}>Get Stock</button>
                <div id="error-message" className="error-message"></div><br/>
                <div className="info"> Enter a stock symbol </div>
            </div> 
        )
    }
}

module.exports = Main; 