import {Icon, Menu, Layout} from "antd";
import React from "react";
import {Link} from "react-router-dom";

const {SubMenu} = Menu;
const {Sider} = Layout;

const sideNavbars = [
    {
        id: "mapMarker",
        text: "3D地图标注示例",
        icon: "user",
        children: [
            {
                id: "1-1",
                text: "添加文本标注",
                path: "/mapMarker/textMarker"
            },
            {
                id: "1-2",
                text: "添加图片标注",
                path: "/mapMarker/imgMarker"
            },
            {
                id: "1-3",
                text: "添加图片加文本标注",
                path: "/mapMarker/imgAndTextMarker"
            },
            {
                id: "1-4",
                text: "添加定位标注",
                path: "/mapMarker/locMarker"
            },
            {
                id: "1-5",
                text: "添加GIF标注",
                path: "/mapMarker/gifMarker"
            },
            {
                id: "1-6",
                text: "批量清空标注",
                path: "/mapMarker/textMarker11"
            },
            {
                id: "1-7",
                text: "清除指定标注",
                path: "/mapMarker/textMarker22"
            },
        ]
    },
    {
        id: "2",
        text: "3D地图示例",
        icon: "user",
        children: [
            {
                id: "2-1",
                text: "基础地图显示",
                path: "/mapMarker/textMarker/7"
            },
            {
                id: "2-2",
                text: "地图楼层切换",
                path: "/mapMarker/imgMarker/"
            },
            {
                id: "2-3",
                text: "地图手势控制",
                path: "/mapMarker/imgAndTextMarker/"
            },
            {
                id: "2-4",
                text: "添加定位标注",
                path: "/mapMarker/locMarker/"
            },
            {
                id: "2-5",
                text: "地图旋转与倾斜",
                path: "/mapMarker/gifMarker/3"
            },
            {
                id: "2-6",
                text: "3D/2D视角切换",
                path: "/mapMarker/textMarker/4"
            },
            {
                id: "2-7",
                text: "地图区块点击效果",
                path: "/mapMarker/textMarker/5"
            },
        ]
    },
];


const defaultSelectedKey = window.location.hash.split("#")[1] || "/mapMarker/textMarker";
const defaultOpenKeys = window.location.hash.split("/")[1] || "mapMarker";

const sider = () => {
    return <Sider width={200} style={{background: "#fff", height: "100vh"}}>
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[defaultSelectedKey]}
            defaultOpenKeys={[defaultOpenKeys]}
            style={{height: "100%", borderRight: 0}}
        >
            {sideNavbars.map((subMenu) => {
                return <SubMenu key={subMenu.id} title={<span><Icon type={subMenu.icon}/>{subMenu.text}</span>}>
                    {subMenu.children.map((item) => {
                        return <Menu.Item key={item.path}>
                            <Link to={item.path}>{item.text}</Link>
                        </Menu.Item>;
                    })}
                </SubMenu>;
            })}
        </Menu>
    </Sider>;
};

export default sider;
