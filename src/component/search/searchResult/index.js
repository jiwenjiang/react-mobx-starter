/**
 * Created by j_bleach on 2018/9/25 0025.
 */

import React, {Component} from "react";
import {List} from "antd-mobile";
import "./index.less";
import {inject, observer} from "mobx-react";
// import imgSrc from "assets/img/referrence.png";
import notData from "assets/img/404.png";

@inject("mapStore", "floorStore", "commonStore")
@observer
class SearchResult extends Component {
    state = {
        searchResult: []
    };

    componentDidMount() {
        // this.setState({
        //     searchResult: this.props.data || []
        // });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            searchResult: nextProps.data || []
        });
    }

    confirmMarker(v) {
        const data = {
            point: v.coordinate,
            floor: v.tags.level ? Number(v.tags.level) : 0,
            name: v.tags.name
        };
        const status = this.props.commonStore.searchStatus;
        this.props.commonStore.changeSearchStatus(false);
        this.props.commonStore.changeSearchHistory(false);
        setTimeout(() => {
            this.props.mapStore.confirmMarker(status, data);
        });
    }

    render() {
        return (
            this.state.searchResult.length ? <div className="search-history-box canBeScroll">
                    <div className="search-history-content canBeScroll">
                        <List>
                            {this.state.searchResult.map(v =>
                                <List.Item
                                    className="search-result-right"
                                    key={v.id}
                                    thumb={<i className="iconfont icon-didian canBeScroll"
                                              style={{fontSize: "4.5vw", color: "#1cccc6"}}/>}
                                    extra={<div className="search-result-extra canBeScroll"
                                                onClick={() => this.confirmMarker(v)}>
                                        <i className="iconfont icon-quzheli canBeScroll"
                                           style={{
                                               color: "#1cccc6",
                                               fontSize: "7vw",
                                               display: "block",
                                               marginRight: "1vw"
                                           }}/>
                                        <span style={{
                                            fontSize: "3vw",
                                            color: "#1cccc6",
                                            display: "block",
                                            marginTop: "-1vw"
                                        }}>{this.props.commonStore.searchStatus === "start" ? "出发" : "去这里"}</span>
                                    </div>}>
                                    <div className="search-result-content canBeScroll">
                                        <div style={{
                                            width: "56vw",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {v.tags.name}
                                            {/*v.tags.name.length > 9 ? v.tags.name.slice(0, 16) + "..." : v.tags.name*/}
                                        </div>
                                    </div>
                                    <List.Item.Brief>
                                        {`${v.tags.level
                                            ? `在${v.tags.level >= 0 ? Number(v.tags.level) + 1 : Number(v.tags.level)}楼`
                                            : ""}
                                      ${v.distance ? `距离：${v.distance}米` : ""}`}
                                    </List.Item.Brief>
                                </List.Item>
                            )}
                            <div className="car-tab-more" onClick={this.props.getMore}>查看更多</div>
                        </List>
                    </div>
                </div> :
                <div className="search-history-nodata-box">
                    <div className="search-history-nodata" style={{boxShadow:'none',background:'none'}}>
                        <img src={notData} alt=""/>
                        <div className="" style={{textAlign:'center',color:'#63A8A8',fontSize:'1rem'}}>
                            没有查询到相关信息 !
                        </div>
                    </div>
                </div>
        );
    }
}

export default SearchResult;
