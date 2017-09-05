const React = require('react');

class Panel extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
    }
    createButtons(){
        let dataArr = this.props.data;
        let buttonArr = [];
        let colorArr = ['magenta', 'lightgreen', 'salmon', 'lightblue', 'yellow', 'orange', 'pink', 'gold', 'fushia', 'silver', 'olive', 'teal', 'lime', 'aqua', 'chocolate', 'CornflowerBlue', 'Crimson', 'Cyan', 'HoneyDew', 'Lavender', 'Khaki', 'LightSalmon'];
        for(let i = 0; i < dataArr.length; i++){
            let currentStock = dataArr[i][0].symbol;
            let currentColor = colorArr[i];
            buttonArr.push(<div className="stock-button" key={currentStock + 'key'} onClick={() => {
                    io.emit('stock delete', currentStock)
                }}><div className={currentColor + ' text'}> {currentStock} </div></div>);
        };
        return buttonArr;
    }
    render() {
        return(
        <div>
            {this.createButtons()}
        </div>    
        )
    }
}

module.exports = Panel;