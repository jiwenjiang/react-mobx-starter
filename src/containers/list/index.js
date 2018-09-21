/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React, {Component} from "react";
import {List} from 'antd-mobile';
import {observer, inject} from 'mobx-react';

const {Item} = List;

@inject("mapStore")
@observer
class listPage extends Component {
    state = {
        listArr: [
            {name: "理想中心", mapId: 2},
            {name: "路易艺术城堡", mapId: 1},
            {name: "成都妇女儿童医院", mapId: 3},
        ]
    }

    componentDidMount() {
    }

    chooseArea(id) {
        this.props.mapStore.updateMapId(id)
    }

    render() {
        return (
            <List>
                {
                    this.state.listArr && this.state.listArr.map((v) =>
                        <Item
                            key={v.mapId}
                            extra="距离： 0米"
                            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                            multipleLine
                            onClick={() => this.chooseArea(v.mapId)}>
                            {v.name}
                        </Item>
                    )
                }
            </List>
        );
    }
}

export default listPage;
