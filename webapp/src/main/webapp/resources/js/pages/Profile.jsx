var util = require("util");
var _ = require("underscore");
var React = require("react");
var Fluxxor = require("fluxxor");
var Dropzone = require("react-dropzone-component");
var AvatarCropper = require("react-avatar-cropper");
var app = require("../app");
var APIClient = require("../APIClient");
var Spinner = require("../components/Spinner");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FileUpload = React.createClass({

    handleFile: function(e) {
        var reader = new FileReader();
        var file = e.target.files[0];

        if (!file) return;

        reader.onload = function(img) {
            React.findDOMNode(this.refs.in).value = '';
            this.props.handleFileChange(img.target.result);
        }.bind(this);
        reader.readAsDataURL(file);
    },

    render: function() {
        return (
            <input ref="in" type="file" accept="image/*" onChange={this.handleFile} />
        );
    }
});

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("PrincipalUserStore")],

    getStateFromFlux: function() {
        var store = this.getFlux().store("PrincipalUserStore");
        return {
            cropperOpen: false,
            loading: store.loading,
            error: store.error,
            principal: store.principal,
            img: null,
            croppedImg: store.principal ? APIClient.getLink(store.principal, "resource-avatar-medium") : null
        };
    },

    handleFileChange: function(dataURI) {
        this.setState({
            img: dataURI,
            croppedImg: this.state.croppedImg,
            cropperOpen: true
        });
    },

    handleRequestHide: function() {
        console.log("onRequestHide()");
        this.setState({
            cropperOpen: false
        });
    },

    handleCrop: function(dataURI) {
        console.log("handleCrop");
        this.setState({
            cropperOpen: false,
            img: null,
            croppedImg: dataURI
        });
    },

    render: function() {

        //var dropzoneConfig = {
        //    allowedFiletypes: ['.jpg', '.png', '.gif'],
        //    showFiletypeIcon: true,
        //    postUrl: '/api/user/principal/avatar'
        //};
        //
        //var djsConfig = {
        //    headers: app.client.getHeaders()
        //};
        //
        //var eventHandlers = {
        //    addedfile: function(file) {
        //        console.log("Added file: " + util.inspect(file));
        //    }
        //};

        //return (
        //    <div>
        //        <Dropzone config={dropzoneConfig}
        //                  eventHandlers={eventHandlers}
        //                  djsConfig={djsConfig} >
        //            <input type="hidden" name="_csrf" value={app.csrf} />
        //        </Dropzone>
        //    </div>
        //);

        if (this.state.loading) {
            return <Spinner />;
        }

        return (
            <div>
                <div className="avatar-photo">
                    <FileUpload handleFileChange={this.handleFileChange} />
                    <div className="avatar-edit">
                        <span>Click to Pick Avatar</span>
                        <i className="fa fa-camera"></i>
                    </div>
                    <img src={this.state.croppedImg} />
                </div>
                {this.state.cropperOpen &&
                <AvatarCropper
                    onRequestHide={this.handleRequestHide}
                    onCrop={this.handleCrop}
                    image={this.state.img}
                    width={225}
                    height={225}
                    />
                }
            </div>
        )

    },

    onImageReady: function() {
        console.log("on image ready!");
    },

    onClickSave: function() {
        var dataURL = this.refs.editor.getImage();
        console.log("Saving image: " + dataURL);
        // now save it to the state and set it as <img src="…" /> or send it somewhere else
    }

});
