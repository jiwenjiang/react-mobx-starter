/**
 * Created by j_bleach on 2018/9/29 0029.
 */
/*eslint-disable*/
import React, {Component} from "react";
import "./index.less";
import {inject, observer} from "mobx-react";

// import Hammer from "hammerjs";


@inject("mapStore")
@observer
class floor extends Component {
    state = {
        value: null,
        showFloor: false
    };
    data = [
        {
            label: "1F",
            value: "1",
        },
        {
            label: "2F",
            value: "2",
        },
        {
            label: "3F",
            value: "3",
        },
        {
            label: "4F",
            value: "4",
        },
        {
            label: "5F",
            value: "5",
        },
        {
            label: "6F",
            value: "6",
        },
    ];

    componentDidMount() {
        /**
         * @author j_bleach
         * @date 2018-09-29
         * @Description: swipe action
         * @param name:String
         * @return name:String
         */
        // TODO 国庆完成
//         const floor = document.getElementById("floor");
//         const manager = new Hammer.Manager(floor);
//         const Swipe = new Hammer.Swipe();
//         manager.add(Swipe);
//         let deltaX = 0;
//         let deltaY = 0;
//
// // Subscribe to a desired event
//         manager.on("swipe", function (e) {
//             deltaX = deltaX + e.deltaX;
//             deltaY = deltaY + e.deltaY;
//             const direction = e.offsetDirection;
//             const translate3d = "translate3d(" + deltaX + "px, 0, 0)";
//             console.log(e.deltaY);
//
//             // if (direction === 4 || direction === 2) {
//             //     console.log(translate3d);
//             //     // e.target.innerText = deltaX;
//             //     // e.target.style.transform = translate3d;
//             // }
//         });
    }

    calcFloorHeight() {
        if (this.state.showFloor) {
            this.setState({
                showFloor: false
            });
        } else {
            this.setState({
                showFloor: true
            }, () => {
                const mapFloor = document.getElementById("map-operators-floor-total");
                const scrollHeight = mapFloor.scrollHeight;
                mapFloor.scrollTop = scrollHeight;
            });
        }
    }

    changeFloor(v) {
        this.props.mapStore.updateFloor(v);
        this.setState({
            showFloor: false
        });
    }

    render() {
        const {showFloor} = this.state;
        const {mapFloor} = this.props.mapStore;
        return <div className="map-operators-floor">
            {
                showFloor && <div className="map-operators-floor-total" id="map-operators-floor-total">
                    {/*<div id="floor" className="swipe-floor"></div>*/}
                    <ul>
                        {this.data.map(v => {
                            const color = v.value == mapFloor ? "#009999" : "#999999";
                            return <li key={v.value} style={{color}}
                                       onClick={() => this.changeFloor(v.value)}>{v.label}</li>;
                        })}
                    </ul>
                </div>
            }
            <div className="map-operators-floor-current" onClick={() => this.calcFloorHeight()}>
                {mapFloor}
            </div>
        </div>;
    }
}


export default floor;