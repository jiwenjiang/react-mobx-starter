/**
 * Created by j_bleach on 2018/10/23 0023.
 */
/*eslint-disable*/

import compass from "./compass";
import stepper from "./stepper";
import correctLocate from "./correctLocate";
import simNavigation from "./simNav";
import realNavigation from "./realNav";
import {preHandleSimData, preHandleRealData} from "./utils";

// import {pointToLineDistance} from "@turf/turf";

@compass
@stepper
@correctLocate
@simNavigation
@realNavigation
class Nav {
    constructor() {
        this.currentMode = "free";
        this.inElevator = false; // 电梯标记
    }

    init(loc) {
        this.loc = loc;
        if (loc.currentPosition) {
            console.log("进入nav存在loc定位", loc.currentPosition);
            this.currentPoint = loc.currentPosition;
            this.initStepper(loc);
        }
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
            map,
            onSimNav = () => {
            },
            complete = () => {
            },
            error = () => {
            }
        }
    ) {
        this.onSimStep = onSimNav;
        this.simComplete = complete;
        const handleData = preHandleSimData(routeData, map, speed);
        // const handleData = preHandleRealData(routeData, map);
        // console.log(handleData)
        this.startSimNavigation(handleData, map, speed);
    }

    stopSim() {
        window.cancelAnimationFrame(this.animateId);
        this.inElevator = false;
        if (this.loc && this.loc.currentPosition) {
            this.startCorrectFreeLocate(this.loc);
        }
    }

    startNav(
        {
            routeData = [],
            map,
            onNav = () => {
            },
            complete = () => {
            },
            error = () => {
            }
        }
    ) {
        this.voiceRecorder = {};
        this.onNavStep = onNav;
        this.navComplete = complete;
        this.handleData = preHandleRealData(routeData, map);
        this.navEndLevel = routeData[routeData.length - 1].endFloor;
        this.currentMode = "realNav";
        this.correctNavFlag = false;
        this.correctNavOutdoorFlag = false;
        this.startCorrectNavLocate(this.loc);
    }

    stopNav() {
        this.currentMode = "free";
        this.inElevator = false;
        this.startCorrectFreeLocate(this.loc);
    }

}

export default new Nav();
