/**
 * Created by j_bleach on 2018/9/21 0021.
 */
/* eslint-disable */

import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import CarouselComponent from "component/carousel";
import SearchInput from "component/search/searchInput";
import AccordionComponent from "component/accordion";
import SearchHistory from "component/search/searchHistory";
import MapTag from "component/map/mapTag";
import http from "services/http";
import normalUrl from "config/url/normal";
import mapUrl from "config/url/map";
import "./index.less";

@inject("mapStore")
@observer
class listPage extends Component {
    constructor() {
        super();
        this.state = {
            carouselData: [],
            accordionData: []
        };
    }

    componentDidMount() {
        http.post(normalUrl.mapService, {mapId: 3}, (data) => {
            const carouselData = [];
            const accordionData = [];
            data && data.forEach(v => {
                if (v.serviceType === 1) {
                    carouselData.push(v);
                }
                if (v.serviceType === 2) {
                    accordionData.push(v);
                }
            });
            this.setState({
                carouselData,
                accordionData
            });
        });
    }

    toSearch() {

    }


    render() {
        const {carouselData, accordionData} = this.state;

        const searchProps = {
            toSearch: () => {
                this.toSearch();
            }
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
                    <SearchHistory></SearchHistory>
                </div>
                <MapTag/>
            </div>
        );
    }
}

export default listPage;