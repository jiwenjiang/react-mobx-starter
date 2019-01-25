/**
 * Created by j_bleach on 2018/10/27 0027.
 */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import "./index.less";
import nav from "services/navSDK";
import ConfirmModal from "component/common/confirmModal";
import {handleDistance} from "services/utils/tool";


@inject("mapStore", "navStore", "floorStore", "commonStore")
@observer
class navBottom extends Component {
    state = {
        exitModalStatus: false
    };

    componentDidMount() {
    }

    exit() {
        this.setState({
            exitModalStatus: true
        });
    }

    changePauseStatus() {
        nav.pauseSim(this.props.navStore.simPauseStatus);
        this.props.navStore.updateSimPauseStatus(!this.props.navStore.simPauseStatus);
    }

    pauseAudio() {
        this.props.commonStore.changeAllowAudio(!this.props.commonStore.allowAudioPlay);
    }

    render() {
        const {startMarkerPoint, endMarkerPoint} = this.props.mapStore;
        const {exitModalStatus} = this.state;
        const {mapFloor} = this.props.floorStore;
        const {navRealData, simPauseStatus, navMode} = this.props.navStore;
        const confirmModalProps = {
            text: `温馨提示`,
            textStyle: {color: "#13B1AC", fontSize: "3vw"},
            address: `确认退出导航？`,
            boxStyle: {
                marginTop: "-6vw",
                marginBottom: "6vw"
            },
            addressStyle: {color: "#13B1AC", fontSize: "3.4vw"},
            confirm: () => {
                if (this.props.navStore.navMode == "real") {
                    nav.stopNav();
                }
                if (this.props.navStore.navMode == "sim") {
                    nav.stopSim();
                }
                this.props.navStore.completeNav(this.props.mapStore);
                if (this.props.navStore.currentLocation) {
                    this.props.navStore.moveFreeMarker(this.props.mapStore, this.props.navStore.currentLocation);
                }
            },
            cancel: () => {
                this.setState({
                    exitModalStatus: false
                });
            }
        };

        return (
            <div className="begin-nav-container">
                {exitModalStatus && <ConfirmModal {...confirmModalProps}></ConfirmModal>}
                {navMode == "sim" &&
                <div className={`nav-bottom-simPause ${simPauseStatus ? "continueColor" : "pauseColor"}`}
                     onClick={() => this.changePauseStatus()}>
                    <i className="iconfont icon-daohang2"></i>
                    <span>{simPauseStatus ? "继续" : "暂停"}</span>
                </div>}
                <div className="nav-bottom-box" id="nav-bottom">
                    <div className="map-goToShare-head">
                        <div className="map-goToShare-name">
                            <div className="nav-bottom-floor">
                                <span>({mapFloor < 0 ? `B${-mapFloor}` : `${mapFloor + 1}F`})</span>
                                &ensp;{startMarkerPoint && startMarkerPoint.name || "当前位置"}
                            </div>
                            <div className="nav-bottom-notice">
                                {navRealData && navRealData.leftDistance
                                && `距离目的地${navRealData && handleDistance(navRealData.leftDistance)}`}
                                &emsp;
                            </div>
                        </div>
                        <div className="stop-audio" onClick={() => {
                            this.pauseAudio();
                        }}>
                            <i className={`iconfont ${this.props.commonStore.allowAudioPlay ? "icon-laba" : "icon-jingyin"}`}></i>
                        </div>
                        <div className="begin-nav-exit" style={{color: "#999999", top: "4.5vw"}}
                             onClick={() => this.exit()}>
                            <span>退出</span>
                        </div>
                        <hr/>
                    </div>
                    <div className="map-goToShare-share begin-nav-box">
                        <i className="iconfont icon-didian"></i>&nbsp;
                        <span style={{color: "#000000"}}>目的地：</span>
                        <span style={{color: "#0592FF"}}>{endMarkerPoint && endMarkerPoint.name}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default navBottom;
