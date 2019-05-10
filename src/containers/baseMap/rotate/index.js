/**
 * Created by j_bleach on 2019/5/10 0010.
 */


/*eslint-disable*/
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import "./index.less";

@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            move: true,
            rotate: true,
            lean: true,
            zoom: true,
            click: true
        };
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/rKyKp/embedded/js/dark/",
            title: "地图旋转与倾斜"
        });
    }

    render() {
        return (
            <div className="oprate-bg">
                按住鼠标右键或者CTRL+鼠标左键开始旋转地图</div>
        );
    }
}

export default homePage;
