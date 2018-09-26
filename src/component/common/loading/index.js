/**
 * Created by j_bleach on 2018/9/26 0026.
 */
import React, {PureComponent} from "react";
import "./index.less";

class LoadingComponent extends PureComponent {

    submit(e) {
        e.preventDefault();
        this.props.toSearch(this.state.inputValue);
    }

    render() {
        return (
            <div className='loader'>
                <div className='loader_overlay'></div>
                <div className='loader_cogs'>
                    <div className='loader_cogs__top'>
                        <div className='top_part'></div>
                        <div className='top_part'></div>
                        <div className='top_part'></div>
                        <div className='top_hole'></div>
                    </div>
                    <div className='loader_cogs__left'>
                        <div className='left_part'></div>
                        <div className='left_part'></div>
                        <div className='left_part'></div>
                        <div className='left_hole'></div>
                    </div>
                    <div className='loader_cogs__bottom'>
                        <div className='bottom_part'></div>
                        <div className='bottom_part'></div>
                        <div className='bottom_part'></div>
                        <div className='bottom_hole'></div>
                    </div>
                    <p>正在加载...</p>
                </div>
            </div>
        );
    }
}

export default LoadingComponent;