var util = require("util");
var _ = require("underscore");
var React = require("react");
var Fluxxor = require("fluxxor");
var Dropzone = require("react-dropzone-component");
var AvatarCropper = require("react-avatar-cropper");
var app = require("../app");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("PrincipalUserStore")],

    getStateFromFlux: function() {
        var store = this.getFlux().store("PrincipalUserStore");
        return {
            loading: store.loading,
            error: store.error,
            principal: store.principal,
            img: null
        };
    },

    onDrop: function(files) {
        console.log("Dropped files: " + JSON.stringify(files));
    },

    handleRequestHide: function() {
        console.log("onRequestHide()");
    },

    handleCrop: function() {
        console.log("handleCrop");
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


        return (
            <AvatarCropper
                onRequestHide={this.handleRequestHide}
                onCrop={this.handleCrop}
                image={this.state.img}
                width={400}
                height={400}
                />
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
