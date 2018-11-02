/**
 * Created by j_bleach on 2018/10/27 0027.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";
import nav from "services/navSDK";

@inject("mapStore", "navStore", "floorStore", "commonStore")
@observer
class navBottom extends Component {

    componentDidMount() {
    }

    exit() {
        if (this.props.navStore.navMode == "real") {
            nav.stopNav();
        }
        if (this.props.navStore.navMode == "sim") {
            nav.stopSim();
        }
        this.props.navStore.completeNav(this.props.mapStore);
        this.props.navStore.moveFreeMarker(this.props.mapStore, this.props.navStore.currentLocation);
    }

    render() {
        const {startMarkerPoint, endMarkerPoint} = this.props.mapStore;
        const {mapFloor} = this.props.floorStore;
        const {navRealData} = this.props.navStore;
        return (
            <div className="begin-nav-container">
                <div className="nav-bottom-box" id="nav-bottom">
                    <div className="map-goToShare-head">
                        <div className="map-goToShare-name">
                            <div className="nav-bottom-floor">
                                <span>({mapFloor < 0 ? `B${mapFloor}` : `${mapFloor + 1}F`})</span>
                                &ensp;{startMarkerPoint && startMarkerPoint.name || "当前位置"}
                            </div>
                            <div className="nav-bottom-notice">
                                距离目的地{navRealData && Math.round(navRealData.leftDistance)}米
                                &emsp;
                            </div>
                        </div>
                        <div className="begin-nav-exit" style={{color: "#999999", top: "4.5vw"}}
                             onClick={() => this.exit()}>
                            <span>退出</span>
                        </div>
                        <hr/>
                    </div>
                    <div className="map-goToShare-share begin-nav-box">
                        <i className="iconfont icon-didian"></i>&nbsp;
                        <span style={{color: "#000000"}}>目的地：</span>
                        <span style={{color: "#0592FF"}}>{endMarkerPoint && endMarkerPoint.name}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default navBottom;