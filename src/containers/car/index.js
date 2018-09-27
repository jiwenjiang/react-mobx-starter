/**
 * Created by j_bleach on 2018/9/26 0026.
 */
/* eslint-disable*/
import React, {Component} from "react";
import {Tabs} from "antd-mobile";
import {observer, inject} from "mobx-react";
import "./index.less";
import LoadingComponent from "component/common/loading";
import http from "services/http";
import MapTag from "component/map/mapTag";
import normalUrl from "config/url/normal";


@inject("mapStore", "commonStore")
@observer
class carPage extends Component {
    state = {
        carIdValue: "",
        carPositionValue: ""
    };
    tabTitles = [
        {title: "车牌寻车", sub: "1"},
        {title: "车位寻车", sub: "2"},
    ];

    componentDidMount() {
    }

    searchCar(e, valueName, listName) {
        const value = e.target.value;
        this.setState({
            [valueName]: value
        });
        clearTimeout(this.searchCarByNumber);
        if (value.length >= 1) {
            this.searchCarByNumber = setTimeout(() => {
                this.props.commonStore.changeLoadingStatus(true);
                http.post(normalUrl[valueName === "carIdValue" ? "searchCarByNumber" : "searchCarByPosition"], {
                    mapid: this.props.mapStore.mapId,
                    carno: value
                }, (data) => {
                    this.props.commonStore.changeLoadingStatus(false);
                    this.setState({
                        [listName]: data.result
                    });
                });
            }, 300);
        }
    }

    render() {
        const {carList, positionList, carIdValue, carPositionValue} = this.state;
        return (
            <div>
                <div className="car-box">
                    <div className="car-tab-box">
                        <Tabs tabs={this.tabTitles}
                              initialPage={0}
                              tabBarBackgroundColor="rgba(250,250,250,1)"
                              tabBarActiveTextColor="#33CCCC"
                              tabBarInactiveTextColor="#CCCCCC"
                              tabBarTextStyle={{fontSize: "4.8vw"}}
                              renderTab={tab => <span>{tab.title}</span>}
                        >
                            <div className="car-tab-one">
                                <div className="car-tab-demo">例：99999（车牌号后5位）</div>
                                <div className="car-tab-input">
                                    <input type="search" placeholder="请输入至少三位车牌号"
                                           value={carIdValue}
                                           onChange={(v) => this.searchCar(v, "carIdValue", "carList")}/>
                                </div>
                                <div className="car-tab-list">
                                    <ul>
                                        {carList && carList.map(v =>
                                            <li key={v}>
                                                <span>{v}</span><i className="iconfont icon-daohang"></i>
                                            </li>
                                        )
                                        }
                                    </ul>
                                </div>
                                <div className="car-tab-more">
                                    查看更多
                                </div>
                            </div>
                            <div className="car-tab-one">
                                <div className="car-tab-demo">例：113</div>
                                <div className="car-tab-input">
                                    <input type="text" placeholder="请输入车位号"
                                           value={carPositionValue}
                                           onChange={(v) => this.searchCar(v, "carPositionValue", "positionList")}/>
                                </div>
                                <div className="car-tab-list">
                                    <ul>
                                        {positionList && positionList.map(v =>
                                            <li key={v}>
                                                <span>{v}</span><i className="iconfont icon-daohang"></i>
                                            </li>
                                        )
                                        }
                                    </ul>
                                </div>
                                <div className="car-tab-more">
                                    查看更多
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
                {this.props.commonStore.loadingStatus && <LoadingComponent/>}
                <MapTag/>
            </div>

        );
    }
}

export default carPage;
