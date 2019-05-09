/**
 * Created by j_bleach on 2019/5/8 0008.
 */

/*eslint-disable*/
import React, {Component} from "react";
import "./index.less";

class MapSdk extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapStyle: {
                width: 0,
                height: 0
            }
        };
    }

    componentDidMount() {
        console.log(1111, document.body.clientWidth);
        this.setState({
            mapStyle: {
                width: document.body.clientWidth - 200,
                height: document.body.clientHeight - 64
            }
        }, () => {
            setTimeout(() => {
                creeper.CreeperConfig.token = "bG9jYXRpb246YzFmNWZmZDg4ZWNkYzQyZDJlYzFkZjViYTU1OWU4MTA=";
                const map = new creeper.VectorMap("wb-map", 2, config.mapIp + "/");
            }, 100);
        });

    }

    render() {
        const {mapStyle} = this.state;
        return (
            <div className='wb-loader'>
                <div id="wb-map" className="wb-map-box"
                     style={mapStyle}></div>
            </div>
        );
    }
}

export default MapSdk;
