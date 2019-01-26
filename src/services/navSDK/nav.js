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
        this.isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? true : false;
        if (loc.currentPosition) {
            this.currentPoint = loc.currentPosition;
            this.lastLocation = loc.currentPosition;
            this.tempLocation = loc.currentPosition;
            this.stepLocation = loc.currentPosition;
            this.initStepper(loc);
            this.startWeightsPointCalc();
        }
        this.initCompass();
    }

    compass({
                complete = () => {
                }
            }) {
        this.onCompass = complete;
    }

    startFree({
                  complete = () => {
                  }
              }) {
        if (this.loc.currentPosition) {
            // this.startCorrectFreeLocate(this.loc);
            this.startWeightsPointCalc();
        }
        this.onFreeStep = complete;
    }

    startSim({
                 routeData = [],
                 speed = 1,
                 map,
                 onSimNav = () => {
                 },
                 complete = () => {
                 },
                 error = () => {
                 }
             }) {
        this.onSimStep = onSimNav;
        this.simComplete = complete;
        this.handleData = preHandleSimData(routeData, map, speed);
        this.completeLength = 0;
        this.map = map;
        // const handleData = preHandleRealData(routeData, map);
        // console.log(handleData)
        this.startSimNavigation(map, speed);
    }

    pauseSim(v) {
        if (v) {
            this.startSimNavigation(this.map);
        } else {
            window.cancelAnimationFrame(this.animateId);
        }
    }

    stopSim() {
        window.cancelAnimationFrame(this.animateId);
        this.inElevator = false;
        if (this.loc && this.loc.currentPosition) {
            // this.startCorrectFreeLocate(this.loc);
        }
    }

    startNav({
                 routeData = [],
                 map,
                 onNav = () => {
                 },
                 complete = () => {
                 },
                 error = () => {
                 }
             }) {
        this.voiceRecorder = {};
        this.floorRecorder = {
            lastFloor: null // 上一条线路
        };
        this.onNavStep = onNav;
        this.navComplete = complete;
        this.mapObj = map;
        this.handleData = preHandleRealData(routeData, map);
        console.log(this.handleData);

        this.navStartLevel = routeData[0].startFloor;
        this.navEndLevel = routeData[routeData.length - 1].endFloor;
        let navEndLevelArr = [];
        Object.keys(this.handleData.handleRouteFloor).forEach(v => {
            if (v.includes(`"level":${this.navEndLevel}`)) {
                navEndLevelArr.push(v);
            }
        });
        this.navEndLevelString = navEndLevelArr.pop();
        this.currentMode = "realNav";
        this.diffLevelCount = 0;
        this.countNum = 0;
        // this.correctNavFlag = false;
        // this.correctNavOutdoorFlag = false;
        // this.startCorrectNavLocate(this.loc);
    }

    stopNav() {
        this.currentMode = "free";
        this.inElevator = false;
        // this.startCorrectFreeLocate(this.loc);
    }

}

export default new Nav();
