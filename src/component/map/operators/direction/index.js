/**
 * Created by j_bleach on 2018/9/28 0028.
 */
import React, {Component} from "react";
import DirectionImg from "assets/img/direction.png";
import "./index.less";
import {observer} from "mobx-react";

@observer
class direction extends Component {
    state = {
        mapRotate: "rotate(0deg)"
    };

    componentDidMount() {
        this.props.map.on("rotate", () => {
            const mapRotate = `rotate(${this.props.map.transform.angle * (180 / Math.PI)}deg)`;
            this.setState({
                mapRotate
            });
        });
    }

    reset() {
        this.props.map.resetNorth();
    }

    render() {
        return <img className="map-operators-direction" style={{transform: this.state.mapRotate}}
                    src={DirectionImg} alt="" onClick={() => this.reset()}/>;
    }
}


export default direction;