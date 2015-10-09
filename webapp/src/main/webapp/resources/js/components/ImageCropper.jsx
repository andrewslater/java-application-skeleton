"use strict";

var $ = require("jquery"),
    React = require("react"),
    ReactDOM = require("react-dom"),
    ReactBootstrap = require("react-bootstrap"),
    isDataURL = require("../functions/isDataURL");

var Button = ReactBootstrap.Button,
    Modal = ReactBootstrap.Modal;

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            width: 250,
            height: 250,
            zoom: 1,
            closeMessage: $.i18n.prop('close'),
            cropMessage: $.i18n.prop('crop-and-save')
        }
    },

    getInitialState: function() {
        return {
            dragging: false,
            image: {},
            mouse: {
                x: null,
                y: null
            },
            preview: null,
            zoom: 1
        }
    },

    fitImageToCanvas: function(width, height) {
        var scaledHeight, scaledWidth;

        var canvasAspectRatio = this.props.height / this.props.width;
        var imageAspectRatio = height / width;

        if (canvasAspectRatio > imageAspectRatio) {
            scaledHeight = this.props.height;
            var scaleRatio = scaledHeight / height;
            scaledWidth = width * scaleRatio;
        } else {
            scaledWidth = this.props.width;
            var scaleRatio = scaledWidth / width;
            scaledHeight = height * scaleRatio;
        }

        return { width: scaledWidth, height: scaledHeight };
    },

    prepareImage: function(imageUri) {
        var img = new Image();
        if (!isDataURL(imageUri)) img.crossOrigin = 'anonymous';
        img.onload = function() {
            var scaledImage = this.fitImageToCanvas(img.width, img.height);
            scaledImage.resource = img;
            scaledImage.x = 0;
            scaledImage.y = 0;
            this.setState({dragging: false, image: scaledImage, preview: this.toDataURL()});
        }.bind(this);
        img.src = imageUri;
    },

    mouseDownListener: function(e) {
        this.setState({
            image: this.state.image,
            dragging: true,
            mouse: {
                x: null,
                y: null
            }
        });
    },

    preventSelection: function(e) {
        if (this.state.dragging) {
            e.preventDefault();
            return false;
        }
    },

    mouseUpListener: function(e) {
        this.setState({ dragging: false, preview: this.toDataURL() });
    },

    mouseMoveListener: function(e) {
        if (!this.state.dragging) return;

        var mouseX = e.clientX;
        var mouseY = e.clientY;
        var imageX = this.state.image.x;
        var imageY = this.state.image.y;

        var newImage = this.state.image;

        if (this.state.mouse.x && this.state.mouse.y) {
            var dx = this.state.mouse.x - mouseX;
            var dy = this.state.mouse.y - mouseY;

            var bounded = this.boundedCoords(imageX, imageY, dx, dy);

            newImage.x = bounded.x;
            newImage.y = bounded.y;
        }

        this.setState({
            image: this.state.image,
            mouse: {
                x: mouseX,
                y: mouseY
            }
        });
    },

    boundedCoords: function(x, y, dx, dy) {
        var newX = x - dx;
        var newY = y - dy;

        var scaledWidth = this.state.image.width * this.state.zoom;
        var dw = (scaledWidth - this.state.image.width) / 2;
        var imageLeftEdge = this.state.image.x - dw;
        var imageRightEdge = (imageLeftEdge + scaledWidth);

        var rightEdge = this.props.width;
        var leftEdge = 0;

        if (newX - dw > 0) { x = dw; }
        else if (newX < (-scaledWidth + rightEdge)) { x = rightEdge - scaledWidth; }
        else {
            x = newX;
        }

        var scaledHeight = this.state.image.height * this.state.zoom;
        var dh = (scaledHeight - this.state.image.height) / 2;
        var imageTopEdge = this.state.image.y - dh;
        var imageBottomEdge = imageTopEdge + scaledHeight;

        var bottomEdge = this.props.height;
        var topEdge = 0;
        if (newY - dh > 0) { y = dh; }
        else if (newY < (-scaledHeight + bottomEdge)) { y = bottomEdge - scaledHeight; }
        else {
            y = newY;
        }

        return { x: x, y: y };
    },

    componentDidMount: function() {
        var canvas = ReactDOM.findDOMNode(this.refs.canvas);
        var context = canvas.getContext("2d");
        this.prepareImage(this.props.image);

        this.listeners = {
            mousemove: this.mouseMoveListener,
            mouseup: this.mouseUpListener,
            mousedown: this.mouseDownListener
        };

        window.addEventListener("mousemove", this.listeners.mousemove, false);
        window.addEventListener("mouseup", this.listeners.mouseup, false);
        canvas.addEventListener("mousedown", this.listeners.mousedown, false);
        document.onselectstart = this.preventSelection
    },

    // make sure we clean up listeners when unmounted.
    componentWillUnmount: function() {
        var canvas = ReactDOM.findDOMNode(this.refs.canvas);
        window.removeEventListener("mousemove", this.listeners.mousemove);
        window.removeEventListener("mouseup", this.listeners.mouseup);
        canvas.removeEventListener("mousedown", this.listeners.mousedown);
    },

    componentDidUpdate: function() {
        var context = ReactDOM.findDOMNode(this.refs.canvas).getContext("2d");
        context.clearRect(0, 0, this.props.width, this.props.height);
        this.addImageToCanvas(context, this.state.image);
    },

    addImageToCanvas: function(context, image) {
        if (!image.resource) return;
        context.save();
        context.globalCompositeOperation = "destination-over";
        var scaledWidth = this.state.image.width * this.state.zoom;
        var scaledHeight = this.state.image.height * this.state.zoom;

        var x = image.x - (scaledWidth - this.state.image.width) / 2;
        var y = image.y - (scaledHeight - this.state.image.height) / 2;

        // need to make sure we aren't going out of bounds here...
        x = Math.min(x, 0);
        y = Math.min(y, 0);
        y = scaledHeight + y >= this.props.height ? y : (y + (this.props.height - (scaledHeight + y)));
        x = scaledWidth + x >= this.props.width ? x : (x + (this.props.width - (scaledWidth + x)));

        context.drawImage( image.resource, x, y, image.width * this.state.zoom, image.height * this.state.zoom);
        context.restore();
    },

    toDataURL: function() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        canvas.width = this.props.width;
        canvas.height = this.props.height;

        this.addImageToCanvas(context, {
            resource: this.state.image.resource,
            x: this.state.image.x,
            y: this.state.image.y,
            height: this.state.image.height,
            width: this.state.image.width
        });

        return canvas.toDataURL();
    },

    handleCrop: function() {
        var data = this.toDataURL();
        this.props.onCrop(data);
    },

    handleZoomUpdate: function() {
        var newstate = this.state;
        newstate.zoom = ReactDOM.findDOMNode(this.refs.zoom).value;
        this.setState(newstate);
    },

    render: function() {
        return (
            <Modal show={this.props.show} onHide={this.props.onRequestHide} backdrop={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{$.i18n.prop('crop-your-avatar')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="AvatarCropper-base">
                        <div className="AvatarCropper-canvas">
                            <div className="row">
                                <canvas
                                    ref="canvas"
                                    width={this.props.width}
                                    height={this.props.height}>
                                </canvas>
                            </div>

                            <div className="row">
                                <input
                                    type="range"
                                    name="zoom"
                                    ref="zoom"
                                    onChange={this.handleZoomUpdate}
                                    style={{width: this.props.width}}
                                    min="1"
                                    max="3"
                                    step="0.01"
                                    defaultValue="1"/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onRequestHide}>
                        {this.props.closeMessage}
                    </Button>
                    <Button bsStyle='primary' onClick={this.handleCrop}>
                        {this.props.cropMessage}
                    </Button>
                </Modal.Footer>
            </Modal>


        );
    }
});
