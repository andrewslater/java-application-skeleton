import ReactDOM from 'react-dom'

import APIClient from '../APIClient'
import ImageCropper from './ImageCropper'
import ProgressBar from './ProgressBar'

import React, { Component, PropTypes } from "react"

class AvatarEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cropperOpen: false,
            croppedImg: null,
            imageReadProgress: null,
            img: null
        };
    }
    handleRequestHide() {
        this.setState({
            cropperOpen: false,
            img: null
        });
    }

    handleCrop(dataURI) {
        this.setState({
            cropperOpen: false,
            img: null,
            croppedImg: dataURI
        });

        this.props.uploadAvatar(this.props.user.userId, dataURI);
    }

    componentDidMount() {
        var node = ReactDOM.findDOMNode(this.avatarImage);
        if (node) {
            node.addEventListener('dragover', this.onDragOver);
            node.addEventListener('drop', this.onDrop);
        }
    }

    onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    onDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        this.openCropperWithFile(event.dataTransfer.files[0]);
    }

    onFileSelection(event) {
        this.openCropperWithFile(event.target.files[0]);
        ReactDOM.findDOMNode(this.avatarFileInput).value = null;
    }

    openCropperWithFile(file) {
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
    }

    openFileSelector() {
        ReactDOM.findDOMNode(this.avatarFileInput).click();
    }

    render() {
        var user = this.props.user;
        var uploadProgress = user.uploadAvatarProgress;
        var errorAlert = null;

        var uploadError = user.uploadAvatarError;

        if (uploadError) {
            errorAlert = <div className="alert alert-warning" role="alert">{uploadError.error}</div>
        }

        return (
            <div className="avatar-editor">
                <input ref={(c) => this.avatarFileInput = c}
                       type="file"
                       className="hidden"
                       accept="image/*"
                       onChange={this.onFileSelection.bind(this)} />
                <img className="img-circle"
                     ref={(c) => this.avatarImage = c}
                     src={this.getAvatarImage()}
                     onDragOver={this.onDragOver.bind(this)}
                     onDrop={this.onDrop.bind(this)}
                     onClick={this.openFileSelector.bind(this)} />
                <ProgressBar percentComplete={this.state.imageReadProgress} />
                <ProgressBar percentComplete={uploadProgress} />
                {errorAlert}
                {this.renderImageCropper()}
            </div>
        );
    }

    renderImageCropper() {
        if (!this.state.cropperOpen) {
            return null;
        }

        return (
            <ImageCropper show={true}
                          width={256}
                          height={256}
                          onCrop={this.handleCrop.bind(this)}
                          image={this.state.img}
                          maskMode="circle"
                          onRequestHide={this.handleRequestHide.bind(this)}/>
        )
    }

    getAvatarImage() {
        if (this.state && this.state.croppedImg) {
            return this.state.croppedImg;
        }
        return APIClient.getLink(this.props.user, "resource-avatar-large");
    }
}

AvatarEditor.propTypes = {
    user: PropTypes.object.isRequired,
    uploadAvatar: PropTypes.func.isRequired
};

export default AvatarEditor
