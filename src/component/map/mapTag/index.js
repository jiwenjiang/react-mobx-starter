/**
 * Created by j_bleach on 2018/9/24.
 */
import React, {Component} from "react";
import imgSrc from "assets/img/searchMap.png";
import "./index.less";
import {inject, observer} from "mobx-react";

@inject("commonStore")
@observer
class mapTag extends Component {

    entryMap() {
        this.props.commonStore.changeSearchStatus(false);
    }

    render() {
        return (
            <div className="map-tag-box">
                <img src={imgSrc} alt="" onClick={() => this.entryMap()}/>
            </div>
        );
    }
}

export default mapTag;