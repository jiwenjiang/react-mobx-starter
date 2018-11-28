/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React, {Component} from "react";
import {List} from "antd-mobile";
import {observer, inject} from "mobx-react";
import {Link} from "react-router-dom";

const {Item} = List;

@inject("mapStore")
@observer
class listPage extends Component {
    state = {
        listArr: [
            {name: "理想中心", mapId: 2, link: "/map"},
            {name: "路易艺术城堡", mapId: 1, link: "/map"},
            {name: "成都妇女儿童医院", mapId: 3, link: "/map"},
            {name: "武侯校区", mapId: 15, link: "/map"},
            // {name: "航空港校区", mapId: 2, link: "/map"},
        ]
    };

    componentDidMount() {
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
