var React = require("react");

module.exports = React.createClass({

        statics: {
            Types: {
                ROTATING_PLANE: "rotating-plane",
                DOUBLE_BOUNCE: "double-bounce",
                WAVE: "wave",
                WANDERING_CUBES: "wandering-cubes",
                PULSE: "pulse",
                CHASING_DOTS: "chasing-dots",
                THREE_BOUNCE: "three-bounce",
                CIRCLE: "circle",
                CUBE_GRID: "cube-grid",
                FADING_CIRCLE: "fading-circle"
            }
        },

        getDefaultProps: function() {
            return {type: "wave"}
        },

        render: function() {
            switch(this.props.type) {

                case this.constructor.Types.ROTATING_PLANE:
                    return (<div className="sk-rotating-plane"></div>);

                case this.constructor.Types.DOUBLE_BOUNCE:
                    return (<div className="sk-double-bounce">
                        <div className="sk-child sk-double-bounce1"></div>
                        <div className="sk-child sk-double-bounce2"></div>
                    </div>);

                case this.constructor.Types.WAVE:
                    return (<div className="sk-wave">
                        <div className="sk-rect sk-rect1"></div>
                        <div className="sk-rect sk-rect2"></div>
                        <div className="sk-rect sk-rect3"></div>
                        <div className="sk-rect sk-rect4"></div>
                        <div className="sk-rect sk-rect5"></div>
                    </div>);

                case this.constructor.Types.WANDERING_CUBES:
                    return (<div className="sk-wandering-cubes">
                        <div className="sk-cube sk-cube1"></div>
                        <div className="sk-cube sk-cube2"></div>
                    </div>);

                case this.constructor.Types.PULSE:
                    return (<div className="sk-spinner sk-spinner-pulse"></div>);

                case this.constructor.Types.CHASING_DOTS:
                    return (<div className="sk-chasing-dots">
                        <div className="sk-child sk-dot1"></div>
                        <div className="sk-child sk-dot2"></div>
                    </div>);

                case this.constructor.Types.THREE_BOUNCE:
                    return (<div className="sk-three-bounce">
                        <div className="sk-child sk-bounce1"></div>
                        <div className="sk-child sk-bounce2"></div>
                        <div className="sk-child sk-bounce3"></div>
                    </div>);

                case this.constructor.Types.CIRCLE:
                    return (<div className="sk-circle">
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
                    </div>);

                case this.constructor.Types.CUBE_GRID:
                    return (<div className="sk-cube-grid">
                        <div className="sk-cube sk-cube1"></div>
                        <div className="sk-cube sk-cube2"></div>
                        <div className="sk-cube sk-cube3"></div>
                        <div className="sk-cube sk-cube4"></div>
                        <div className="sk-cube sk-cube5"></div>
                        <div className="sk-cube sk-cube6"></div>
                        <div className="sk-cube sk-cube7"></div>
                        <div className="sk-cube sk-cube8"></div>
                        <div className="sk-cube sk-cube9"></div>
                    </div>);

                case this.constructor.Types.FADING_CIRCLE:
                default:
                    return (<div className="sk-fading-circle">
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
                    </div>);
            }
        }
    }
);
