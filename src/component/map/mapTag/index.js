/**
 * Created by j_bleach on 2018/9/24.
 */
import React, {PureComponent} from "react";
import imgSrc from "assets/img/searchMap.png";
import "./index.less";

class mapTag extends PureComponent {

    render() {
        return (
            <div className="map-tag-box">
                <img src={imgSrc} alt=""/>
            </div>
        );
    }
}

export default mapTag;