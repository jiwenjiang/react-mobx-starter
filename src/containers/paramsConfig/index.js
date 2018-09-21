/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import React, {Component} from "react";
import {List, InputItem, Button} from "antd-mobile";
import {createForm, formShape} from "rc-form";


// const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (true) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class paramsConfig extends Component {
    static propTypes = {
        form: formShape,
    };

    constructor(props) {
        super(props);
    }

    submit() {
        this.props.form.validateFields((error, value) => {
            for (let key in value) {
                value[key] = Number(value[key]);
            }
            // this.props.PARAM_CONFIG_CHANGE(value);
            this.props.history.goBack();
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const params = this.props.paramConfig;
        return (
            <div>
                <form>
                    <List>
                        {getFieldDecorator("THROTTLE_TIME", {initialValue: params && params.THROTTLE_TIME})(
                            <InputItem clear
                                       placeholder="默认五秒"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="毫秒"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>节流时间：</InputItem>)}

                        {getFieldDecorator("IBEACON_NAVIGATION_MORE_10", {initialValue: params && params.IBEACON_NAVIGATION_MORE_10})(
                            <InputItem clear
                                       placeholder="默认大于10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={15}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>蓝牙点与导航线距离大于：</InputItem>)}

                        {getFieldDecorator("IBEACON_FIDUCIAL_LESS_3", {initialValue: params && params.IBEACON_FIDUCIAL_LESS_3})(
                            <InputItem clear
                                       placeholder="默认小于3米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={15}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>置信点与蓝牙点距离小于：</InputItem>)}


                        {getFieldDecorator("CURRENT_POSITION_IBEACON_MORE_2", {initialValue: params && params.CURRENT_POSITION_IBEACON_MORE_2})(
                            <InputItem clear
                                       placeholder="默认大于2米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与蓝牙点距离大于：</InputItem>)}


                        {getFieldDecorator("CURRENT_POSITION_FIDUCIAL_MORE_10", {initialValue: params && params.CURRENT_POSITION_FIDUCIAL_MORE_10})(
                            <InputItem clear
                                       placeholder="默认10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质信点距离大于：</InputItem>)}


                        {getFieldDecorator("CURRENT_POSITION_IBEACON_MORE_5", {initialValue: params && params.CURRENT_POSITION_IBEACON_MORE_5})(
                            <InputItem clear
                                       placeholder="默认大于5米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与蓝牙点距离大于：</InputItem>)}


                        {getFieldDecorator("POLYGON_NAVIGATION_MORE_10", {initialValue: params && params.POLYGON_NAVIGATION_MORE_10})(
                            <InputItem clear
                                       placeholder="默认大于10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>质心点与导航线距离大于：</InputItem>)}

                        {getFieldDecorator("CURRENT_POSITION_POLYGON_MORE_5", {initialValue: params && params.CURRENT_POSITION_POLYGON_MORE_5})(
                            <InputItem clear
                                       placeholder="默认大于5米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质心点距离大于：</InputItem>)}

                        {getFieldDecorator("CURRENT_POSITION_POLYGON_LESS_10", {initialValue: params && params.CURRENT_POSITION_POLYGON_LESS_10})(
                            <InputItem clear
                                       placeholder="默认小于10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质心点距离小于：</InputItem>)}

                        {getFieldDecorator("CURRENT_POSITION_POLYGON_MORE_10", {initialValue: params && params.CURRENT_POSITION_POLYGON_MORE_10})(
                            <InputItem clear
                                       placeholder="默认大于10米"
                                       type='number'
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质心点距离大于：</InputItem>)}

                        <List.Item>
                            <Button type="primary" onClick={() => this.submit()}>确定</Button>
                        </List.Item>
                    </List>
                </form>
            </div>
        );
    }
}

export default createForm()(paramsConfig);
