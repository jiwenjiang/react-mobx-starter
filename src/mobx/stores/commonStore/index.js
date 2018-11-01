/**
 * Created by j_bleach on 2018/9/26 0026.
 */
/* eslint-disable*/
import {observable, action, autorun, computed, configure, runInAction} from "mobx";
import http from "services/http";
import normalUrl from "config/url/normal";
import audioSrc from "assets/audio/routePlan.mp3";


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
    @observable noticeProps; // 地图返回搜索
    @observable detectLocation; // 监听定位
    @observable locationStatus; // 定位状态  中定位（locating） 去定位 （toLocate）三维（locate3D）
    @observable baiduVoice; // 百度语音

    constructor() {
        this.loadingStatus = false;
        this.searchStatus = null; // "start" | "end" 搜索状态分为起点、终点
        this.projectType = "Addressing";
        this.confirmModalStatus = false;
        this.showSearchHistory = false;
        this.warningModalStatus = null; // String
        this.mapToSearchStatus = false;
        this.noticeProps = null;
        this.detectLocation = true;
        this.locationStatus = "toLocate";
        this.baiduVoice = null;
    }

    @action
    async getBaiduToken(mapId) {
        this.mapId = mapId;
        try {
            const data = await http.put(normalUrl.getBaiduToken);
            runInAction(() => {
                this.baiduVoice = `http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=${data.access_token}&vol=9&per=0&spd=5&pit=5`;
            });
        } catch (e) {
            throw e;
        }
    }

    @action baiduVoiceUrl(text) {
        this.baiduVoice = `${this.baiduVoice}&tex=${text}`;
        const audio = document.getElementById("wb-audio");
        audio.src = this.baiduVoice;
        audio.play();
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

    @action
    changeDetectLocation(status) {
        this.detectLocation = status;
    }
}


const commonStore = new CommonStore();


export {commonStore};