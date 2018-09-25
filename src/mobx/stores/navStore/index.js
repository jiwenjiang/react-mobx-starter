/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action} from "mobx";

class NavStore {
    @observable locateCoordinate; // 定位坐标

    constructor() {
        this.locateCoordinate = "104.060763,30.597849";
    }

    @action updateLocateCoordinate = (value) => {
        this.locateCoordinate = value;
    };
}


const navStore = new NavStore();

export {navStore};