/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {PureComponent} from "react";
import {InputItem} from "antd-mobile";
import "./index.less";

class SearchComponent extends PureComponent {

    render() {
        const {placeholder = "请搜索位置", styleExtend} = this.props;
        console.log(styleExtend);
        return (
            <div className="search-box" style={{color: "red"}}>
                <form action="#">
                    <InputItem
                        labelNumber={2}
                        type="search"
                        placeholder={placeholder}
                        extra={<i className="wbIcon-mic iconfont icon-mic"></i>}
                    >
                        <i className="wbIcon-search iconfont icon-search"></i>
                    </InputItem>
                </form>
            </div>
        );
    }
}

export default SearchComponent;