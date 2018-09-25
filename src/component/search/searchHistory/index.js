/**
 * Created by j_bleach on 2018/9/25 0025.
 */
import React, {PureComponent} from "react";
import {List} from "antd-mobile";
import "./index.less";

class SearchHistory extends PureComponent {

    render() {
        return (
            <div className="search-history-box">
                <div className="search-history-panel">
                    <span style={{color: "rgba(153,153,153,1)"}}>历史搜索</span>
                    <span className="clear-history">清空历史记录</span>
                </div>
                <div className="search-history-content">
                    <List>
                        {localStorage.historyRecords && localStorage.historyRecords.map(v => {
                            <List.Item
                                thumb={<i className="iconfont icon-search" style={{fontSize: "3.9vw"}}></i>}
                                extra={<i className="iconfont icon-close"></i>}>
                                <span>{v.name}</span>
                            </List.Item>;
                        })}
                    </List>
                </div>
            </div>
        );
    }
}

export default SearchHistory;