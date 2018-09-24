/**
 * Created by j_bleach on 2018/9/21 0021.
 */

import {PureComponent} from "react";
import React from "react";
import {Grid} from "antd-mobile";
import "./index.less";
import pic from "./1_j_bleach.jpg"

class CarouselComponent extends PureComponent {
    componentDidMount() {
        document.addEventListener("touchmove", function (event) {
            event.preventDefault();
        }, {
            passive: false
        });
        this.data = Array.from(new Array(9)).map((_val, i) => ({
            icon: pic,
            text: `name${i}`
        }));
    }

    renderItem(e) {
        return <div className="grid-item-box">
            <div>
                <img src={e.icon} alt=""/>
            </div>
            <div>
                <span>{e.text}</span>
            </div>
        </div>
    }

    render() {
        const dotStyle = {
            backgroundColor: "rgba(199,246,244,1)",
            width: "1vw",
            height: "1vw"
        }
        const dotActiveStyle = {
            background: "rgba(174,237,235,1)",
            width: "4vw",
            height: "1vw",
            borderRadius: "0.5vw"
        }
        return (
            <Grid data={this.data} isCarousel hasLine={false}
                  dotStyle={dotStyle}
                  dotActiveStyle={dotActiveStyle}
                  renderItem={(e) => this.renderItem(e)}
                  onClick={_el => console.log(_el)}/>
        );
    }
}

export default CarouselComponent;