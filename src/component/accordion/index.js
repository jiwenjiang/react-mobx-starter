/**
 * Created by j_bleach on 2018/9/24.
 */
/*eslint-disable*/
import React, {PureComponent} from "react";
import {Accordion, Grid} from "antd-mobile";
import "./index.less";

class AccordionComponent extends PureComponent {
    constructor() {
        super();
        this.state = {
            activeKeyArr: []
        }
    }

    componentDidMount() {
        const {data} = this.props;
        const activeKeyArr = data && data.map(v => String(v.id)) || []
        this.setState({
            activeKeyArr
        })
    }

    renderPanel(data) {
        if (data) {
            const gridData = [{text: "测试23333啊"}, {text: "测试"}, {text: "测试"}, {text: "测试"}, {text: "测试"}]
            const header = (item) => <div className="accordion-header">
                <span className="col-icon"></span>
                <span>{item.floor}</span>
                <span>{item.name}</span>
            </div>
            return data.map(v => <Accordion.Panel header={header(v)} key={v.id}>
                <div className="accordion-grid-box">
                    <Grid data={gridData} hasLine={false} square={false} activeStyle={false}
                          renderItem={(e) => this.renderItem(e)} columnNum={4}/>
                </div>
                </Accordion.Panel>
            )
        }
    }

    renderItem(e) {
        return <span className="accordion-grid-text">{e.text}</span>
    }

    changeActive(e) {
        this.setState({
            activeKeyArr: e
        })
    }

    render() {
        const {data} = this.props;
        return (
            <Accordion activeKey={this.state.activeKeyArr}
                       onChange={(e) => this.changeActive(e)}>
                {this.renderPanel(data)}
            </Accordion>
        );
    }
}

export default AccordionComponent;