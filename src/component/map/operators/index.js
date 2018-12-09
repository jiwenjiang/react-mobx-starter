/**
 * Created by j_bleach on 2018/9/28 0028.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import Logo from "./logo";
import Direction from "./direction";
import Location from "./location";
import Zoom from "./zoom";
import Scale from "./scale";
import Floor from "./floor";
import SearchInput from "component/search/searchInput";
import "./index.less";
import LocationLoading from "component/common/loading";
import wx from "weixin-js-sdk";


@inject("mapStore", "commonStore")
@observer
class operatorsComponent extends Component {

    render() {
        const {projectType} = this.props.commonStore;
        const {mapObj, mapFloor = 1} = this.props.mapStore;
        const searchProps = {
            extendStyle: "extendSearchStyle",
            focusSearch: () => {
                // 为了区分初始显示地图or搜索，转换关键词
                if (projectType == "car") {
                    document.getElementById("searchInput").setAttribute("readOnly", "true");
                    this.props.commonStore.changeProjectType("Car");
                }
                this.props.commonStore.changeSearchStatus("end");
                this.props.commonStore.changeSearchHistory(true);
                this.props.commonStore.changeMapToSearch(true);
            },
            backClassName: "map-page",
            goBack: () => {
                if (this.props.mapStore.endMarkerPoint) {
                    this.props.mapStore.removeMarker("end");
                } else {
                    this.props.commonStore.changeSearchStatus("end");
                    if (projectType != "Addressing") {
                        wx.miniProgram.reLaunch({
                            url: "../index/index"
                        });
                    }
                }
                setTimeout(() => {
                    this.props.commonStore.changeSearchHistory(false);
                });
            }
        };

        return (
            <div className="map-operators">
                {Logo(projectType)}
                {mapObj && <Direction map={mapObj}></Direction>}
                {mapObj && <Scale map={mapObj} measurement="km"></Scale>}
                {mapObj && <Floor map={mapObj} floor={mapFloor}></Floor>}
                <Location></Location>
                {mapObj && Zoom(mapObj)}
                <div className="map-operators-search">
                    <SearchInput {...searchProps}></SearchInput>
                </div>
                {this.props.commonStore.LocationLoading ? <LocationLoading text={`定位中...`}/> : <div></div>}
            </div>
        );
    }
}

export default operatorsComponent;
