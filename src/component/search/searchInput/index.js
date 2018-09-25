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
        console.log(this.state.inputValue);
    }

    render() {
        const {placeholder = "请搜索位置"} = this.props;
        return (
            <div className="search-box">
                <form action="#" id="searchForm" onSubmit={(e) => this.submit(e)}>
                    <div className="search-input">
                        <i className="wbIcon-search iconfont icon-search"></i>
                        <input type="search" value={this.state.inputValue}
                               onChange={(e) => this.setState({
                                   inputValue: e.target.value
                               })}
                               placeholder={placeholder}/>
                        <i className="wbIcon-mic iconfont icon-mic"></i>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchComponent;