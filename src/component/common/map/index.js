/**
 * Created by j_bleach on 2019/5/8 0008.
 */
/*eslint-disable*/
import React, {Component} from "react";
import * as creeper from "./mapbox-gl";
import config from "config";
import "./index.less";
import {inject, observer} from "mobx-react";


@inject("commonStore")
@observer
class MapSdk extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapStyle: {
                width: 0,
                height: 0
            },
            moveTag: ">"
        };
    }

    componentDidMount() {
        this.setState({
            mapStyle: {
                width: document.body.clientWidth - 200,
                height: document.body.clientHeight - 64
            }
        }, () => {
            setTimeout(() => {
                creeper.CreeperConfig.token = "bG9jYXRpb246YzFmNWZmZDg4ZWNkYzQyZDJlYzFkZjViYTU1OWU4MTA=";
                const map = new creeper.VectorMap("wb-map", 2, config.mapIp + "/");
                map.on("load", () => {
                    this.props.commonStore.saveMap(map);
                    this.props.commonStore.savMapGl(creeper);
                });
            }, 100);
        });

    }

    toggle() {
        const el = document.getElementsByClassName("code-view")[0];
        if (el.classList.contains("move-right")) {
            this.setState({
                moveTag: ">"
            });
            document.getElementsByClassName("code-view")[0].classList.remove("move-right");
        } else {
            this.setState({
                moveTag: "<"
            });
            document.getElementsByClassName("code-view")[0].classList.add("move-right");
        }


    }

    render() {
        const {mapStyle, moveTag} = this.state;
        const {routeMsg} = this.props.commonStore;
        return (
            <div className='wb-loader'>
                <div id="wb-map" className="wb-map-box" style={mapStyle}></div>
                <div className="code-view">
                    <div className="code-view-btn"
                         onClick={() => this.toggle()} style={{top: mapStyle.height / 2}}>{moveTag}
                    </div>
                    <div className="code-title">{routeMsg.title}</div>
                    <iframe width="100%" style={{height: mapStyle.height}} src={routeMsg.iframeUrl}
                            allowFullScreen="allowfullscreen" frameBorder="0"></iframe>
                </div>
            </div>
        );
    }
}

export default MapSdk;
