/**
 * Created by j_bleach on 2018/9/26 0026.
 */
import {observable, action, configure, runInAction} from "mobx";
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

    // 等待动画
    @action
    changeLoadingStatus(status) {
        this.loadingStatus = status;
    }
}


const commonStore = new CommonStore();


export {commonStore};
