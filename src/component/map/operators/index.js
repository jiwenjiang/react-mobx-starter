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
import LoadingComponent from "component/common/loading";


@inject("mapStore", "commonStore")
@observer
class operatorsComponent extends Component {

    render() {
        const {projectType} = this.props.commonStore;
        const {mapObj, mapFloor = 1} = this.props.mapStore;
        const searchProps = {
            extendStyle: "extendSearchStyle",
            focusSearch: () => {
                this.props.commonStore.changeSearchStatus("end");
                this.props.commonStore.changeSearchHistory(true);
                this.props.commonStore.changeMapToSearch(true);
            },
            backClassName: "map-page",
            goBack: () => {
                this.props.commonStore.changeMapToSearch(true);
                if (this.props.mapStore.endMarkerPoint) {
                    this.props.mapStore.removeMarker("end");
                } else {
                    this.props.commonStore.changeSearchStatus("end");
                }
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
                {this.props.commonStore.loadingStatus ? <LoadingComponent/> : <div></div>}
            </div>
        );
    }
}

export default operatorsComponent;