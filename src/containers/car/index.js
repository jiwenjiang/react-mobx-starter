/**
 * Created by j_bleach on 2018/9/26 0026.
 */
import React, {Component} from "react";
import {Tabs} from "antd-mobile";
import {observer, inject} from "mobx-react";

import "./index.less";
import LoadingComponent from "component/common/loading";
import http from "services/http";
import MapTag from "component/map/mapTag";
import normalUrl from "config/url/normal";
import mapUrl from "config/url/map";


@inject("mapStore", "commonStore", "navStore")
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
                http.post(valueName === "carIdValue" ? normalUrl["searchCarByNumber"] : mapUrl["mapSearch"],
                    valueName === "carIdValue" ? {
                        mapid: this.props.mapStore.mapId,
                        carno: value
                    } : {
                        zone_id: this.props.mapStore.mapId,
                        page: 1,
                        pageSize: 20,
                        location: this.props.navStore.locateCoordinate,
                        text: value
                    }, (data) => {
                        this.props.commonStore.changeLoadingStatus(false);
                        const listData = valueName === "carIdValue" ? data.result : data.list;
                        this.setState({
                            [listName]: listData
                        });
                    });
            }, 500);
        }
    }

    async confirmMarkerByCar(v) {
        this.props.commonStore.changeLoadingStatus(true);
        const carRes = await http.post(normalUrl.searchCarByPosition, {
            mapid: this.props.mapStore.mapId,
            carno: v
        });

        const markRes = await http.post(mapUrl.mapPOISearch, {
            page: 1,
            pageSize: 20,
            text: carRes.result.no,
            floorid: carRes.result.floorno,
            zone_id: this.props.mapStore.mapId,
            location: this.props.navStore.locateCoordinate,
        });
        const data = {
            point: markRes.list[0].coordinate,
            floor: carRes.result.floorno,
            name: carRes.result.no
        };
        this.props.commonStore.changeLoadingStatus(false);
        this.props.mapStore.confirmMarker(this.props.commonStore.searchStatus, data);
        this.props.commonStore.changeSearchStatus(false);
    }

    confirmMarkerByPosition(v) {
        const data = {
            point: v.coordinate,
            floor: v.tags.level,
            name: v.tags.name
        };
        this.props.mapStore.confirmMarker(this.props.commonStore.searchStatus, data);
        this.props.commonStore.changeSearchStatus(false);
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
                                                <span>{v}</span>
                                                <i className="iconfont icon-daohang"
                                                   onClick={() => this.confirmMarkerByCar(v)}></i>
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
                                            <li key={v.id}>
                                                <span>{`${v.tags.level >= 0
                                                    ? `${Number(v.tags.level) + 1}F`
                                                    : `B${-Number(v.tags.level)}`}`}-{v.tags.name}</span>
                                                <i className="iconfont icon-daohang"
                                                   onClick={() => this.confirmMarkerByPosition(v)}></i>
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
