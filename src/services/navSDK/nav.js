/**
 * Created by j_bleach on 2018/10/23 0023.
 */
import compass from "./compass";
import stepper from "./stepper";
import correctLocate from "./correctLocate";

/*eslint-disable*/
@compass
@stepper
@correctLocate
class Nav {
    init(loc) {
        // console.log("loc", loc);
        if (loc.currentPosition) {
            this.currentPoint = loc.currentPosition;
            this.initStepper(loc);
        }
        this.loc = loc;
        this.initCompass();
    }

    compass(
        {
            complete = () => {
            }
        }
    ) {
        this.onCompass = complete;
    }

    startFree(
        {
            complete = () => {
            }
        }
    ) {
        console.log("dayin", this.loc);
        // if (this.loc.currentPosition) {
        //     this.startCorrectFreeLocate(loc);
        // }
        this.onFreeStep = complete;
    }
}

export default new Nav();