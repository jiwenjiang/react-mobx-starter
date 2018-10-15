/**
 * Created by j_bleach on 2018/9/25 0025.
 */

import React, {Component} from "react";
import {List} from "antd-mobile";
import "./index.less";
import {inject, observer} from "mobx-react";

@inject("mapStore", "floorStore", "commonStore")
@observer
class SearchResult extends Component {
    state = {
        searchResult: []
    };

    componentDidMount() {
        this.setState({
            searchResult: this.props.data || []
        });
    }

    confirmMarker(v) {
        const data = {
            point: v.coordinate,
            floor: Number(v.tags.level),
            name: v.tags.name
        };
        this.props.mapStore.confirmMarker(this.props.commonStore.searchStatus, data);
        this.props.commonStore.changeSearchStatus(false);
        this.props.commonStore.changeSearchHistory(false);
    }

    render() {
        return (
            <div className="search-history-box canBeScroll">
                <div className="search-history-content canBeScroll">
                    <List>
                        {this.state.searchResult.map(v =>
                            <List.Item
                                key={v.id}
                                thumb={<i className="iconfont icon-didian canBeScroll"
                                          style={{fontSize: "4.5vw", color: "#1cccc6"}}></i>}
                                extra={<div className="search-result-extra canBeScroll"
                                            onClick={() => this.confirmMarker(v)}>
                                    <i className="iconfont icon-quzheli canBeScroll"
                                       style={{
                                           color: "#1cccc6",
                                           fontSize: "7vw",
                                           display: "block",
                                           marginRight: "1vw"
                                       }}></i>
                                    <span style={{
                                        fontSize: "3vw",
                                        color: "#1cccc6",
                                        display: "block",
                                        marginTop: "-1vw"
                                    }}>{this.props.commonStore.searchStatus === "start" ? "出发" : "去这里"}</span>
                                </div>}>
                                <p className="search-result-content canBeScroll">{v.tags.name}</p>
                                <List.Item.Brief>
                                    {`在${v.tags.level >= 0 ? Number(v.tags.level) + 1 : Number(v.tags.level)}楼
                                      ${v.distance ? `距离：${v.distance}米` : ""}`}
                                </List.Item.Brief>
                            </List.Item>
                        )}
                    </List>
                </div>
            </div>
        );
    }
}

export default SearchResult;