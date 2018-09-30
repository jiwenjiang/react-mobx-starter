/**
 * Created by j_bleach on 2018/9/29 0029.
 */

import React from "react";
import "./index.less";

const zoomTo = (map, type) => {
    map[type === "increases" ? "zoomIn" : "zoomOut"]();
};

const zoom = (map) => <div className="map-operators-zoom-box">
    <i className="iconfont icon-jia map-operators-zoom" onClick={() => zoomTo(map, "increases")}></i>
    <i className="iconfont icon-jian map-operators-zoom" onClick={() => zoomTo(map, "decreases ")}></i>
</div>;

export default zoom;