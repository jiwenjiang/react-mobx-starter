/**
 * Created by j_bleach on 2018/9/25 0025.
 */

import React, {PureComponent} from "react";
import {List} from "antd-mobile";
import "./index.less";

class SearchResult extends PureComponent {
    state = {
        searchResult: []
    };

    componentDidMount() {
        this.setState({
            searchResult: this.props.data || []
        });
    }

    deleteRecord(e) {
        let recordArr = JSON.parse(localStorage.historyRecords);
        recordArr = recordArr.filter(v => v.name !== e.name);
        localStorage.historyRecords = JSON.stringify(recordArr);
        this.setState({
            historyRecords: recordArr
        });
    }

    render() {
        return (
            <div className="search-history-box">
                <div className="search-history-content">
                    <List>
                        {this.state.searchResult.map(v =>
                            <List.Item
                                key={v.id}
                                thumb={<i className="iconfont icon-didian"
                                          style={{fontSize: "4.5vw", color: "#1cccc6"}}></i>}
                                extra={<div className="search-result-extra">
                                    <i className="iconfont icon-quzheli"
                                       style={{
                                           color: "#1cccc6",
                                           fontSize: "7vw",
                                           display: "block",
                                           marginRight: "1vw"
                                       }}
                                       onClick={() => this.deleteRecord(v)}></i>
                                    <span style={{
                                        fontSize: "3vw",
                                        color: "#1cccc6",
                                        display: "block",
                                        marginTop: "-1vw"
                                    }}>去这里</span>
                                </div>}>
                                <p className="search-result-content">{v.tags.name}</p>
                                <List.Item.Brief>{`在${v.tags.level}楼  距离：${v.distance}米`}</List.Item.Brief>
                            </List.Item>
                        )}
                    </List>
                </div>
            </div>
        );
    }
}

export default SearchResult;