/**
 * Created by j_bleach on 2018/10/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";


@inject("mapStore", "commonStore", "navStore")
@observer
class navPanel extends Component {

    render() {
        const {navRealData} = this.props.navStore;
        return (
            <div className="nav-panel">
                <i className="iconfont icon-futi"></i>
                &emsp;&emsp;
                <span>{navRealData && navRealData.text}</span>
            </div>
        );
    }
}

export default navPanel;