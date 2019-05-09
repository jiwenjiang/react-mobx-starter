/**
 * Created by j_bleach on 2019/5/8 0008.
 */

/*eslint-disable*/
import React, {PureComponent} from "react";
import "./index.less";

class MapSdk extends PureComponent {

    componentDidMount() {
    }

    render() {
        return (
            <span className="cool-btn" onClick={this.props.clickCb}>{this.props.text}</span>
        );
    }
}

export default MapSdk;
