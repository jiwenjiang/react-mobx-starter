/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action, autorun, computed, configure} from 'mobx';

configure({
    enforceActions: "observed"
});

class MapStore {
    @observable mapId;

    constructor() {
        this.mapId = 0;
    }

    @action updateMapId = (value) => {
        this.mapId = value;
    }

    @computed get funn() {
        return this.mapId * 10
    }
}


const mapStore = new MapStore();
autorun(() => {
    if (mapStore.mapId == 3) {
        console.log(1)
    }
    console.log("test:");
});


export {mapStore};