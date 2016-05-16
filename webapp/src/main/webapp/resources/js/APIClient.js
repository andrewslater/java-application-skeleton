var util = require("util"),
    $ = require("jquery"),
    _ = require("lodash"),
    uuid = require("uuid-v4");

function APIClient(baseUrl, apiToken) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
}

APIClient.prototype = {
    get: function (resourceUri, options) {
        return this.ajax(resourceUri, "GET", options);
    },

    patch: function (resourceUri, options) {
        return this.ajax(resourceUri, "PATCH", options);
    },

    post: function (resourceUri, options) {
        return this.ajax(resourceUri, "POST", options);
    },

    delete: function (resourceUri, options) {
        return this.ajax(resourceUri, "DELETE", options);
    },

    getRef: function(ref, options) {
        return this.get("", _.extend(options, {url: ref}));
    },

    ajax: function(resourceUri, method, options) {
        var jqXHR = $.ajax(this.composeAjaxOptions(resourceUri, method, options));
        jqXHR.requestId = uuid().substring(0, 8);
        return jqXHR;
    },

    setAPIToken: function(token) {
        this.apiToken = token;
    },

    composeAjaxOptions: function(resourceUri, ajaxMethod, suppliedOptions = {}) {
        var xhr = new window.XMLHttpRequest();

        if (suppliedOptions.uploadProgress) {
            xhr.upload.addEventListener("progress", suppliedOptions.uploadProgress, false);
        }

        if (suppliedOptions.progress) {
            xhr.addEventListener("progress", suppliedOptions.progress, false);
        }

        var apiOptions = {
            url: this.baseUrl + resourceUri,
            method: ajaxMethod,
            dataType: "json",
            contentType: "application/json",
            headers: this.getHeaders(),
            error: function(req, status, errorThrown) {
                console.log("Error encountered for API call: " + req + " (" + status + "): " + errorThrown);
            },
            xhr: function() {
                return xhr;
            }
        };

        let options =  $.extend(apiOptions, suppliedOptions);
        return options;
    },

    getHeaders: function() {
        return {
            'Authorization': 'Bearer ' + this.apiToken
        };
    }
};

APIClient.getLink = function (resource, rel) {
    if (!resource || !resource.links) {
        return null;
    }

    for (var i = 0; i < resource.links.length; i++) {
        var link = resource.links[i];
        if (link.rel == rel) {
            return link.href;
        }
    }
    return null;
};

/**
 * Coverts a sort query string into a hashed representation
 * e.g. email:ASC,createdAt:DESC --> {"email": "ASC", "createdAt": "DESC"}
 * @param sortString
 * @returns {{}}
 */
APIClient.parseSort = function(sortString) {
    if (!sortString || sortString == "") {
        return null;
    }
    if (_.isObject(sortString)) {
        return sortString;
    }
    var sorts = {};
    var sortParts = sortString.split(",");
    for (var i = 0; i < sortParts.length; i++) {
        var sortPieces = sortParts[i].split(":");
        sorts[sortPieces[0]] = sortPieces[1];
    }
    return sorts;
};

APIClient.sortToQueryParam = function(sort) {
    if (!sort) {
        return "";
    }

    if (_.isObject(sort)) {
        sort = _.reduce(sort, (result, value, key) => {
            result.push(`${key}:${value}`);
            return result;
        }, []).join(",");
    }

    return sort;
};

/**
 * Strips null/empty/undefined values from a hash. This is useful for generating minimalistic query strings
 * e.g. {"filter": "foo", "sort": ""} --> {"filter": "foo"}
 * NOTE: Also omits 'page' params if the value is 1 since the default is always to return the first page of a collection
 * @param query hash
 * @returns filtered hash
 */
APIClient.collapseQuery = function(query) {
    return _.omitBy(query, function(value, key) {
        return _.isUndefined(value) || _.isNull(value) || value === '' || (key == 'page' && value == 1);
    });
};

APIClient.getFieldError = function(field, fieldErrors) {
    if (!fieldErrors) {
        return;
    }
    var message = "";
    for (var i = 0; i < fieldErrors.length; i++) {
        var fieldError = fieldErrors[i];
        if (fieldError.field == field) {
            message += fieldError.message;
        }
    }
    return message;
};

APIClient.getFieldErrorsHash = function(fieldErrors) {
    var hash = {};
    if (fieldErrors) {
        for (var i = 0; i < fieldErrors.length; i++) {
            var fieldError = fieldErrors[i];
            hash[fieldError.field] = fieldError.message;
        }
    }
    return hash;
};

module.exports = APIClient;

