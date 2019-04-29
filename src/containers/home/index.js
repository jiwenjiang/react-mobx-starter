import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
    }

    render() {
        return (
            <div>
               开干！
            </div>
        );
    }
}

export default homePage;
