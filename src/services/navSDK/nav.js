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
        this.loc = loc;
        this.currentPoint = loc.currentPoint;
        this.initCompass();
        this.initStepper();
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
        this.onFreeStep = complete;
    }
}

export default new Nav();