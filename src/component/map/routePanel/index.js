/**
 * Created by j_bleach on 2018/10/8 0008.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";


@inject("mapStore")
@observer
class routePanel extends Component {

    render() {
        // const {endMarkerPoint} = this.props.mapStore;
        return (
            <div className="map-routePanel">

            </div>
        );
    }
}

export default routePanel;