/**
 * Created by j_bleach on 2018/9/21 0021.
 */
import {PureComponent} from "react";
import {Carousel, WingBlank} from "antd-mobile";
import React from "react";

class CarouselComponent extends PureComponent {
    componentDidMount() {
        document.addEventListener("touchmove", function (event) {
            event.preventDefault();
        }, {
            passive: false
        });
    }

    render() {
        const {data} = this.props;
        return (
            <WingBlank>
                <Carousel
                    autoplay={false}
                >
                    {data && data.map(val => (
                        <a
                            key={val}
                            href="http://www.alipay.com"
                            style={{display: "inline-block", width: "100%", height: "25vh"}}
                        >
                            <img
                                src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                                alt=""
                                style={{width: "100%", verticalAlign: "top"}}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event("resize"));
                                    this.setState({imgHeight: "auto"});
                                }}
                            />
                        </a>
                    ))}
                </Carousel>
            </WingBlank>
        );
    }
}

export default CarouselComponent;