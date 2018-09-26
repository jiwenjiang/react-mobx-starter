/**
 * Created by j_bleach on 2018/9/25 0025.
 */

import React, {PureComponent} from "react";
import {List} from "antd-mobile";
import "./index.less";

class SearchHistory extends PureComponent {
    state = {
        historyRecords: []
    };

    componentDidMount() {
        this.setState({
            historyRecords: localStorage.historyRecords && JSON.parse(localStorage.historyRecords)
        });
    }

    /**
     * @author j_bleach
     * @date 2018-09-25
     * @Description: 删除本地存储项（这里使用更复杂的复合类型，而不直接使用简单值存储是为了之后的扩展）
     * @param e:待删除项
     */
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
                        {this.state.historyRecords.map(v =>
                            <List.Item
                                key={v.name}
                                thumb={<i className="iconfont icon-search" style={{fontSize: "3.9vw"}}></i>}
                                extra={<i className="iconfont icon-close" onClick={() => this.deleteRecord(v)}></i>}>
                                <span>{v.name}</span>
                            </List.Item>
                        )}
                    </List>
                </div>
            </div>
        );
    }
}

export default SearchHistory;