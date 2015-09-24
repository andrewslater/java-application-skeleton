var util = require("util");
var _ = require("underscore");
var React = require("react");
var Dropzone = require("react-dropzone-component");
var app = require("../app");

module.exports = React.createClass({
    onDrop: function(files) {
        console.log("Dropped files: " + JSON.stringify(files));
    },

    render: function() {

        var dropzoneConfig = {
            allowedFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/api/user/principal/avatar'
        };

        var djsConfig = {
            headers: app.client.getHeaders()
        };

        var eventHandlers = {
            addedfile: function(file) {
                console.log("Added file: " + util.inspect(file));
            }
        };

        return (
            <div>
                <Dropzone config={dropzoneConfig}
                          eventHandlers={eventHandlers}
                          djsConfig={djsConfig} >
                    <input type="hidden" name="_csrf" value={app.csrf} />
                </Dropzone>
            </div>
        );

    }
});
