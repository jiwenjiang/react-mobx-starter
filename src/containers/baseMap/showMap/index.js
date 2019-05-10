/**
 * Created by j_bleach on 2019/5/10 0010.
 */

/*eslint-disable*/
import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/9KyKp/embedded/js,html/dark/",
            title: "基础地图显示"
        });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default homePage;
