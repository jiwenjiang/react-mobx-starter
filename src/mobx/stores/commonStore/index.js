/**
 * Created by j_bleach on 2018/9/26 0026.
 */
/* eslint-disable*/
import {observable, action, autorun, computed, configure, runInAction} from "mobx";
import http from "services/http";
import normalUrl from "config/url/normal";

configure({
    enforceActions: "observed"
});

class CommonStore {
    @observable loadingStatus; // loading 状态显示

    constructor() {
        this.loadingStatus = false;
    }

    @action
    changeLoadingStatus(status) {
        this.loadingStatus = status;
    }
}


const commonStore = new CommonStore();


export {commonStore};