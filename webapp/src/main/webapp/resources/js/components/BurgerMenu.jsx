var $ = require("jquery");
var React = require("expose?react!react");
var BurgerMenu = require('react-burger-menu').pushRotate;

var Menu = React.createClass({
    render: function() {
        return (
            <BurgerMenu>
                <a id="home" className="menu-item" href="/">Home</a>
                <a id="about" className="menu-item" href="/about">About</a>
                <a id="contact" className="menu-item" href="/contact">Contact</a>
                <a className="menu-item--small" href="">Settings</a>
            </BurgerMenu>
        );
    }
});
