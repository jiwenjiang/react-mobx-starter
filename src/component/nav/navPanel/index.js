/**
 * Created by j_bleach on 2018/10/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";


@inject("navStore")
@observer
class navPanel extends Component {

    renderIcon(navRealData) {
        if (navRealData.text) {
            let icon = {
                1: "icon-zhihang",
                2: "icon-zuozhuan",
                3: "icon-youzhuan",
                4: "icon-zhihang"
            }[navRealData.turn];
            return icon || "";
        }
        return "";
    }

    render() {
        const {navRealData} = this.props.navStore;
        return (
            <div className="nav-panel">
                <i className={`iconfont ${navRealData && this.renderIcon(navRealData)}`}></i>
                &emsp;&emsp;
                <span>{navRealData && navRealData.text}</span>
            </div>
        );
    }
}

export default navPanel;