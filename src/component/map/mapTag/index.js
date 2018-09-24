/**
 * Created by j_bleach on 2018/9/24.
 */
import React, {PureComponent} from "react";
import "./index.less";

class mapTag extends PureComponent {

    render() {
        return (
            <div className="map-tag-box">
                <div className="map-tag-icon-box">
                    <svg className="icon-svg" aria-hidden="true">
                        <use xlinkHref="#icon-search-map"></use>
                    </svg>
                    <i className="iconfont icon-testa"></i>
                </div>
                <div className="map-tag-text-box"></div>
            </div>
        );
    }
}

export default mapTag;