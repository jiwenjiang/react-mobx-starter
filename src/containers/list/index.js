/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React, {Component} from "react";
import {List} from "antd-mobile";
import {observer, inject} from "mobx-react";
import {Link} from "react-router-dom";
import loc from "services/locSdk";

const {Item} = List;

@inject("mapStore")
@observer
class listPage extends Component {
    state = {
        listArr: [
            {name: "理想中心", mapId: 2, link: "/map"},
            {name: "路易艺术城堡", mapId: 1, link: "/map"},
            {name: "成都妇女儿童医院", mapId: 3, link: "/map"},
        ]
    };

    componentDidMount() {
        // 定位sdk
        loc.init({
            timeout: 50000,
            locType: ["gps", "ibeacon"],
            mapId: 2,
            complete: () => {
                console.log(1, "chenggong");
                loc.startLocation({
                    complete: () => {
                    }
                });
            },
            error: (err) => {
                console.log("throw", err);
            }
        });
        loc.onLocation({
            complete: (data) => {
                console.log("complete", data);
            }
        });
    }

    chooseArea(id) {
        this.props.mapStore.updateMapId(id);
        this.props.mapStore.getMapServices(id);
    }

    render() {
        return (
            <List>
                {
                    this.state.listArr && this.state.listArr.map((v) =>
                        <Link to={v.link} key={v.mapId}>
                            <Item
                                key={v.mapId}
                                extra="距离： 0米"
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine
                                onClick={() => this.chooseArea(v.mapId)}>
                                {v.name}
                            </Item>
                        </Link>
                    )
                }
            </List>
        );
    }
}

export default listPage;
