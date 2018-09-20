import React, {Component} from 'react';
import route from './router';
import './assets/style/index.less';


class App extends Component {
    render() {
        return (
            // style={{backgroundColor:"#000"}}
            <div className="App" >
                {route}
            </div>
        );
    }
}

export default App;
