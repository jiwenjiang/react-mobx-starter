/**
 * Created by j_bleach on 2018/10/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";
import elevatorDown from "assets/img/elevator_down.png";
import elevatorUp from "assets/img/elevator_up.png";
import stairsDown from "assets/img/staris_down.png";
import stairsUp from "assets/img/staris_up.png";
import {toJS} from "mobx";


@inject("navStore")
@observer
class navPanel extends Component {

    renderIcon(navRealData) {
        if (navRealData.text) {
            let icon = {
                1: "icon-zhihang",
                2: "icon-zuozhuan",
                3: "icon-youzhuan",
                4: "icon-zhihang",
                6: "icon-dianti",
                7: "icon-louti"
            }[navRealData.turn];
            return icon || "";
        }
        return "";
    }

    renderImg(navRealData) {
        if (navRealData.inElevator === "elevator") {
            return navRealData.text.includes("下") ? elevatorDown : elevatorUp;
        }
        return navRealData.text.includes("下") ? stairsDown : stairsUp;
    }

    render() {
        const {navRealData} = this.props.navStore;

        return (
            <div>
                {
                    navRealData && navRealData.text && <div className="nav-panel">
                        <i className={`iconfont ${navRealData && this.renderIcon(navRealData)}`}></i>
                        &emsp;&emsp;
                        <span>{navRealData && navRealData.text}</span>
                    </div>
                }
                {
                    navRealData && navRealData.inElevator && <div className="nav-elevator-box">
                        <img src={this.renderImg(navRealData)} alt=""/>
                        {/*<img src={navRealData.inElevator == "elevator" ? elevatorSrc : stairsSrc} alt=""/>*/}
                    </div>
                }
            </div>
        );
    }
}

export default navPanel;
