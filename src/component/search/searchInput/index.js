/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {PureComponent} from "react";
import "./index.less";

class SearchComponent extends PureComponent {
    constructor() {
        super();
        this.state = {
            inputValue: ""
        };
        this.searchWatchId = null;
    }

    submit(e) {
        e.preventDefault();
        this.props.toSearch(this.state.inputValue);
    }

    focusSearch() {
        this.props.focusSearch();
    }

    inputChange(e) {
        this.setState({
            inputValue: e.target.value
        });
        this.searchWatchId && clearTimeout(this.searchWatchId);
        this.searchWatchId = setTimeout(() => {
            this.props.toSearch(this.state.inputValue);
        }, 300);
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
                        <i className="wbIcon-search iconfont icon-fanhui1" style={{fontSize: "4.5vw"}}
                           onClick={() => this.goBack()}></i>
                        <input type="search" value={this.state.inputValue}
                               onChange={(e) => this.inputChange(e)}
                               onFocus={() => this.focusSearch()}
                               placeholder={placeholder}/>
                        <i className="wbIcon-mic iconfont icon-mic" style={{fontSize: "5vw"}}></i>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchComponent;