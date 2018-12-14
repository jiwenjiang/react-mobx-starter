/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {PureComponent} from "react";
import "./index.less";

import event from "services/utils/event";
import {inject} from "mobx-react";

@inject("commonStore")
class SearchComponent extends PureComponent {
    constructor() {
        super();
        this.state = {
            inputValue: "",
            voicePanel: false
        };
        this.searchWatchId = null;
    }


    componentDidMount() {
        event.searchEmitter.addListener("toSearch", msg => {
            this.inputChange({target: {value: msg}});
        });
    }

    // 组件销毁前移除事件监听
    componentWillUnmount() {
        event.searchEmitter.removeAllListeners();
    }

    submit(e) {
        e.preventDefault();
        this.props.toSearch(this.state.inputValue);
    }

    focusSearch(e) {
        this.props.focusSearch(e);
    }

    searchByVoice() {
        if (this.props.commonStore.projectType === "car") {
            this.props.commonStore.changeProjectType("Car");
        }

        !this.props.commonStore.searchStatus && this.props.commonStore.changeSearchStatus("end");

        this.props.commonStore.changeRecordPanel(true);

        this.props.commonStore.projectType === "Car" && this.props.commonStore.changeRecordType("plate");
    }

    inputChange(e) {
        const status = this.props.commonStore.loadingStatus;
        let value = status ? this.state.inputValue : e.target.value;

        this.setState({
            inputValue: value
        });
        this.searchWatchId && clearTimeout(this.searchWatchId);
        this.searchWatchId = setTimeout(() => {
            this.props.toSearch && this.props.toSearch(this.state.inputValue);
        }, 1000);
    }

    goBack() {
        this.setState({
            inputValue: ""
        });
        this.props.goBack();
    }

    render() {
        const {placeholder = "请搜索位置", extendStyle} = this.props;
        return (
            <div className="search-box">

                <form action="#" id="searchForm" onSubmit={(e) => this.submit(e)}>
                    <div className={`search-input ${extendStyle}`}>
                        {/*{*/}
                        {/*iconStatus*/}
                        {/*? <i className="wbIcon-search iconfont icon-fanhui1" style={{fontSize: "4.5vw"}}*/}
                        {/*onClick={() => this.props.goBack()}></i>*/}
                        {/*: <i className="wbIcon-search iconfont icon-search" style={{fontSize: "4.5vw"}}></i>*/}
                        {/*}*/}
                        {/*<div onClick={() => this.goBack()}>*/}
                            <i onClick={() => this.goBack()} className="wbIcon-search iconfont icon-fanhui1"
    // style={{fontSize: "4.5vw", padding: ".2rem", paddingTop: ".25rem"}}
    />
                        {/*</div>*/}
                        {/*<div>*/}
                            <input type="search" value={this.state.inputValue} id="searchInput"
                                   onChange={(e) => this.inputChange(e)}
                                   onFocus={(e) => this.focusSearch(e)}
                                   placeholder={placeholder}/>
                        {/*</div>*/}
                        {/*<div onClick={() => this.searchByVoice()}>*/}
                            <i onClick={() => this.searchByVoice()} className="wbIcon-mic iconfont icon-mic"
                               // style={{fontSize: "5vw", paddingTop: "2vw"}}
                            />
                        {/*</div>*/}
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchComponent;
