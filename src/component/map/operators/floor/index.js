/**
 * Created by j_bleach on 2018/9/29 0029.
 */
import React, {Component} from "react";
import "./index.less";
import {PickerView} from "antd-mobile";
import {observer} from "mobx-react";

@observer
class floor extends Component {
    state = {
        value: null,
    };
    seasons = [
        {
            label: "1F",
            value: "1F",
        },
        {
            label: "2F",
            value: "2F",
        },
        {
            label: "3F",
            value: "3F",
        },
        {
            label: "4F",
            value: "4F",
        },
        {
            label: "5F",
            value: "5F",
        },
        {
            label: "6F",
            value: "6F",
        },
    ];

    onChange = (value) => {
        console.log("change", value);
        this.setState({
            value,
        });
    };
    onScrollChange = (value) => {
        console.log("scroll", value);
        this.setState({
            value,
        });
    };

    componentDidMount() {
        // this.props.map.on("rotate", () => {
        //     const mapRotate = `rotate(${this.props.map.transform.angle * (180 / Math.PI)}deg)`;
        //     this.setState({
        //         mapRotate
        //     });
        // });
    }

    render() {
        return <div className="map-operators-floor">
            <div className="map-operators-floor-total">
                <PickerView
                    prefixCls="wb-picker"
                    onChange={this.onChange}
                    cols={1}
                    onScrollChange={this.onScrollChange}
                    value={this.state.value}
                    data={this.seasons}
                    cascade={false}
                />
            </div>
            <div className="map-operators-floor-current"></div>
        </div>;
    }
}


export default floor;