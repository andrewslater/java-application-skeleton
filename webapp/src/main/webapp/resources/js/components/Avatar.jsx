import React, { Component, PropTypes } from 'react'

import APIClient from '../APIClient'

class Avatar extends Component {

    render() {
        var src = APIClient.getLink(this.props.user, "resource-avatar-" + this.props.size);
        return (
            <img className="img-rounded"
                 src={src} />
        );
    }

}

Avatar.defaultProps = {
    size: 'small'
};

export default Avatar;
