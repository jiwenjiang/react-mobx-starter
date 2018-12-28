/**
 * Created by j_bleach on 2018/9/17 0017.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import audioSrc from "assets/audio/routePlan.mp3";
import "./index.less";

@inject("commonStore")
@observer
class confirmModal extends Component {
    state = {};

    confirm() {
        const audio = document.getElementById("wb-audio");
        audio.src = "";
        audio.play();
        this.props.confirm();
    }

    cancel() {
        this.props.cancel && this.props.cancel();
        this.props.commonStore.changeConfirmModal(false);
    }

    render() {
        const {address, text, icon, textStyle, addressStyle, boxStyle} = this.props;
        return (
            <div className="confirm-mask">
                <div className="confirm-modal">
                    {icon && <img src={icon} alt=""/>}
                    <div style={boxStyle}>
                        <div className="confirm-modal-text" style={textStyle}>{text}</div>
                        <div className="confirm-modal-text-address" style={addressStyle}>{address}</div>
                    </div>
                    <div className="confirm-modal-btn">
                        <div className="confirm-modal-btn-confirm">
                            <div className="confirm-modal-btn-confirm-content" onClick={() => this.confirm()}>
                                <span>确定</span>
                            </div>
                        </div>
                        <div className="confirm-modal-btn-cancel" onClick={() => this.cancel()}>
                            <span>取消</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default confirmModal;
