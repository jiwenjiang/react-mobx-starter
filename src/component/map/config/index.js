/**
 * Created by j_bleach on 2018/9/27 0027.
 */
import React, {PureComponent} from "react";
import imgSrc from "assets/img/config.png";
import {Link} from "react-router-dom";
import "./index.less";

class mapTag extends PureComponent {

    render() {
        return (
            <div className="map-config-box">
                <Link to="/config">
                    <img src={imgSrc} alt=""/>
                </Link>
            </div>
        );
    }
}

export default mapTag;