/**
 * Created by j_bleach on 2018/10/8 0008.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import routeImg from "assets/img/route.png";
import "./index.less";


@inject("mapStore", "commonStore", "navStore")
@observer
class routePanel extends Component {

    reRoute(v) {
        this.props.navStore.changeRoadType(v);
        if (v === "car") {
            this.props.navStore.changePriorityType("stairs");
        }else {
            this.props.navStore.changePriorityType("elevator");
        }
    }

    routeFocus(v) {
        this.props.commonStore.changeSearchStatus(v);
        this.props.commonStore.changeSearchHistory(true);
    }

    changePersonType(personType) {
        this.props.navStore.changePriorityType(personType)
    }

    render() {
        const {endMarkerPoint, startMarkerPoint} = this.props.mapStore;
        const {navRoadType, navPriorityType} = this.props.navStore;
        return (
            <div className="map-routePanel">
                <div className="map-routePanel-head">
                    <img src={routeImg} alt=""/>
                    <div className="map-routePanel-input">
                        <input type="text" readOnly onFocus={() => this.routeFocus("start")}
                               placeholder="请选择起点" value={startMarkerPoint && startMarkerPoint.name || ""}/>
                        <input type="text" readOnly onFocus={() => this.routeFocus("end")}
                               value={endMarkerPoint && endMarkerPoint.name || ""}/>
                    </div>
                </div>
                <div className="map-routePanel-way">
                    <div className="map-routePanel-person">
                        <button
                            onClick={() => this.reRoute("foot")}
                            className={`map-routePanel-person-btn ${navRoadType === "foot" ? "active-routePanel" : ""}`}>
                            <i className="iconfont icon-hangren_"></i>&nbsp;<span>人</span>
                        </button>
                        <span className="map-routePanel-way-type" onClick={() => this.changePersonType("elevator")}
                              style={navRoadType === "foot" && navPriorityType === "elevator" ? {color: "#33CCCC"} : {color: "#D0CECE"}}><i
                            className="iconfont icon-dianti" style={{fontSize: "3vw"}}></i>&nbsp;电梯</span>
                        <span className="map-routePanel-way-type" onClick={() => this.changePersonType("stairs")}
                              style={navRoadType === "foot" && navPriorityType === "stairs" ? {color: "#33CCCC"} : {color: "#D0CECE"}}
                        ><i
                            className="iconfont icon-futi"></i>&nbsp;楼梯/扶梯</span>
                    </div>
                    <div className="map-routePanel-car">
                        <button
                            onClick={() => this.reRoute("car")}
                            className={`map-routePanel-person-btn ${navRoadType === "car" ? "active-routePanel" : ""}`}>
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