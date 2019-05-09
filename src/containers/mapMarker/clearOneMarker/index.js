/**
 * Created by j_bleach on 2019/5/7 0007.
 */
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import CoolBtn from "component/common/coolBtn";
import locImg from "assets/images/loc.png";
import "../textMarker/index.less";

@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/hKyKp/embedded/all/dark/",
            title: "清除指定标注"
        });
        this.setMarker();
    }

    componentWillUnmount() {
        if (this.marker1) {
            this.marker1.remove();
        }
        if (this.marker2) {
            this.marker2.remove();
        }
    }

    setMarker() {
        const {mapObj, mapGl} = this.props.commonStore;
        const center = mapObj.configComponent.mapZone.center.split(",");

        let el = document.createElement("div");
        let img = document.createElement("img");
        img.src = locImg;
        img.style.width = "3.3vw";
        el.style.marginTop = "50px";
        el.appendChild(img);
        this.marker1 = new mapGl.Marker(el)
            .setLngLat(center)
            .addTo(mapObj);

        let el2 = document.createElement("div");
        let img2 = document.createElement("img");
        img2.src = locImg;
        img2.style.width = "3.3vw";
        el2.appendChild(img2);
        this.marker2 = new mapGl.Marker(el2)
            .setLngLat(center)
            .addTo(mapObj);
    }

    clearMarker(v) {
        if (v == 1 && this.marker1) {
            this.marker1.remove();
            this.marker1 = null;
        }
        if (v == 2 && this.marker2) {
            this.marker2.remove();
            this.marker2 = null;
        }
    }


    render() {
        return (
            <div className="text-marker">
                <div className="text-marker-title">
                    <CoolBtn clickCb={() => this.clearMarker(1)} text="清除标注1"></CoolBtn>
                    <span style={{width: 50}}>&nbsp;</span>
                    <CoolBtn clickCb={() => this.clearMarker(2)} text="清除标注2"></CoolBtn>
                </div>
            </div>
        );
    }
}

export default homePage;
