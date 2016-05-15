import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export const SpinnerType = {
    ROTATING_PLANE: "rotating-plane",
    DOUBLE_BOUNCE: "double-bounce",
    WAVE: "wave",
    WANDERING_CUBES: "wandering-cubes",
    PULSE: "pulse",
    CHASING_DOTS: "chasing-dots",
    THREE_BOUNCE: "three-bounce",
    CIRCLE: "circle",
    CUBE_GRID: "cube-grid",
    FADING_CIRCLE: "fading-circle",
    PLUS: "plus"
};

class HideableDiv extends Component {
    render() {
        const classes = classNames({hidden: this.props.hidden});
        return <div className={classes}>{this.props.children}</div>;
    }
}

class Spinner extends Component {
    render() {

        let spinnerDiv = <div />;

        switch(this.props.type) {
            case SpinnerType.ROTATING_PLANE:
                spinnerDiv = <div className="sk-rotating-plane"></div>;
                break;

            case SpinnerType.DOUBLE_BOUNCE:
                spinnerDiv = <div className="sk-double-bounce">
                    <div className="sk-child sk-double-bounce1"></div>
                    <div className="sk-child sk-double-bounce2"></div>
                </div>;
                break;

            case SpinnerType.WAVE:
                spinnerDiv = <div className="sk-wave">
                    <div className="sk-rect sk-rect1"></div>
                    <div className="sk-rect sk-rect2"></div>
                    <div className="sk-rect sk-rect3"></div>
                    <div className="sk-rect sk-rect4"></div>
                    <div className="sk-rect sk-rect5"></div>
                </div>;
                break;

            case SpinnerType.WANDERING_CUBES:
                spinnerDiv = <div className="sk-wandering-cubes">
                    <div className="sk-cube sk-cube1"></div>
                    <div className="sk-cube sk-cube2"></div>
                </div>;
                break;

            case SpinnerType.PULSE:
                spinnerDiv = <div className="sk-spinner sk-spinner-pulse"></div>;
                break;

            case SpinnerType.CHASING_DOTS:
                spinnerDiv = <div className="sk-chasing-dots">
                    <div className="sk-child sk-dot1"></div>
                    <div className="sk-child sk-dot2"></div>
                </div>;
                break;

            case SpinnerType.THREE_BOUNCE:
                spinnerDiv = <div className="sk-three-bounce">
                    <div className="sk-child sk-bounce1"></div>
                    <div className="sk-child sk-bounce2"></div>
                    <div className="sk-child sk-bounce3"></div>
                </div>;
                break;

            case SpinnerType.CIRCLE:
                spinnerDiv = <div className="sk-circle">
                    <div className="sk-circle1 sk-child"></div>
                    <div className="sk-circle2 sk-child"></div>
                    <div className="sk-circle3 sk-child"></div>
                    <div className="sk-circle4 sk-child"></div>
                    <div className="sk-circle5 sk-child"></div>
                    <div className="sk-circle6 sk-child"></div>
                    <div className="sk-circle7 sk-child"></div>
                    <div className="sk-circle8 sk-child"></div>
                    <div className="sk-circle9 sk-child"></div>
                    <div className="sk-circle10 sk-child"></div>
                    <div className="sk-circle11 sk-child"></div>
                    <div className="sk-circle12 sk-child"></div>
                </div>;
                break;

            case SpinnerType.CUBE_GRID:
                spinnerDiv = <div className="sk-cube-grid">
                    <div className="sk-cube sk-cube1"></div>
                    <div className="sk-cube sk-cube2"></div>
                    <div className="sk-cube sk-cube3"></div>
                    <div className="sk-cube sk-cube4"></div>
                    <div className="sk-cube sk-cube5"></div>
                    <div className="sk-cube sk-cube6"></div>
                    <div className="sk-cube sk-cube7"></div>
                    <div className="sk-cube sk-cube8"></div>
                    <div className="sk-cube sk-cube9"></div>
                </div>;
                break;

            case SpinnerType.PLUS:
                spinnerDiv = <div className="text-center"><div className="plus-loader"></div></div>;
                break;

            case SpinnerType.FADING_CIRCLE:
            default:
                spinnerDiv = <div className="sk-fading-circle">
                    <div className="sk-circle1 sk-circle"></div>
                    <div className="sk-circle2 sk-circle"></div>
                    <div className="sk-circle3 sk-circle"></div>
                    <div className="sk-circle4 sk-circle"></div>
                    <div className="sk-circle5 sk-circle"></div>
                    <div className="sk-circle6 sk-circle"></div>
                    <div className="sk-circle7 sk-circle"></div>
                    <div className="sk-circle8 sk-circle"></div>
                    <div className="sk-circle9 sk-circle"></div>
                    <div className="sk-circle10 sk-circle"></div>
                    <div className="sk-circle11 sk-circle"></div>
                    <div className="sk-circle12 sk-circle"></div>
                </div>;
                break;
        }

        return <HideableDiv hidden={this.props.hidden}>{spinnerDiv}</HideableDiv>;
    }
}

Spinner.defaultProps = {
    type: SpinnerType.CUBE_GRID
};

Spinner.propTypes = {
    type: PropTypes.string,
    hidden: PropTypes.bool
};

export default Spinner;
