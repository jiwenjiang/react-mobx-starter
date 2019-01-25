/**
 * Created by j_bleach on 2018/10/8 0008.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import wx from "weixin-js-sdk";
import "./index.less";
import {toJS} from "mobx";

@inject("mapStore", "commonStore", "navStore")
@observer
class gotoComponent extends Component {
    constructor() {
        super();
        this.navigateToMiniApp = this.navigateToMiniApp.bind(this);
    }

    goToHere() {
        document.getElementsByClassName("map-routePanel")[0].classList.add("dom-transformY-35");
        document.getElementById("map-goToShare").classList.remove("dom-transformY-30");
        document.getElementById("begin-nav").classList.add("dom-transformY-30");
        if (this.props.navStore.freeMarker) {
            this.props.mapStore.confirmMarker("start", {
                ...this.props.navStore.freeMarkerPoint,
                source: this.props.navStore.currentLocation && this.props.navStore.currentLocation.locType == "gps" ? "outdoor" : "indoor"
            }, true);
            this.props.mapStore.confirmStartMarkerFn();
        } else {
            this.props.mapStore.confirmEndMarkerFn(true);
            this.props.mapStore.confirmMarker();
        }
    }

    navigateToMiniApp() {
        const h5Message = toJS(this.props.mapStore.endMarkerPoint);
        h5Message.mapId = this.props.mapStore.mapId;
        h5Message.type = this.props.commonStore.projectType;
        wx.miniProgram.navigateTo({
            url: `../share/share?h5Message=${JSON.stringify(h5Message)}`
        });
    }

    render() {
        const {endMarkerPoint, endMarker} = this.props.mapStore;
        return (
            <div className="map-goToShare" id="map-goToShare">
                {endMarker && <div>
                    <div className="map-goToShare-head">
                        <div className="map-goToShare-name">
                            <span className="map-goToShare-name-font">{endMarkerPoint && endMarkerPoint.name}</span>
                            {endMarkerPoint && (endMarkerPoint.floor || endMarkerPoint.floor == 0)
                                ? <span className="map-goToShare-name-floor">
                            &emsp;({endMarkerPoint && endMarkerPoint.floor >= 0
                                    ? `${Number(endMarkerPoint.floor) + 1}F`
                                    : `B${-(endMarkerPoint && Number(endMarkerPoint.floor))}`})
                        </span>
                                : <span className="map-goToShare-name-floor">
                            &emsp;(室外)
                        </span>}
                        </div>
                        <hr/>
                        <div>
                            <button className="map-goToShare-btn" onClick={() => this.goToHere()}>
                                {/*<i className="iconfont icon-quzheli"></i>*/}
                                去这里
                            </button>
                        </div>
                    </div>
                    <div className="map-goToShare-share">
                        <span onClick={this.navigateToMiniApp}>分享位置给好友</span>
                    </div>
                </div>}
            </div>
        );
    }
}

export default gotoComponent;
