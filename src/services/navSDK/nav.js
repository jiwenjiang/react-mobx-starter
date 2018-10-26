/**
 * Created by j_bleach on 2018/10/23 0023.
 */
/*eslint-disable*/

import compass from "./compass";
import stepper from "./stepper";
import correctLocate from "./correctLocate";
import simNavigation from "./simNav";
import {preHandleData} from "./utils";

// import {pointToLineDistance} from "@turf/turf";

@compass
@stepper
@correctLocate
@simNavigation
class Nav {
    init(loc) {
        // console.log("loc", loc);
        if (loc.currentPosition) {
            this.currentPoint = loc.currentPosition;
            this.initStepper(loc);
        }
        this.loc = loc;
        this.initCompass();
    }

    compass(
        {
            complete = () => {
            }
        }
    ) {
        this.onCompass = complete;
    }

    startFree(
        {
            complete = () => {
            }
        }
    ) {
        if (this.loc.currentPosition) {
            this.startCorrectFreeLocate(this.loc);
        }
        this.onFreeStep = complete;
    }

    startSim(
        {
            routeData = [],
            speed = 1,
            complete = () => {
            },
            error = () => {
            }
        }
    ) {
        // const routePath = routeData.concat().splice(1, routeData.length - 2);
        console.log(111, routeData);
        this.onSimStep = complete;
        let isCross = routeData[0]["startFloor"] === routeData[routeData.length - 1]["endFloor"] ? false : true; //是否跨楼层导航
        const handleData = preHandleData(routeData);
        this.startSimNavigation(routeData, handleData);

        // for (let v of)
        //     this.startSimNavigation();
    }
}

export default new Nav();