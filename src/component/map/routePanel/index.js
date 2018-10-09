/**
 * Created by j_bleach on 2018/10/8 0008.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import routeImg from "assets/img/route.png";
import "./index.less";


@inject("mapStore")
@observer
class routePanel extends Component {
    state = {
        currentType: "person",
        personType: 1 // 1电梯 2扶梯
    };

    reRoute(v) {
        this.setState({
            currentType: v
        });
    }

    render() {
        const {endMarkerPoint, startMarkerPoint} = this.props.mapStore;
        const {currentType, personType} = this.state;
        return (
            <div className="map-routePanel">
                <div className="map-routePanel-head">
                    <img src={routeImg} alt=""/>
                    <div className="map-routePanel-input">
                        <input type="text" readOnly placeholder="请选择起点" value={startMarkerPoint && startMarkerPoint.name || ""}/>
                        <input type="text" readOnly value={endMarkerPoint && endMarkerPoint.name || ""}/>
                    </div>
                </div>
                <div className="map-routePanel-way">
                    <div className="map-routePanel-person">
                        <button
                            onClick={() => this.reRoute("person")}
                            className={`map-routePanel-person-btn ${currentType === "person" ? "active-routePanel" : ""}`}>
                            <i className="iconfont icon-hangren_"></i>&nbsp;<span>人</span>
                        </button>
                        <span className="map-routePanel-way-type"
                              style={currentType === "person" && personType === 1 ? {color: "#33CCCC"} : {color: "#D0CECE"}}><i
                            className="iconfont icon-dianti" style={{fontSize: "3vw"}}></i>&nbsp;电梯</span>
                        <span className="map-routePanel-way-type"
                              style={currentType === "person" && personType === 2 ? {color: "#33CCCC"} : {color: "#D0CECE"}}
                        ><i
                            className="iconfont icon-futi"></i>&nbsp;楼梯/扶梯</span>
                    </div>
                    <div className="map-routePanel-car">
                        <button
                            onClick={() => this.reRoute("car")}
                            className={`map-routePanel-person-btn ${currentType === "car" ? "active-routePanel" : ""}`}>
                            <i className="iconfont icon-che-"></i>&nbsp;<span
                        >车</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default routePanel;