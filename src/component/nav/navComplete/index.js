/**
 * Created by j_bleach on 2018/11/1 0001.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import iconSrc from "assets/img/navEnd.png";
import "./index.less";

@inject("navStore")
@observer
class navComplete extends Component {
    state = {
        number: 4,
        tarArr: [
            {
                text: "体验流畅",
                active: false
            },
            {
                text: "提示贴心",
                active: false
            },
            {
                text: "定位不准",
                active: true
            },
            {
                text: "信息有误",
                active: false
            },
        ]
    };


    renderTag(i) {
        let tarArr = this.state.tarArr;
        tarArr = tarArr.map((v, index) => {
            if (index === i) {
                return {
                    text: v.text,
                    active: !v.active
                };
            } else {
                return v;
            }
        });
        this.setState({
            tarArr
        });
    }

    renderStar(number) {
        this.setState({
            number
        });
    }

    closeModal() {
        this.props.navStore.changeEvaluateStatus(false);
    }


    render() {
        const {number, tarArr} = this.state;
        const {navCompleteRoute} = this.props.navStore;
        return (
            <div className="confirm-mask">
                <div className="nav-complete">
                    <img src={iconSrc} alt=""/>
                    <i className="iconfont icon-quancha nav-complete-close" onClick={() => this.closeModal()}></i>
                    <div className="nav-complete-content">
                        <div className="nav-complete-position">
                            <p>
                                <i className="iconfont icon-qidian2"></i>&nbsp;
                                {navCompleteRoute.start && navCompleteRoute.start.name}
                            </p>
                            <p>
                                <i className="iconfont icon-zhongdian2"></i>&nbsp;
                                {navCompleteRoute.end && navCompleteRoute.end.name}
                            </p>
                        </div>
                        <div className="nav-complete-text">
                            <p>您已到达目的地</p>
                            <p>给本次导航打分</p>
                            <p>
                                {new Array(5).fill(0).map((v, i) => {
                                    return <i
                                        className={`iconfont icon-star ${i <= number ? "yellowIcon" : "grayIcon"}`}
                                        key={i} onClick={() => this.renderStar(i)}></i>;
                                })}
                            </p>
                        </div>
                        <div className="nav-complete-tag">
                            {tarArr.map((v, i) => {
                                return <div key={i} onClick={() => this.renderTag(i)}
                                            className={`nav-complete-tag-item ${v.active
                                                ? "nav-complete-tag-active"
                                                : "nav-complete-tag-border"}`}>{v.text}</div>;
                            })}
                        </div>
                        <div className="nav-complete-textArea">
                            <textarea placeholder="其他想说..."></textarea>
                            <p>
                                <button>提交</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default navComplete;