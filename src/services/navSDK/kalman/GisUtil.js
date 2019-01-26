const EarthRadius ={
        R:6373000.0, //平均半径
        Rj:6356725.0, //极半径
        Rc:6378137.0//赤道半径
}
class GisUtil{
    static convertDistance(start_lon, start_lat, end_lon, end_lat){
        let lon_rad_differ = GisUtil.degreesToRadians(start_lon) - GisUtil.degreesToRadians(end_lon);
        let lat_rad_differ = GisUtil.degreesToRadians(start_lat) - GisUtil.degreesToRadians(end_lat);
        return 2 * EarthRadius.Rc *
            Math.asin(
                Math.sqrt(
                    Math.pow(Math.sin(lat_rad_differ / 2.0), 2) +
                    Math.cos(GisUtil.degreesToRadians(start_lat)) * Math.cos(GisUtil.degreesToRadians(end_lat)) *
                    Math.pow(Math.sin(lon_rad_differ/2), 2)
                )
            );
    }
    static convertAngle(start_lon,  start_lat,  end_lon,  end_lat){
        let y = Math.sin(end_lon - start_lon) * Math.cos(end_lat);
        let x = Math.cos(start_lat) * Math.sin(end_lat) - Math.sin(start_lat) * Math.cos(end_lat) * Math.cos(end_lon - start_lon);
        let bearing = Math.atan2(y, x);
        bearing = bearing * 180 / Math.PI;
        if (bearing < 0){
            bearing += 360;
        }
        return bearing;
    }
    static getEc(lat){
        return EarthRadius.Rj + (EarthRadius.Rc - EarthRadius.Rj) * (90 - lat) / 90;
    }
    static getEd(lat){
        return  GisUtil.getEc(lat) * Math.cos(GisUtil.degreesToRadians(lat));
    }
    static radiansToDegrees(radian){
        return 180 * (radian % (2 * Math.PI)) / Math.PI;
    }
    static degreesToRadians(degree){
        return degree % 360 * Math.PI /180;
    }
    static distanceToRadians(distance){
        return distance / EarthRadius.R;
    }
    static distanceToDegrees(distance){
        return 180 * (GisUtil.distanceToRadians(distance) % (2 * Math.PI)) / Math.PI;
    }
    static convertNextLonlat(lon, lat, distance, angle){
        let dx = distance * Math.sin(angle * Math.PI / 180);
        let dy = distance * Math.cos(angle * Math.PI / 180);
        let next_lon = (dx / GisUtil.getEd(lat) + GisUtil.degreesToRadians(lon)) * (180 / Math.PI);
        let next_lat = (dy / GisUtil.getEc(lat) + GisUtil.degreesToRadians(lat)) * (180 / Math.PI);
        return [next_lon, next_lat];
    }
}

module.exports = GisUtil;
try {
    window.GisUtil = GisUtil;
} catch (e) {
    console.log(e)
}
