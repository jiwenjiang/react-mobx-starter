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
    }

    submit(e) {
        e.preventDefault();
        this.props.toSearch(this.state.inputValue);
    }

    render() {
        const {placeholder = "请搜索位置", extendStyle, iconStatus} = this.props;
        return (
            <div className="search-box">
                <form action="#" id="searchForm" onSubmit={(e) => this.submit(e)}>
                    <div className={`search-input ${extendStyle}`}>
                        {
                            iconStatus
                                ? <i className="wbIcon-search iconfont icon-fanhui1" style={{fontSize: "4.5vw"}}
                                     onClick={() => this.props.goBack()}></i>
                                : <i className="wbIcon-search iconfont icon-search" style={{fontSize: "4.5vw"}}></i>
                        }
                        <input type="search" value={this.state.inputValue}
                               onChange={(e) => this.setState({
                                   inputValue: e.target.value
                               })}
                               onFocus={() => this.props.focusSearch()}
                               placeholder={placeholder}/>
                        <i className="wbIcon-mic iconfont icon-mic" style={{fontSize: "5vw"}}></i>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchComponent;