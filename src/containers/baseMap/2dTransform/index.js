/**
 * Created by j_bleach on 2019/5/10 0010.
 */

/*eslint-disable*/
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import "./index.less";

@inject("commonStore")
@observer
class homePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: true
        };
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/AKyKp/embedded/js/dark/",
            title: "3D/2D视角切换"
        });
    }

    changeMode(v) {
        this.setState({
            mode: v
        }, () => {
            if (this.state.mode) {
                this.props.commonStore.mapObj.setPitch(0);
            } else {
                this.props.commonStore.mapObj.setPitch(60);
            }
        });
    }

    render() {
        return (
            <div className="transformBtn">
                <div className={this.state.mode ? "black-bg" : "white-bg"}
                     onClick={() => this.changeMode(true)}>2D视角切换
                </div>
                <div className={!this.state.mode ? "black-bg" : "white-bg"}
                     onClick={() => this.changeMode(false)}>3D视角切换
                </div>
            </div>
        );
    }
}

export default homePage;
