/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import CarouselComponent from "component/carousel";
import SearchComponent from "component/search";
import "./index.less";


@inject("mapStore")
@observer
class listPage extends Component {
    state = {
        listArr: [
            {name: "理想中心", mapId: 2},
            {name: "路易艺术城堡", mapId: 1},
            {name: "成都妇女儿童医院", mapId: 3},
        ]
    };

    componentDidMount() {
        this.setState({
            data: ["AiyWuByWklrrUDlFignR", "TekJlZRVCjLFexlOCuWn", "IJOtIlfsYdTyaDTRVrLI"],
        });
    }


    render() {
        const searchProps = {
            styleExtend: {
                "borderRadius": 5,
                "backgroundColor": "rgba(183, 253, 251, 1)"
            }
        };
        return (
            <div className="wb-search-page">
                <div className="search-container">
                    <SearchComponent {...searchProps}></SearchComponent>
                </div>
                <div className="search-content">
                    <div className="mt-10 carousel-box">
                        <CarouselComponent data={this.state.data}></CarouselComponent>
                    </div>
                </div>
            </div>
        );
    }
}

export default listPage;