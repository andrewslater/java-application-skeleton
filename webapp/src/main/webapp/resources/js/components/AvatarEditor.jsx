var React = require("react"),
    ReactBootstrap = require("react-bootstrap"),
    ImageCropper = require("./ImageCropper"),
    APIClient = require("../APIClient");

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
    getDefaultProps: function() {
        return {
            user: null
        }
    },

    getInitialState: function() {
        return {
            cropperOpen: true,
            img: "/images/default-avatar-medium.png"
        }
    },

    //getStateFromFlux: function() {
    //    var store = this.getFlux().store("PrincipalUserStore");
    //    return {
    //        cropperOpen: false,
    //        loading: store.loading,
    //        error: store.error,
    //        principal: store.principal,
    //        img: null,
    //        croppedImg: store.principal ? APIClient.getLink(store.principal, "resource-avatar-medium") : null
    //    };
    //},
    //
    //handleFileChange: function(dataURI) {
    //    this.setState({
    //        img: dataURI,
    //        croppedImg: this.state.croppedImg,
    //        cropperOpen: true
    //    });
    //},
    //

    handleRequestHide: function() {
        console.log("onRequestHide()");
        this.setState({
            cropperOpen: false
        });
    },

    handleCrop: function(dataURI)   {
        console.log("handleCrop");
        this.setState({
            cropperOpen: false,
            img: null,
            croppedImg: dataURI
        });
    },

    render: function() {

        var cropper = this.state.cropperOpen ? <ImageCropper show={true}
                                    onCrop={this.handleCrop}
                                    image={this.state.img}
                                    onRequestHide={this.handleRequestHide} /> : null;

        return (
            <div>
                <img src={APIClient.getLink(this.props.user, "resource-avatar-medium")} />
                {cropper}
            </div>
        );
    }
});
