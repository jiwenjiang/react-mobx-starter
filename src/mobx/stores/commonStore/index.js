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
    @observable searchStatus; // 搜索页面显示
    @observable projectType; // 寻址（车位鲸） Addressing(Car)
    @observable confirmModalStatus; // 确认模态框

    constructor() {
        this.loadingStatus = false;
        this.searchStatus = true;
        this.projectType = "Addressing";
        this.confirmModalStatus = false;
    }

    @action
    changeLoadingStatus(status) {
        this.loadingStatus = status;
    }

    @action
    changeSearchStatus(status) {
        this.searchStatus = status;
    }

    @action
    changeProjectType(status) {
        this.projectType = status;
    }

    @action
    changeConfirmModal(status) {
        this.confirmModalStatus = status;
    }
}


const commonStore = new CommonStore();


export {commonStore};