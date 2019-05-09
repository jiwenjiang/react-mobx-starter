/**
 * Created by j_bleach on 2019/5/7 0007.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import CoolBtn from "component/common/coolBtn";
import "./index.less";


@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/PSXKp/embedded/js/dark/",
            title: "添加文本标注"
        });
    }

    componentWillUnmount() {
        if (this.marker) {
            this.marker.remove();
        }
    }

    setMarker() {
        if (this.marker) {
            return false;
        }
        const {mapObj, mapGl} = this.props.commonStore;
        const center = mapObj.configComponent.mapZone.center.split(",");
        let el = document.createElement("div");
        el.style.width = "100px";
        el.style.height = "20px";
        el.innerText = "文本信息";
        this.marker = new mapGl.Marker(el)
            .setLngLat(center)
            .addTo(mapObj);
    }

    render() {
        return (
            <div className="text-marker">
                <div className="text-marker-title">
                    <CoolBtn clickCb={() => this.setMarker()} text="添加文本标注"></CoolBtn>
                </div>
            </div>
        );
    }
}

export default homePage;
