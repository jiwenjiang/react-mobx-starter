/**
 * Created by j_bleach on 2018/9/28 0028.
 */
import React from "react";
import AddressingImg from "assets/img/logo.png";
import CarImg from "assets/img/logo_car.png";
import "./index.less";

const logo = (type, noLogo) => !noLogo &&
    <img className="map-logo" src={type === "Addressing" ? AddressingImg : CarImg} alt=""/>;

export default logo;
