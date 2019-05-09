/**
 * Created by j_bleach on 2019/5/7 0007.
 */
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import CoolBtn from "component/common/coolBtn";
import gifImg from "assets/images/GIF.gif";
import "../textMarker/index.less";


@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/E4XKp/embedded/js/dark/",
            title: "添加GIF标注"
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
        let el = document.createElement("div");
        let img = document.createElement("img");
        img.src = gifImg;
        img.style.width = "4.3vw";
        el.appendChild(img);
        const {mapObj, mapGl} = this.props.commonStore;
        const center = mapObj.configComponent.mapZone.center.split(",");
        this.marker = new mapGl.Marker(el)
            .setLngLat(center)
            .addTo(mapObj);
    }


    render() {
        return (
            <div className="text-marker">
                <div className="text-marker-title">
                    <CoolBtn clickCb={() => this.setMarker()} text="添加GIF标注"></CoolBtn>
                </div>
            </div>
        );
    }
}

export default homePage;
