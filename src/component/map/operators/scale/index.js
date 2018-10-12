/**
 * Created by j_bleach on 2018/9/28 0028.
 */


import React, {Component} from "react";
import "./index.less";
import {observer} from "mobx-react";


const scales = [
    0.01,
    0.02,
    0.05,
    0.1,
    0.2,
    0.5,
    1,
    2,
    5,
    10,
    20,
    50,
    100,
    200,
    500,
    1000,
    2 * 1000,
    5 * 1000,
    10 * 1000
];
const MILE_IN_KILOMETERS = 1.60934;
const MILE_IN_FEET = 5280;
const KILOMETER_IN_METERS = 1000;
const MIN_WIDTH_SCALE = 60;

const containerStyle = {
    position: "fixed",
    left: "28vw",
    bottom: "9vw",
    backgroundColor: "transparent",
    padding: "3px 7px"
};
const scaleStyle = {
    position: "relative",
    border: "1px solid #000",
    borderTop: "none",
    textAlign: "center",
    lineHeight: "20px",
    height: 6,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
};
const textStyle = {
    width: "100%",
    height: 12,
    position: "absolute",
    top: -12,
    left: 0,
    textAlign: "center",
};

@observer
class direction extends Component {

    state = {
        chosenScale: 0,
        scaleWidth: MIN_WIDTH_SCALE
    };

    componentDidMount() {
        this.setScale();
        this.props.map.on("zoomend", this.setScale);
    }

    componentWillUnmount() {
        if (this.props.map) {
            this.props.map.off("zoomend", this.setScale);
        }
    }

    setScale = () => {
        const {map, measurement} = this.props;
        // tslint:disable-next-line:no-any
        const clientWidth = map._canvas.clientWidth;
        // tslint:disable-next-line:no-any
        const {_ne, _sw} = map.getBounds();
        const totalWidth = this._getDistanceTwoPoints(
            [_sw.lng, _ne.lat],
            [_ne.lng, _ne.lat],
            measurement
        );
        const relativeWidth = totalWidth / clientWidth * 1.3 * MIN_WIDTH_SCALE;
        const chosenScale = scales.reduce((acc, curr) => {
            if (!acc && curr > relativeWidth) {
                return curr;
            }
            return acc;
        }, 0);
        // tslint:disable-next-line:no-any
        const scaleWidth = chosenScale / totalWidth * (clientWidth / 1.5);
        this.setState({
            chosenScale,
            scaleWidth
        });
    };

    _getDistanceTwoPoints(x, y, measurement = "km") {
        const [lng1, lat1] = x;
        const [lng2, lat2] = y;

        // Radius of the earth in km or miles
        const R = measurement === "km" ? 6371 : 6371 / MILE_IN_KILOMETERS;
        const dLat = this._deg2rad(lat2 - lat1);
        const dLng = this._deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) *
            Math.cos(this._deg2rad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d;
    }

    _deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    _displayMeasurement(measurement, chosenScale) {
        if (chosenScale >= 1) {
            return `${chosenScale} ${measurement}`;
        }
        if (measurement === "mi") {
            return `${Math.floor(chosenScale * MILE_IN_FEET)} 英寸`;
        }
        return `${Math.floor(chosenScale * KILOMETER_IN_METERS)} 米`;
    }

    render() {
        return <div style={containerStyle} className="map-operators-scale">
            <div style={{...scaleStyle, width: this.state.scaleWidth}}>
                <div style={textStyle}>
                    {this._displayMeasurement(this.props.measurement, this.state.chosenScale)}
                </div>
            </div>
        </div>;
    }
}


export default direction;