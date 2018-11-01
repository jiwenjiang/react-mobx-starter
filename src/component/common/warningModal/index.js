/**
 * Created by j_bleach on 2018/10/12 0012.
 */

import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import iconSrc from "assets/img/waring.png";
import "./index.less";

@inject("commonStore")
@observer
class confirmModal extends Component {
    state = {};

    confirm() {
        this.props.confirm();
    }

    cancel() {
        this.props.cancel && this.props.cancel();
        this.props.commonStore.changeWarningModal(false);
    }

    render() {
        const {text} = this.props;
        return (
            <div className="confirm-modal">
                <img src={iconSrc} alt=""/>
                <div className="confirm-modal-text" style={{color: "#666666"}}>{text}</div>
                <div className="confirm-modal-btn">
                    <div className="confirm-modal-btn-confirm">
                        <div className="confirm-modal-btn-confirm-content" onClick={() => this.confirm()}>
                            <span style={{color: "#ce9321"}}>确定</span>
                        </div>
                    </div>
                    {/*<div className="confirm-modal-btn-cancel" onClick={() => this.cancel()}>*/}
                    {/*<span>取消</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export default confirmModal;
