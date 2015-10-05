var util = require("util"),
    $ = require("jquery"),
    React = require("react"),
    Progress = require("react-progress"),
    noty = require("noty"),
    ReactBootstrap = require("react-bootstrap");

var APIClient = require("../APIClient"),
    ImageCropper = require("./ImageCropper"),
    ProgressBar = require("./ProgressBar");

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            user: null
        }
    },

    getInitialState: function() {
        return {
            cropperOpen: false,
            croppedImg: null,
            imageReadProgress: null,
            img: null
        }
    },

    handleRequestHide: function() {
        this.setState({
            cropperOpen: false,
            img: null
        });
    },

    handleCrop: function(dataURI)   {
        this.setState({
            cropperOpen: false,
            img: null,
            croppedImg: dataURI
        });

        if (this.props.uploadAction) {
            this.props.uploadAction(dataURI);
        }
    },

    componentDidMount: function() {
        var node = React.findDOMNode(this.refs.avatarImage);
        if (node) {
            node.addEventListener('dragover', this.onDragOver);
            node.addEventListener('drop', this.onDrop);
        }
    },

    onDragOver: function(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    },

    onDrop: function(event) {
        event.stopPropagation();
        event.preventDefault();

        this.openCropperWithFile(event.dataTransfer.files[0]);
    },

    onFileSelection: function(event) {
        this.openCropperWithFile(event.target.files[0]);
    },

    openCropperWithFile: function(file) {
        if (!file) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function(img) {
            this.setState({
                img: img.target.result,
                cropperOpen: true,
                imageReadProgress: null
            });
        }.bind(this);

        reader.onprogress = function(event) {
            var percentComplete = Math.round(event.loaded / event.total * 100);
            this.setState({
                imageReadProgress: percentComplete
            });
        }.bind(this);

        reader.readAsDataURL(file);
    },

    openFileSelector: function() {
        React.findDOMNode(this.refs.avatarFileInput).click();
    },

    render: function() {
        return (
            <div className="avatar-editor">
                <input ref="avatarFileInput"
                       type="file"
                       className="hidden"
                       accept="image/*"
                       onChange={this.onFileSelection} />
                <img className="img-rounded"
                     ref="avatarImage"
                     src={this.getAvatarImage()}
                     onDragOver={this.onDragOver}
                     onDrop={this.onDrop}
                     onClick={this.openFileSelector} />
                <ProgressBar percentComplete={this.state.imageReadProgress} />
                <ProgressBar percentComplete={this.props.uploadProgress} />
                {this.renderImageCropper()}
            </div>
        );
    },

    renderImageCropper: function() {
        if (!this.state.cropperOpen) {
            return null;
        }

        return (
            <ImageCropper show={true}
                          width={256}
                          height={256}
                          onCrop={this.handleCrop}
                          image={this.state.img}
                          onRequestHide={this.handleRequestHide}/>
        )
    },

    getAvatarImage: function() {
        if (this.state.croppedImg) {
            return this.state.croppedImg;
        }
        return APIClient.getLink(this.props.user, "resource-avatar-large");
    }
});
