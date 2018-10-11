/**
 * Created by j_bleach on 2018/9/17 0017.
 */
/*eslint-disable*/
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
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
        this.props.commonStore.changeConfirmModal(false);
    }

    render() {
        const {text, icon} = this.props;
        return (
            <div className="confirm-modal">
                <img src={icon} alt=""/>
                <div className="confirm-modal-text">{text}</div>
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
        );
    }
}

export default confirmModal;
