var util = require("util"),
    _ = require("underscore"),
    React = require("react"),
    Fluxxor = require("fluxxor"),
    Dropzone = require("react-dropzone-component"),
    app = require("../app"),
    APIClient = require("../APIClient"),
    AvatarEditor = require("../components/AvatarEditor"),
    Spinner = require("../components/Spinner");

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
            loading: store.loading,
            principal: store.principal,
            error: store.error
        }
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
                <AvatarEditor user={this.state.principal} />
            </div>
        );

        //return (
        //    <div>
        //        <div className="avatar-photo">
        //            <FileUpload handleFileChange={this.handleFileChange} />
        //            <div className="avatar-edit">
        //                <span>Click to Pick Avatar</span>
        //                <i className="fa fa-camera"></i>
        //            </div>
        //            <img src={this.state.croppedImg} />
        //        </div>
        //        {this.state.cropperOpen &&
        //        <AvatarCropper
        //            onRequestHide={this.handleRequestHide}
        //            onCrop={this.handleCrop}
        //            image={this.state.img}
        //            width={225}
        //            height={225}
        //            />
        //        }
        //    </div>
        //)
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
