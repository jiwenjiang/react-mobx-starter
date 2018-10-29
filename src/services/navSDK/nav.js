/**
 * Created by j_bleach on 2018/10/23 0023.
 */
/*eslint-disable*/

import compass from "./compass";
import stepper from "./stepper";
import correctLocate from "./correctLocate";
import simNavigation from "./simNav";
import {preHandleSimData, beizerFn} from "./utils";

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
        this.startSimNavigation(routeData, handleData, speed);
    }

    startNav(
        {
            routeData = [],
            onNav = () => {
            },
            complete = () => {
            },
            error = () => {
            }
        }
    ) {
        this.onNavStep = onNav;
        this.navComplete = complete;
        const handleData = preHandleSimData(routeData);
        console.log(55, handleData);
        const beizerData = beizerFn(routeData);
        console.log(beizerData);
        // this.startSimNavigation(routeData, handleData);
    }
}

export default new Nav();