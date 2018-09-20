/**
 * Created by j_bleach on 2018/9/20 0020.
 */
import {observable, action} from 'mobx';

class NavStore {
    @observable mapId;

    constructor() {
        this.mapId = null;
    }

    @action updateMapId = (value) => {
        this.mapId = value;
    }
}


const navStore = new NavStore();

export {navStore};