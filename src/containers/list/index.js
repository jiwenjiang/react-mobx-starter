/**
 * Created by j_bleach on 2018/9/17 0017.
 */
import React, {Component} from "react";
import {List} from 'antd-mobile';
import {observer, inject} from 'mobx-react';
import http from "services/http";
import normalUrl from "config/url/normal"

@inject("mapStore")
@observer
class listPage extends Component {

    componentDidMount() {
    }

    test() {
        http.post(normalUrl.dynamicParams, `mapId=2`, (data) => {
            console.log(data)
        })
        this.props.mapStore.updateMapId(666)
    }

    render() {
        return (
            <List renderHeader={() => 'Basic Style'} className="my-list">
                <List.Item extra={'extra content'} onClick={() => this.test()}>理想中心</List.Item>
                <List.Item extra={'extra content'}>{this.props.mapStore.mapId == 666 ? "路易城堡" : "11111"}</List.Item>
                <List.Item extra={'extra content'}>{this.props.mapStore.mapId}</List.Item>
            </List>
        );
    }
}

export default listPage;
