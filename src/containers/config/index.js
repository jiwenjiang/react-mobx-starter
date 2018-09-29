/**
 * Created by j_bleach on 2018/9/27 0027.
 */
import React, {PureComponent} from "react";
import {List, InputItem, Button} from "antd-mobile";
import {createForm, formShape} from "rc-form";
import {observer, inject} from "mobx-react";

let moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
};

@inject("navStore")
@observer
@createForm()
class configPage extends PureComponent {
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
            this.props.navStore.updateParams(value);
            this.props.history.goBack();
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const params = this.props.mapStore.mapNavParams;
        return (
            <div>
                <form>
                    <List>
                        {getFieldDecorator("timeThrottle", {initialValue: params && params.timeThrottle})(
                            <InputItem clear
                                       placeholder="默认五秒"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="毫秒"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>节流时间：</InputItem>)}

                        {getFieldDecorator("ibeaconLoc", {initialValue: params && params.ibeaconLoc})(
                            <InputItem clear
                                       placeholder="默认大于10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={15}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>蓝牙点与导航线距离大于：</InputItem>)}

                        {getFieldDecorator("fiducialLoc", {initialValue: params && params.fiducialLoc})(
                            <InputItem clear
                                       placeholder="默认小于3米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={15}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>置信点与蓝牙点距离小于：</InputItem>)}


                        {getFieldDecorator("inertiaIbeacon", {initialValue: params && params.inertiaIbeacon})(
                            <InputItem clear
                                       placeholder="默认大于2米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与蓝牙点距离大于：</InputItem>)}


                        {getFieldDecorator("inertiaFiducial", {initialValue: params && params.inertiaFiducial})(
                            <InputItem clear
                                       placeholder="默认10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质信点距离大于：</InputItem>)}


                        {getFieldDecorator("inertiaIbea", {initialValue: params && params.inertiaIbea})(
                            <InputItem clear
                                       placeholder="默认大于5米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与蓝牙点距离大于：</InputItem>)}


                        {getFieldDecorator("centroidNav", {initialValue: params && params.centroidNav})(
                            <InputItem clear
                                       placeholder="默认大于10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>质心点与导航线距离大于：</InputItem>)}

                        {getFieldDecorator("inertiaFidu", {initialValue: params && params.inertiaFidu})(
                            <InputItem clear
                                       placeholder="默认大于5米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质心点距离大于：</InputItem>)}

                        {getFieldDecorator("inertiaFidumin", {initialValue: params && params.inertiaFidumin})(
                            <InputItem clear
                                       placeholder="默认小于10米"
                                       type="number"
                                       moneyKeyboardAlign="right"
                                       labelNumber={10}
                                       extra="米"
                                       moneyKeyboardWrapProps={moneyKeyboardWrapProps}>惯导点与质心点距离小于：</InputItem>)}

                        {getFieldDecorator("inertiaFidumax", {initialValue: params && params.inertiaFidumax})(
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

export default configPage;