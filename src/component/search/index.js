/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {PureComponent} from "react";
import "./index.less";

class SearchComponent extends PureComponent {

    render() {
        const {placeholder = "请搜索位置"} = this.props;
        return (
            <div className="search-box" style={{color: "red"}}>
                <form action="#">
                    <div className="search-input">
                        <i className="wbIcon-search iconfont icon-search"></i>
                        <input type="search" placeholder={placeholder} />
                        <i className="wbIcon-mic iconfont icon-mic"></i>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchComponent;