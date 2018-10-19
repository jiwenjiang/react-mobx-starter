/**
 * Created by j_bleach on 2018/10/8 0008.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";


@inject("mapStore")
@observer
class gotoComponent extends Component {

    goToHere() {
        document.getElementsByClassName("map-routePanel")[0].classList.add("dom-transformY-35");
        document.getElementById("map-goToShare").classList.remove("dom-transformY-30");
        document.getElementById("begin-nav").classList.add("dom-transformY-30");
        this.props.mapStore.confirmEndMarkerFn(true);
    }

    render() {
        const {endMarkerPoint} = this.props.mapStore;
        return (
            <div className="map-goToShare" id="map-goToShare">
                <div className="map-goToShare-head">
                    <div className="map-goToShare-name">
                        <span className="map-goToShare-name-font">{endMarkerPoint && endMarkerPoint.name}</span>
                        {endMarkerPoint && (endMarkerPoint.floor || endMarkerPoint.floor == 0)
                            ? <span className="map-goToShare-name-floor">
                            &emsp;({endMarkerPoint && endMarkerPoint.floor >= 0
                                ? `${endMarkerPoint.floor + 1}F`
                                : `B${-(endMarkerPoint && endMarkerPoint.floor)}`})
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
                    <span>分享位置给好友</span>
                </div>
            </div>
        );
    }
}

export default gotoComponent;