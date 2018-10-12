/**
 * Created by j_bleach on 2018/9/29 0029.
 */
/*eslint-disable*/
import React, {Component} from "react";
import "./index.less";
import {inject, observer} from "mobx-react";

// import Hammer from "hammerjs";


@inject("floorStore", "mapStore")
@observer
class floor extends Component {
    state = {
        value: null,
        showFloor: false
    };

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
            const floorData = this.calcFloorList(this.props.mapStore.mapObj);
            this.setState({
                showFloor: true,
                floorData,
            }, () => {
                const index = floorData.findIndex(v => this.props.floorStore.mapFloor == v.value);
                const mapFloor = document.getElementById("map-operators-floor-total");
                const itemHeight = mapFloor.scrollHeight / floorData.length;
                const scrollHeight = (index - 1) * itemHeight;
                mapFloor.scrollTop = scrollHeight;
            });
        }
    }

    calcFloorList(map) {
        const maxFloor = map.getMaxLevel();
        const minFloor = map.getMinLevel();
        let minArr = [];
        if (minFloor <= -1) {
            minArr = Array.from({length: -minFloor}, (v, i) => {
                return {label: "B" + (i + 1), value: -(i + 1)};
            }).reverse();
        }
        let maxArr = Array.from({length: maxFloor}, (v, i) => {
            return {label: (i + 1) + "F", value: (i + 1)};
        });
        return [...minArr, ...maxArr].reverse();
    }

    changeFloor(v) {
        this.props.floorStore.updateFloor(v);
        const floor = v > 0 ? v - 1 : v;
        this.props.mapStore.mapObj.setLevel(floor);
        this.props.floorStore.checkMarkerAndRoute(this.props.mapStore, floor);
        this.setState({
            showFloor: false
        });
    }

    render() {
        const {showFloor, floorData} = this.state;
        const {mapFloor, floorStatus} = this.props.floorStore;
        return <div>
            {floorStatus && <div className="map-operators-floor">
                {
                    showFloor && <div className="map-operators-floor-total" id="map-operators-floor-total">
                        {/*<div id="floor" className="swipe-floor"></div>*/}
                        <ul>
                            {floorData && floorData.map(v => {
                                const color = v.value == mapFloor ? "#009999" : "#999999";
                                return <li key={v.value} style={{color}}
                                           onClick={() => this.changeFloor(v.value)}>{v.label}</li>;
                            })}
                        </ul>
                    </div>
                }
                <div className="map-operators-floor-current" onClick={() => this.calcFloorHeight()}>
                    {mapFloor > 0 ? `${mapFloor}F` : `B${-mapFloor}`}
                </div>
            </div>
            };
        </div>;
    }
}


export default floor;