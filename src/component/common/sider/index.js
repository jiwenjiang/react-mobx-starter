import {Icon, Menu, Layout} from "antd";
import React from "react";

const {SubMenu} = Menu;
const {Sider} = Layout;

const sideNavbars = [
    {
        id: "1",
        text: "3D地图标注示例",
        icon: "user",
        children: [
            {
                id: "1 - 1",
                text: "添加文本标注",
                path: "/mapMarker/textMarker/"
            },
            {
                id: "1 - 2",
                text: "添加图片标注",
                path: "/mapMarker/imgMarker/"
            },
            {
                id: "1 - 3",
                text: "添加图片加文本标注",
                path: "/mapMarker/imgAndTextMarker/"
            },
            {
                id: "1 - 4",
                text: "添加定位标注",
                path: "/mapMarker/locMarker/"
            },
            {
                id: "1 - 5",
                text: "添加GIF标注",
                path: "/mapMarker/gifMarker/"
            },
            {
                id: "1 - 6",
                text: "批量清空标注",
                path: "/mapMarker/textMarker/"
            },
            {
                id: "1 - 7",
                text: "清除指定标注",
                path: "/mapMarker/textMarker/"
            },
        ]
    },

];

const sider = () => {
    return <Sider width={200} style={{background: "#fff", height: "100vh"}}>
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{height: "100%", borderRight: 0}}
        >
            {sideNavbars.map((subMenu) => {
                return <SubMenu key={subMenu.id} title={<span><Icon type={subMenu.icon}/>{subMenu.text}</span>}>
                    {subMenu.children.map((item) => {
                        return  <Menu.Item key={item.id}>{item.text}</Menu.Item>
                    })}

                    <Menu.Item key="2">地图楼层切换</Menu.Item>
                    <Menu.Item key="3">地图手势控制</Menu.Item>
                    <Menu.Item key="5">地图旋转与倾斜</Menu.Item>
                    <Menu.Item key="6">3D/2D视角切换</Menu.Item>
                    <Menu.Item key="7">地图区块点击效果</Menu.Item>
                </SubMenu>;
            })}

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
    </Sider>;
};

export default sider;
