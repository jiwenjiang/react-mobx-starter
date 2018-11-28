/**
 * Created by j_bleach on 2018/9/24.
 */
import React, {PureComponent} from "react";
import {Accordion} from "antd-mobile";
// import {toJS} from 'mobx'
import "./index.less";


class AccordionComponent extends PureComponent {
    constructor() {
        super();
        this.state = {
            activeKeyArr: []
        };
    }

    componentDidMount() {
        const {data} = this.props;
        const activeKeyArr = data && data.map(v => String(v.serviceTypeId)) || [];
        this.setState({
            activeKeyArr
        });
    }

    renderPanel(data) {
        if (data) {
            const header = (item) => <div className="accordion-header">
                <span className="col-icon"></span>
                <span>{item.serviceName.length > 22
                    ? item.serviceName.slice(0, 22) + "..."
                    : item.serviceName}</span>
            </div>;
            return data.map(v => {

                    return <Accordion.Panel header={header(v)} key={v.serviceTypeId}>
                        <div className="accordion-grid-box">
                            <div className="accordion-grid-box-content">
                                {
                                    v.hospServiceFunction.map((item, index) => {
                                        return <span className='accordion-grid-text-box' key={index}
                                                     onClick={() => this.props.confirmMarker(item)}>
                                        <span className="accordion-grid-text"

                                        >{item.areaName}</span>
                                    </span>;
                                    })
                                }
                                {/*<span>{v.hospServiceFunction}</span>*/}
                                {/*<Grid data={v.hospServiceFunction} hasLine={false} square={false} activeStyle={false}*/}
                                {/*renderItem={(e) => this.renderItem(e)}/>*/}
                            </div>
                        </div>
                    </Accordion.Panel>;
                }
            );
        }
    }

    renderItem(e) {
        return <span className="accordion-grid-text"
                     onClick={() => this.props.confirmMarker(e)}>{e.areaName}</span>;
    }

    changeActive(e) {
        this.setState({
            activeKeyArr: e
        });
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
