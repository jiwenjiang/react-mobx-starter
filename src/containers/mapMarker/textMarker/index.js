/**
 * Created by j_bleach on 2019/5/7 0007.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {
    Layout, Menu, Icon,
} from "antd";

const {SubMenu} = Menu;
const {Header, Sider} = Layout;

@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    change() {
        console.log("aaaaa");
    }

    render() {
        return (
            <div>
                aaaaaaaaaaaaaaa
            </div>
        );
    }
}

export default homePage;
