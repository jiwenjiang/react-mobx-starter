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
    @observable showSearchHistory; // 展示搜索历史
    @observable warningModalStatus; // 警告文字
    @observable mapToSearchStatus; // 地图返回搜索

    constructor() {
        this.loadingStatus = false;
        this.searchStatus = "end"; // "start" | "end" 搜索状态分为起点、终点
        this.projectType = "Addressing";
        this.confirmModalStatus = false;
        this.showSearchHistory = false;
        this.warningModalStatus = null; // String
        this.mapToSearchStatus = false;
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
    changeSearchHistory(v) {
        this.showSearchHistory = v;
    }

    @action
    changeProjectType(status) {
        this.projectType = status;
    }

    @action
    changeConfirmModal(status) {
        this.confirmModalStatus = status;
    }

    @action
    changeWarningModal(status) {
        this.warningModalStatus = status;
    }

    @action
    changeMapToSearch(v) {
        this.mapToSearchStatus = v;
    }
}


const commonStore = new CommonStore();


export {commonStore};