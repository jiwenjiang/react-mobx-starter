/**
 * Created by j_bleach on 2019/5/10 0010.
 */
/*eslint-disable*/
import React, {Component} from "react";
import "./index.less";
import {inject, observer} from "mobx-react";

@inject("commonStore")
@observer
class floor extends Component {
    state = {
        value: null,
        showFloor: false
    };

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/GKyKp/embedded/js/dark/",
            title: "地图楼层切换"
        });
        setTimeout(() => {
            const floorData = this.calcFloorList(this.props.commonStore.mapObj);
            this.setState({
                floorData,
                referFloor: this.props.commonStore.mapObj.floorComponent.nowLevelIndex + 1
            });
        }, 1000);
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
        const floor = v >= 0 ? v - 1 : v;
        this.props.commonStore.mapObj.setLevel(floor); //  更新楼层
        this.setState({
            referFloor: v
        });
    }

    render() {
        const {floorData, referFloor} = this.state;

        // const {mapFloor, floorStatus} = this.props.floorStore;
        return <div className="map-operators-floor">
            <div className="map-operators-floor-total" id="map-operators-floor-total">
                {/*<div id="floor" className="swipe-floor"></div>*/}
                <ul className="canBeScroll">
                    {floorData && floorData.map(v => {
                        const color = v.value == referFloor ? "#009999" : "#999999";
                        return <li key={v.value} style={{color}} className="canBeScroll"
                                   onClick={() => this.changeFloor(v.value)}>{v.label}</li>;
                    })}
                </ul>
            </div>
        </div>;
    }
}


export default floor;
