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
import MapTag from "component/map/mapTag";
import ConfigTag from "component/map/config";
import http from "services/http";
import mapUrl from "config/url/map";
import {unique} from "services/utils/tool";
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
            showSearchResult: false // 展示搜索结果
        };
    }

    /**
     * @author j_bleach
     * @date 2018-09-25
     * @Description: 搜索方法
     * @param v:搜索输入框value
     */
    async toSearch(v) {
        if (v.trim()) {
            let params = {
                zone_id: this.props.mapStore.mapId,
                page: 1,
                pageSize: 20,
                location: this.props.navStore.locateCoordinate,
                text: v
            };
            this.props.commonStore.changeLoadingStatus(true);
            let response = await http.post(mapUrl.mapSearch, params);
            this.props.commonStore.changeLoadingStatus(false);
            this.setState({
                showSearchResult: true,
                searchResultData: response && response.list
            });
            this.props.commonStore.changeSearchHistory(false);
            const historyRecords = localStorage.historyRecords
                ? unique([...JSON.parse(localStorage.historyRecords), {name: v}])
                : [{name: v}];
            localStorage.historyRecords = JSON.stringify(historyRecords);
        }
    }

    componentDidMount() {
        if (this.props.commonStore.mapToSearchStatus) {
            document.querySelector(".search-container input").focus();
        }
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
        const accordionProps = {
            data: accordionData
        };
        return (
            <div className="wb-search-page">
                <div className="search-container">
                    <SearchInput {...searchProps}></SearchInput>
                </div>
                <div className="search-content">
                    <div className="mt-10 carousel-box carousel-content">
                        {<CarouselComponent data={carouselData}></CarouselComponent>}
                    </div>
                    <div className="mt-10 carousel-box">
                        {accordionData.length > 0 && <AccordionComponent {...accordionProps}></AccordionComponent>}
                    </div>
                    {showSearchHistory && <SearchHistory {...searchHistoryProps}/>}
                    {showSearchResult && <SearchResult data={searchResultData}/>}
                </div>
                {!showSearchHistory && !showSearchResult && <MapTag/>}
                {!showSearchHistory && !showSearchResult && <ConfigTag/>}
                {/*{this.props.commonStore.loadingStatus && <LoadingComponent/>}*/}
            </div>
        );
    }
}

export default searchPage;