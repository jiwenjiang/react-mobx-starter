/**
 * Created by j_bleach on 2018/10/23 0023.
 */
/*eslint-disable*/

import compass from "./compass";
import stepper from "./stepper";
import correctLocate from "./correctLocate";
import simNavigation from "./simNav";
import realNavigation from "./realNav";
import {preHandleSimData, beizerFn, preHandleRealData} from "./utils";

// import {pointToLineDistance} from "@turf/turf";

@compass
@stepper
@correctLocate
@simNavigation
@realNavigation
class Nav {
    constructor() {
        this.currentMode = "free";
    }

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
        const handleData = preHandleSimData(routeData, speed);
        this.startSimNavigation(handleData, speed);
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
        this.startCorrectNavLocate(this.loc);
    }
}

export default new Nav();