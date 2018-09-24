/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import CarouselComponent from "component/carousel";
import SearchComponent from "component/search";
import AccordionComponent from "component/accordion";
import MapTag from "component/map/mapTag";
import "./index.less";


@inject("mapStore")
@observer
class listPage extends Component {
    state = {
        listArr: [
            {name: "理想中心", mapId: 2},
            {name: "路易艺术城堡", mapId: 1},
            {name: "成都妇女儿童医院", mapId: 3}
        ]
    };

    componentDidMount() {
        this.setState({
            data: ["AiyWuByWklrrUDlFignR", "TekJlZRVCjLFexlOCuWn", "IJOtIlfsYdTyaDTRVrLI"]
        });
    }


    render() {
        const searchProps = {
            styleExtend: {
                "borderRadius": 5,
                "backgroundColor": "rgba(183, 253, 251, 1)"
            }
        };
        const accordionProps = {
            data: [{name: "儿童保健指导中心", id: 0, floor: "1楼"},
                {name: "儿童保健指导中心", id: 1, floor: "2楼"},
                {name: "儿童保健指导中心", id: 2, floor: "3楼"}]
        }
        return (
            <div className="wb-search-page">
                <div className="search-container">
                    <SearchComponent {...searchProps}></SearchComponent>
                </div>
                <div className="search-content">
                    <div className="mt-10 carousel-box">
                        <CarouselComponent data={this.state.data}></CarouselComponent>
                    </div>
                    <div className="mt-10 carousel-box">
                        <AccordionComponent {...accordionProps}></AccordionComponent>
                    </div>
                </div>
                <MapTag/>
            </div>
        );
    }
}

export default listPage;