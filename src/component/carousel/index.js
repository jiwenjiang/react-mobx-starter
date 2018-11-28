/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import {Component} from "react";
import React from "react";
import {Grid} from "antd-mobile";
import "./index.less";
import config from "config";
import pic from "assets/img/white.png";

class CarouselComponent extends Component {
    constructor(props) {
        super(props);
        this.data = Array.from(new Array(9)).map((_val, i) => ({
            icon: pic,
            serviceName: `name${i}`
        }));
    }

    renderItem(e) {
        return <div className="grid-item-box">
            <div>
                <img src={e.icon ? e.icon : `${config.normalIp}${e.iconImg}`} alt=""/>
            </div>
            <div>
                <span>{e.serviceName}</span>
            </div>
        </div>;
    }

    render() {
        const dotStyle = {
            backgroundColor: "rgba(199,246,244,1)",
            width: "1vw",
            height: "1vw"
        };
        const dotActiveStyle = {
            background: "rgba(174,237,235,1)",
            width: "4vw",
            height: "1vw",
            borderRadius: "0.5vw"
        };
        return (
            <Grid data={this.props.data && this.props.data.length > 0 ? this.props.data : this.data}
                  isCarousel hasLine={false}
                  dotStyle={dotStyle}
                  dotActiveStyle={dotActiveStyle}
                  renderItem={(e) => this.renderItem(e)}
                  onClick={_el => this.props.chooseArea(_el)}/>
        );
    }
}

export default CarouselComponent;
