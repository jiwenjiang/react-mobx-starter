/**
 * Created by j_bleach on 2019/5/1.
 */

import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {createForm, formShape} from "rc-form";
import {Drawer, SearchBar, WhiteSpace, InputItem, Button, DatePicker, List} from "antd-mobile";
import moment from "moment";
import Style from "./index.scss";

@inject("commonStore")
@observer
@createForm()
class MList extends Component {
    static propTypes = {
        form: formShape
    };

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            showCalendar: false
        };
    }

    componentDidMount() {
        this.setState({
            maxTime: new Date(Date.now())
        })
    }

    openSearch() {
        this.setState({
            open: !this.state.open,
            now: new Date()
        })
    }

    onOpenChange() {
        console.log("change")
    }

    validateEndTime = (rule, value, cb) => {
        const start = this.props.form.getFieldValue("uploadStartTime");
        if (new Date(value) < new Date(start)) {
            cb("结束小于开始")
        }
        cb()
    }

    submit() {
        this.props.form.validateFields((error, value) => {
            console.log("err", error)
            const startTime = moment(value.uploadStartTime).format("YYYY-MM-DD HH:mm");

            console.log("sub", startTime)
            // for (let key in value) {
            //     value[key] = Number(value[key]);
            // }
            // this.props.navStore.updateParams(value);
            // this.props.history.goBack();
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {maxTime} = this.state
        // const params = this.props.navStore.mapNavParams;
        const sidebar = (
            <form className={Style.FilterForm}>
                {getFieldDecorator("keyWords")(
                    <InputItem
                        clear
                        placeholder="关键词搜索"
                    >关键词</InputItem>)}
                <List>
                    <List.Item>上传时间</List.Item>
                    {getFieldDecorator("uploadStartTime")(
                        <DatePicker format="YYYY-MM-DD HH:mm">
                            <List.Item arrow="horizontal">开始</List.Item>
                        </DatePicker>)}
                    {getFieldDecorator("uploadEndTime", {
                        rules: [
                            {validator: this.validateEndTime}
                        ]
                    })(
                        <DatePicker maxDate={maxTime} format="YYYY-MM-DD HH:mm">
                            <List.Item arrow="horizontal">结束</List.Item>
                        </DatePicker>)}
                    <List.Item>上传时间</List.Item>
                </List>
                <div className={Style.btnbox}>
                    <Button type="primary" onClick={() => this.submit()} size="small" inline>搜索</Button>
                    <Button type="ghost" size="small" inline className="am-button-borderfix">取消</Button>
                </div>
                {/*<Button type="primary" size="small" onClick={() => this.submit()}>确定</Button>*/}
            </form>
        );
        return (
            <div>
                <Drawer
                    className={Style.myDrawer}
                    style={{minHeight: "100vh"}}
                    position="right"
                    contentStyle={{color: "#A6A6A6", textAlign: "center"}}
                    sidebar={sidebar}
                    open={this.state.open}
                    onOpenChange={this.onOpenChange}
                >
                    <div onClick={() => this.openSearch()}>
                        <SearchBar placeholder="Search" disabled maxLength={8}/>
                    </div>
                    <WhiteSpace />
                </Drawer>
            </div>
        );
    }
}

export default MList;
