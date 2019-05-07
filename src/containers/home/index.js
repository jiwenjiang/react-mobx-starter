/*eslint-disable*/
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom";
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
                <Layout>
                    <Header className="header">
                        <div style={{color: "wheat", fontSize: "20px"}}>JS代码示例</div>
                    </Header>
                    <Layout>
                        <Sider width={200} style={{background: "#fff", height: "100vh"}}>
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={["1"]}
                                defaultOpenKeys={["sub1"]}
                                style={{height: "100%", borderRight: 0}}
                            >
                                <SubMenu key="sub1" title={<span><Icon type="user"/>3D地图示例</span>}>
                                    <Menu.Item key="1">基础地图显示</Menu.Item>
                                    <Menu.Item key="2">地图楼层切换</Menu.Item>
                                    <Menu.Item key="3">地图手势控制</Menu.Item>
                                    <Menu.Item key="5">地图旋转与倾斜</Menu.Item>
                                    <Menu.Item key="6">3D/2D视角切换</Menu.Item>
                                    <Menu.Item key="7">地图区块点击效果</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" title={<span><Icon type="laptop"/>3D地图标注示例</span>}>
                                    <Menu.Item key="5">添加文本标注</Menu.Item>
                                    <Menu.Item key="6">添加图片标注</Menu.Item>
                                    <Menu.Item key="7"></Menu.Item>
                                    <Menu.Item key="8">option8</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub3" title={<span><Icon type="notification"/>subnav 3</span>}>
                                    <Menu.Item key="9">option9</Menu.Item>
                                    <Menu.Item key="10">option10</Menu.Item>
                                    <Menu.Item key="11">option11</Menu.Item>
                                    <Menu.Item key="12">option12</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Layout>
                            <div style={{background: "white", height: "100%", width: "100%"}}>
                                <Route path="/map" component={Home}>666666</Route>
                            </div>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default homePage;
