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
            move: true,
            rotate: true,
            lean: true,
            zoom: true,
            click: true
        };
    }

    componentDidMount() {
        this.props.commonStore.updateRouteMsg({
            iframeUrl: "//jsrun.net/rKyKp/embedded/js/dark/",
            title: "地图手势控制"
        });
        setTimeout(() => {
            this.props.commonStore.mapObj.on("click", (e) => {
                if (this.state.click) {
                    alert(JSON.stringify(e.point));
                }
            });
        }, 1000);
    }

    moveCheck() {
        this.setState({
            move: !this.state.move
        }, () => {
            if (!this.state.move) {
                this.props.commonStore.mapObj.dragPan.disable();
            } else {
                this.props.commonStore.mapObj.dragPan.enable();
            }
        });
    }

    rotateCheck() {
        this.setState({
            rotate: !this.state.rotate
        }, () => {
            if (!this.state.rotate) {
                this.props.commonStore.mapObj.dragRotate.disable();
            } else {
                this.props.commonStore.mapObj.dragRotate.enable();
            }
        });
    }

    leanCheck() {
        this.setState({
            lean: !this.state.lean
        }, () => {
            if (!this.state.lean) {
                this.props.commonStore.mapObj.dragRotate.disable();
            } else {
                this.props.commonStore.mapObj.dragRotate.enable();
            }
        });
    }

    zoomCheck() {
        this.setState({
            zoom: !this.state.zoom
        }, () => {
            if (!this.state.zoom) {
                this.props.commonStore.mapObj.scrollZoom.disable();
            } else {
                this.props.commonStore.mapObj.scrollZoom.enable();
            }
        });
    }

    clickCheck() {
        this.setState({
            click: !this.state.click
        });
    }

    render() {
        return (
            <div className="control-panel">
                <div className="panel-title">控制地图操作面板</div>
                <ul className="panel-list">
                    <li>
                        <label><input type="checkbox" checked={this.state.move}
                                      onClick={() => this.moveCheck()}/>&nbsp;支持移动地图</label>
                    </li>
                    <li>
                        <label><input type="checkbox" checked={this.state.rotate}
                                      onChange={() => this.rotateCheck()}/>&nbsp;支持旋转地图</label>
                    </li>
                    <li>
                        <label><input type="checkbox" checked={this.state.lean}
                                      onClick={() => this.leanCheck()}/>&nbsp;支持倾斜地图</label>
                    </li>
                    <li>
                        <label><input type="checkbox" checked={this.state.zoom}
                                      onClick={() => this.zoomCheck()}/>&nbsp;支持缩放地图</label>
                    </li>
                    <li>
                        <label><input type="checkbox" checked={this.state.click}
                                      onClick={() => this.clickCheck()}/>&nbsp;支持单击地图</label>
                    </li>
                </ul>
            </div>
        );
    }
}

export default homePage;
