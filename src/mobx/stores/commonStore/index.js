/**
 * Created by j_bleach on 2018/9/26 0026.
 */
import {observable, action, configure, runInAction} from "mobx";
import http from "services/http";
import normalUrl from "config/url/normal";
import routePlan from "assets/audio/routePlan.mp3";
import startAudio from "assets/audio/start.mp3";
import straightAudio from "assets/audio/straight.mp3";
import preLeftAudio from "assets/audio/preLeft.mp3";
import leftAudio from "assets/audio/left.mp3";
import preRightAudio from "assets/audio/preRight.mp3";
import rightAudio from "assets/audio/right.mp3";
import endAudio from "assets/audio/end.mp3";
import routeReplan from "assets/audio/routeReplan.mp3";


configure({
    enforceActions: "observed"
});

class CommonStore {
    @observable loadingStatus; // loading 状态显示
    @observable LocationLoading; // 定位loading 状态显示
    @observable searchStatus; // 搜索页面显示
    @observable projectType; // 寻址（车位鲸） Addressing(car)
    @observable confirmModalStatus; // 确认模态框
    @observable showSearchHistory; // 展示搜索历史
    @observable warningModalStatus; // 警告文字
    @observable mapToSearchStatus; // 地图返回搜索
    @observable noticeProps; // 地图返回搜索
    @observable detectLocation; // 监听定位
    @observable locationStatus; // 定位状态  中定位（locating） 去定位 （toLocate）三维（locate3D）
    @observable baiduVoice; // 百度语音
    @observable recordPanelStatus; // 录音面板
    @observable recordType; // 录音类型，map地图上的搜索，plate车牌,berth车位，
    @observable noLogo; // 是否显示logo(false)
    @observable routeErrorStatus; // 路径规划失败
    @observable allowAudioPlay; // 是否允许语音播放(true)

    constructor() {
        this.loadingStatus = false;
        this.LocationLoading = false;
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
        this.recordPanelStatus = false;
        this.recordType = "";
        this.noLogo = false;
        this.routeErrorStatus = false;
        this.allowAudioPlay = true;
    }

    // 获取百度口令
    @action
    async getBaiduToken(mapId) {
        this.mapId = mapId;
        try {
            const data = await http.put(normalUrl.getBaiduToken);
            runInAction(() => {
                this.baiduVoice = data.access_token;
            });
        } catch (e) {
            throw e;
        }
    }

    // 播放语音
    @action
    changeAllowAudio(v) {
        this.allowAudioPlay = v;
    }

    baiduVoiceUrl(text) {
        if (!this.allowAudioPlay) {
            return false;
        }
        const baiduVoice = `http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=${this.baiduVoice}&tex=${text}`;
        const audio = document.getElementById("wb-audio");
        let audioSrc = {
            "路径规划成功": routePlan,
            "重新规划路径": routeReplan,
            "开始导航": startAudio,
            "请直行": straightAudio,
            "前方右转": preRightAudio,
            "右转": rightAudio,
            "前方左转": preLeftAudio,
            "左转": leftAudio,
            "到达目的地，感谢使用本次导航": endAudio
        }[text];
        if (audioSrc) {
            audio.src = audioSrc;
        } else {
            audio.src = baiduVoice;
        }
        audio.play();
    }

    // 等待动画
    @action
    changeLoadingStatus(status) {
        this.loadingStatus = status;
    }

    // 路径规划错误提示
    @action
    changeRouteError(v) {
        this.routeErrorStatus = v;
    }

    // 定位动画
    @action
    changeLocationLoading(status) {
        this.LocationLoading = status;
    }

    // 搜索状态 "start" | "end" 搜索状态分为起点、终点
    @action
    changeSearchStatus(status) {
        this.searchStatus = status;
    }

    // 显示搜索历史
    @action
    changeSearchHistory(v) {
        this.showSearchHistory = v;
    }

    // 寻址、车位鲸
    @action
    changeProjectType(status) {
        this.projectType = status;
    }

    // logo显示状态
    @action
    changeLogoStatus(v) {
        this.noLogo = v;
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

    @action
    changeRecordPanel(status) {
        this.recordPanelStatus = status;
    }

    @action
    changeRecordType(type) {
        this.recordType = type;
    }
}


const commonStore = new CommonStore();


export {commonStore};
