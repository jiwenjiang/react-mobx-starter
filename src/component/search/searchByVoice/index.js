/**
 * Created by maxir on 2018/11/13 15:10.
 */
import React, {Component} from "react";

import "./index.less";
import {inject} from "mobx-react";
import startRecord_img from "../../../assets/img/anzhushuohua.png";
import translating from "../../../assets/img/shibiezhong.png";
import yuan from "../../../assets/img/yuan.png";
import recording from "../../../assets/img/luyinzhong.png";

// const signUrl = `https://xz.parkbobo.com/wxConfig/weixin/v1/jsSdkSign`;

@inject("mapStore", "commonStore")
class searchByVoice extends Component {
    constructor() {
        super();
        this.state = {
            translateResult: "", //识别结果
            button_img: startRecord_img, // 按住说话
            status_img: "", // 当前状态
            err_text: "", // 错误提示
        };
        this.startRecord = this.startRecord.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
        this.translateVoice = this.translateVoice.bind(this);

        this.localVoiceId = null;
        this.timeLength = 0;
    }


    componentWillMount() {
    }


    startRecord() {
        this.timeLength = +new Date;
        this.setState({status_img: recording, err_text: ""});
        window.wx.startRecord();
    }

    stopRecord() {
        const currTimestamp = +new Date;
        if (currTimestamp - this.timeLength > 750) {
            //调试用
            // this.props.closeVoicePanel('1');

            this.setState({status_img: translating});
            window.wx.stopRecord({
                success: res => {
                    this.localVoiceId = res.localId;

                    this.translateVoice(res.localId);
                },
                fail: () => {
                    this.setState({err_text: "录音失败", status_img: ""});
                }
            });
        } else {
            this.setState({err_text: "抱歉，没听清", status_img: ""});
        }
    }

    translateVoice(localId) {
        window.wx.translateVoice({
            localId, // 需要识别的音频的本地Id，由录音相关接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: res => {
                //识别成功
                this.setState({status_img: translating});
                console.log(res.translateResult, 'res.translateResult');
                res.translateResult = res.translateResult.length > 1 ? res.translateResult.slice(0, res.translateResult.length - 1) : res.translateResult;
                this.props.closeVoicePanel(res.translateResult);
            },
            fail: err => {
                this.setState({status_img: ''});
                this.setState({err_text: "语音识别失败"});
                console.log(err, "语音识别失败");
            }
        });
    }

    closeVoicePanel() {
        this.props.commonStore.changeRecordPanel(false);
    }

    render() {
        return (
            <div className="search-voice">
                <i className='iconfont icon-close close-voice' onClick={() => this.closeVoicePanel()}/>
                {this.state.err_text ? <div className="top-tips">
                    <p>{this.state.err_text}</p>
                    <p>请重试</p>
                </div> : null}
                {this.state.status_img ? <img src={this.state.status_img} alt="" className="status-tips"/> : null}
                {this.state.status_img === translating ?
                    <div className='yuan'><img src={yuan} alt="" className='yuan-img'/></div> : null}
                {this.state.status_img === recording ? <div className="end-tips">滑动并松开结束</div> : null}
                <img src={this.state.button_img}
                     className="start-record"
                     alt=""
                     id="start-record"
                />
                <div
                    className="start-record"
                    onTouchStart={() => this.startRecord()}
                    onTouchEnd={() => this.stopRecord()}/>
                {!this.state.status_img ? <div className='bottom-tips'>请按住说话</div> : null}
            </div>
        );
    }
}

export default searchByVoice;

