/**
 * Created by j_bleach on 2018/9/21 0021.
 */

import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import CarouselComponent from "component/carousel";
import SearchInput from "component/search/searchInput";
import AccordionComponent from "component/accordion";
import SearchHistory from "component/search/searchHistory";
import SearchResult from "component/search/searchResult";
import SearchByVoice from "component/search/searchByVoice";
import MapTag from "component/map/mapTag";
// import ConfigTag from "component/map/config";
import http from "services/http";
import mapUrl from "config/url/map";
import event from "services/utils/event";

import {unique} from "services/utils/tool";
import {toJS} from "mobx";
import wx from "weixin-js-sdk";
import "./index.less";

// import LoadingComponent from "component/common/loading";

@inject("mapStore", "commonStore", "navStore")
@observer
class searchPage extends Component {
    constructor() {
        super();
        this.state = {
            carouselData: [], // 走马灯数组
            accordionData: [], // 手风琴数组
            showSearchResult: false, // 展示搜索结果
        };
        this.currPage = 1;
        this.currParams = {};
    }

    /**
     * @author j_bleach
     * @date 2018-09-25
     * @Description: 搜索方法
     * @param v:搜索输入框value
     */
    async toSearch(v) {
        this.currPage = 1;
        this.currParams = {};
        if (v.trim()) {
            let params = {
                zone_id: this.props.mapStore.mapId,
                page: 1,
                pageSize: 5,
                location: this.props.navStore.locateCoordinate,
                text: v
            };

            this.currParams = params;
            this.currPage++;

            this.props.commonStore.changeLoadingStatus(true);
            let response = await http.post(mapUrl.mapSearch, params);
            this.props.commonStore.changeLoadingStatus(false);
            this.setState({
                showSearchResult: true,
            }, () => {
                this.setState({searchResultData: response && response.list});
            });
            this.props.commonStore.changeSearchHistory(false);
            const historyRecords = localStorage.historyRecords
                ? unique([...JSON.parse(localStorage.historyRecords), {name: v}])
                : [{name: v}];
            localStorage.historyRecords = JSON.stringify(historyRecords);
        }
    }

    async getMore() {
        this.props.commonStore.changeLoadingStatus(true);
        this.currParams.page = this.currPage;
        let response = await http.post(mapUrl.mapSearch, this.currParams);
        this.props.commonStore.changeLoadingStatus(false);

        if (response) {
            this.currPage++;
            this.setState({
                searchResultData: this.state.searchResultData.concat(response.list)
            });
        }
    }

    componentDidMount() {
        if (this.props.commonStore.mapToSearchStatus) {
            document.querySelector(".search-container input").focus();
        }
    }

    closeVoicePanel(message) {
        this.props.commonStore.changeRecordPanel(false);
        event.searchEmitter.emit("toSearch", message);
    }

    focusSearch() {
        this.props.commonStore.changeSearchHistory(true);
    }


    render() {
        const {showSearchResult, searchResultData} = this.state;
        const {carouselData, accordionData} = this.props.mapStore;
        const {showSearchHistory} = this.props.commonStore;

        const searchProps = {
            toSearch: (e) => {
                this.toSearch(e);
            },
            focusSearch: () => {
                this.focusSearch();
            },
            iconStatus: showSearchHistory || showSearchResult,
            goBack: () => {
                if (this.state.showSearchResult == false && this.props.commonStore.showSearchHistory == false) {
                    wx.miniProgram.reLaunch({
                        url: "../index/index"
                    });
                }
                this.setState({
                    showSearchResult: false
                });
                this.props.commonStore.changeSearchHistory(false);
            }
        };

        const searchHistoryProps = {
            toSearch: (e) => {
                this.toSearch(e);
            },
        };
        const carouselProps = {
            data: carouselData,
            chooseArea: e => {
                const searchResultData = toJS(e).hospServiceFunction && e.hospServiceFunction.map(v => {
                    return {
                        coordinate: [v.longitude, v.latitude],
                        id: v.functionAreaId,
                        tags: {
                            name: v.areaName,
                            level: Number(v.floorId)
                        }
                    };
                });
                this.setState({
                    showSearchResult: true,
                }, () => {
                    this.setState({
                        searchResultData
                    });
                });
            }
        };
        const accordionProps = {
            data: accordionData,
            confirmMarker: (v) => {
                const data = {
                    point: [v.longitude, v.latitude],
                    floor: Number(v.floorId),
                    name: v.areaName
                };
                const status = this.props.commonStore.searchStatus;
                this.props.commonStore.changeSearchStatus(false);
                this.props.commonStore.changeSearchHistory(false);
                setTimeout(() => {
                    this.props.mapStore.confirmMarker(status, data);
                });
            }
        };
        return (
            <div className="wb-search-page">
                <div className="search-container">
                    {
                        this.props.commonStore.recordPanelStatus
                            ? <SearchByVoice closeVoicePanel={m => this.closeVoicePanel(m)}/>
                            : null
                    }
                    <SearchInput {...searchProps}/>
                </div>
                <div className="search-content" style={{overflowY:(showSearchHistory || showSearchResult) ? "hidden": "auto"}}>
                    <div className="mt-10 carousel-box carousel-content">
                        {<CarouselComponent {...carouselProps}/>}
                    </div>
                    <div className="mt-10 carousel-box">
                        {accordionData.length > 0 && <AccordionComponent {...accordionProps}/>}
                    </div>
                    {showSearchHistory && <SearchHistory {...searchHistoryProps}/>}
                    {showSearchResult && <SearchResult data={searchResultData} getMore={() => {
                        this.getMore();
                    }}/>}
                </div>
                {!showSearchHistory && !showSearchResult && <MapTag/>}
                {/*{!showSearchHistory && !showSearchResult && <ConfigTag/>}*/}
                {/*{this.props.commonStore.loadingStatus && <LoadingComponent/>}*/}
            </div>
        );
    }
}

export default searchPage;
