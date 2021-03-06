/**
 * Created by j_bleach on 2018/9/25 0025.
 */
import React, {PureComponent} from "react";
import {List} from "antd-mobile";
import imgSrc from "assets/img/referrence.png";
import "./index.less";
import event from "services/utils/event";


class SearchHistory extends PureComponent {
    state = {
        historyRecords: []
    };

    componentDidMount() {
        const historyRecords = (localStorage.historyRecords && JSON.parse(localStorage.historyRecords)) || [];
        this.setState({
            historyRecords: historyRecords.reverse()
        });
    }

    /**
     * @author j_bleach
     * @date 2018-09-25
     * @Description: 删除本地存储项（这里使用更复杂的复合类型，而不直接使用简单值存储是为了之后的扩展）
     * @param e:待删除项
     */
    deleteRecord(item, e) {
        e.preventDefault();
        e.stopPropagation();
        let recordArr = JSON.parse(localStorage.historyRecords);
        recordArr = recordArr.filter(v => v.name !== item.name);
        localStorage.historyRecords = JSON.stringify(recordArr);
        this.setState({
            historyRecords: recordArr
        });
    }

    clearAll() {
        localStorage.historyRecords = JSON.stringify([]);
        this.setState({
            historyRecords: []
        });
    }

    toSearch(v) {
        event.searchEmitter.emit("toSearch", v.name);
    }

    render() {
        return (
            <div className="search-history">
                {this.state.historyRecords.length > 0
                    ? <div className="search-history-box">
                        <div className="search-history-panel">
                            <span style={{color: "rgba(153,153,153,1)"}}>历史搜索</span>
                            <span className="clear-history" onClick={() => this.clearAll()}>清空历史记录</span>
                        </div>
                        <div className="search-history-content">
                            <List>
                                {this.state.historyRecords.map(v =>
                                    <List.Item
                                        onClick={() => this.toSearch(v)}
                                        key={v.name}
                                        thumb={<i className="iconfont icon-search" style={{fontSize: "3.9vw"}}/>}
                                        extra={<i className="iconfont icon-close" style={{padding:'2vw'}}
                                                  onClick={(e) => this.deleteRecord(v, e)}/>}>
                                        <span>{v.name}</span>
                                    </List.Item>
                                )}
                            </List>
                        </div>
                    </div>
                    : <div className="search-history-nodata-box">
                        <div className="search-history-nodata">
                            <img src={imgSrc} alt=""/>
                            <div className="search-history-text">
                                <p>支持地点、兴趣点文字搜索</p>
                                <p style={{marginLeft: "4vw"}}>还支持语音搜索哦！！</p>
                            </div>
                        </div>
                    </div>}
            </div>
        );
    }
}

export default SearchHistory;
