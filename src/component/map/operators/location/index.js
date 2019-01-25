/**
 * Created by j_bleach on 2018/9/28 0028.
 */
import React, {Component} from "react";
import "./index.less";
import {inject, observer} from "mobx-react";

@inject("mapStore", "navStore", "floorStore", "commonStore")
@observer
class location extends Component {

    location() {
        if (this.props.navStore.freeMarker) {
            if (!this.props.navStore.initLocation) {
                if (this.props.floorStore.mapFloor != this.props.navStore.freeMarkerPoint.floor) {
                    this.props.floorStore.listenIbeacon(this.props.mapStore, this.props.navStore.freeMarkerPoint.floor);
                }
                const [currentLon, currentLat] = this.props.navStore.freeMarkerPoint.point;
                this.props.mapStore.mapObj.flyTo({
                    center: [currentLon, currentLat],
                    zoom: 20,
                    speed: 2,
                    curve: 1,
                    bearing: 0,
                    easing(t) {
                        return t;
                    }
                });
                this.props.navStore.updateInitLocation(true);
                if (this.props.navStore.freeMarker) {
                    this.props.navStore.checkFreeMarker(this.props.mapStore);
                }
            }
        } else {
            this.props.commonStore.changeWarningModal("暂无定位");
        }
    }

    render() {
        const {freeMarker, initLocation} = this.props.navStore;
        return <div className="map-operators-location-box" onClick={() => this.location()}>
            <i className={`iconfont ${freeMarker && initLocation
                ? "icon-dingwei1 map-operators-located"
                : "icon-dingwei map-operators-location"}`}></i>
        </div>;
    }
}


export default location;
