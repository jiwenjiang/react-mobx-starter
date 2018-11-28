/**
 * Created by j_bleach on 2018/9/26 0026.
 */
import React, {Component} from "react";
import {Tabs} from "antd-mobile";
import {observer, inject} from "mobx-react";

import "./index.less";
import http from "services/http";
import MapTag from "component/map/mapTag";
import normalUrl from "config/url/normal";
import mapUrl from "config/url/map";
import SearchByVoice from "component/search/searchByVoice";

// import event from "services/utils/event";


@inject("mapStore", "commonStore", "navStore")
@observer
class carPage extends Component {
    state = {
        carIdValue: "",
        carPositionValue: "",
        positionList: [],
        carList: []
    };
    tabTitles = [
        {title: "车牌寻车", sub: "1"},
        {title: "车位寻车", sub: "2"},
    ];
    currPage = 1;
    currKeyword = '';

    componentDidMount() {
        // window.car = this;
    }

    searchCar(e, valueName, listName) {

        let minLength = listName === 'carList' ? 4 : 1;

        let value = e.target.value;
        this.setState({
            [valueName]: value
        });

        this.currPage = 1;
        this.currKeyword = '';

        clearTimeout(this.searchCarByNumber);
        if (value.length >= minLength) {
            value = value.toUpperCase();
            this.currKeyword = value;
            this.searchCarByNumber = setTimeout(() => this.search(valueName, listName), 1000)
        }
    }

    search(valueName, listName) {
        this.props.commonStore.changeLoadingStatus(true);
        http.post(valueName === "carIdValue" ? normalUrl["searchCarByNumber"] : mapUrl["mapSearch"],
            valueName === "carIdValue" ?
                {
                    mapid: this.props.mapStore.mapId,
                    carno: this.currKeyword
                } :
                {
                    zone_id: this.props.mapStore.mapId,
                    page: this.currPage,
                    pageSize: 5,
                    location: this.props.navStore.locateCoordinate,
                    text: this.currKeyword
                }, data => {

                this.props.commonStore.changeLoadingStatus(false);

                let listData = valueName === "carIdValue" ? data.result : data.list;
                if (!listData.length) {
                    listData = ['noResult']
                }

                if (listName === 'positionList') {
                    this.currPage++
                }

                this.setState({
                    [listName]: listData
                })
            })
    }

    searchByVoice(type) {
        if (this.props.commonStore.projectType === "car") {
            this.props.commonStore.changeProjectType("Car");
        }
        this.props.commonStore.changeSearchStatus("end");

        this.props.commonStore.changeRecordPanel(true);

        this.props.commonStore.changeRecordType(type);
    }

    closeVoicePanel(value) {
        this.currPage = 1;
        this.currKeyword = '';

        this.props.commonStore.changeRecordPanel(false);
        let valueName;
        let listName;
        let recordType = this.props.commonStore.recordType;

        if (recordType === 'plate') {
            valueName = "carIdValue";
            listName = "carList";

        } else if (recordType === 'berth') {
            valueName = "carPositionValue";
            listName = "positionList";
        }
        this.setState({[valueName]: value});
        if (value.length) {
            value = value.toUpperCase();
            this.currKeyword = value;

            this.search(valueName, listName)
        }
    }

    getMore() {
        this.props.commonStore.changeLoadingStatus(true);

        http.post(mapUrl["mapSearch"],
            {
                zone_id: this.props.mapStore.mapId,
                page: this.currPage,
                pageSize: 5,
                location: this.props.navStore.locateCoordinate,
                text: this.currKeyword
            }, data => {
                this.props.commonStore.changeLoadingStatus(false);
                this.currPage++;
                const listData = data.list;
                this.setState({
                    positionList: this.state.positionList.concat(listData)
                });
            })
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
                {
                    this.props.commonStore.recordPanelStatus
                        ? <SearchByVoice closeVoicePanel={m => this.closeVoicePanel(m)}/>
                        : null
                }
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
                                    <input type="search" placeholder="请输入至少四位车牌号"
                                           value={carIdValue}
                                           maxLength="8"
                                           onChange={v => this.searchCar(v, "carIdValue", "carList")}/>
                                    <i className="wbIcon-mic iconfont icon-mic"
                                       onClick={() => this.searchByVoice('plate')}
                                       style={{fontSize: "5vw"}}/>
                                </div>
                                <div className="car-tab-list">
                                    {carList[0] !== 'noResult'
                                        ? <ul>
                                            {carList.map(v =>
                                                <li key={v}>
                                                    <span>{v}</span>
                                                    <i className="iconfont icon-daohang"
                                                       onClick={() => this.confirmMarkerByCar(v)}/>
                                                </li>
                                            )}
                                        </ul>
                                        : <ul>
                                            <li>
                                                <span>查无结果，请检查输入！</span>
                                            </li>
                                        </ul>}
                                </div>
                                {/*<div className="car-tab-more">*/}
                                {/*查看更多*/}
                                {/*</div>*/}
                            </div>
                            <div className="car-tab-one">
                                <div className="car-tab-demo">例：113</div>
                                <div className="car-tab-input">
                                    <input type="text" placeholder="请输入车位号"
                                           value={carPositionValue}
                                           maxLength="8"
                                           onChange={(v) => this.searchCar(v, "carPositionValue", "positionList")}/>
                                    <i className="wbIcon-mic iconfont icon-mic"
                                       onClick={() => this.searchByVoice('berth')}
                                       style={{fontSize: "5vw"}}/>
                                </div>
                                <div className="car-tab-list">
                                    {
                                        positionList[0] !== 'noResult' ? <ul>
                                            {positionList.map(v => {
                                                    return <li key={v.id}>
                                                <span>{`${v.tags.level >= 0
                                                    ? `${Number(v.tags.level) + 1}F`
                                                    : `B${-Number(v.tags.level)}`}`}-{v.tags.name}</span>
                                                        <i className="iconfont icon-daohang"
                                                           onClick={() => this.confirmMarkerByPosition(v)}/>
                                                    </li>
                                                }
                                            )
                                            }
                                        </ul> : null
                                    }
                                </div>
                                {
                                    positionList.length ? <div className="car-tab-more" onClick={() => {
                                        this.getMore()
                                    }}>
                                        查看更多
                                    </div> : null
                                }
                            </div>
                        </Tabs>
                    </div>
                </div>
                <MapTag/>
            </div>

        );
    }
}

export default carPage;
