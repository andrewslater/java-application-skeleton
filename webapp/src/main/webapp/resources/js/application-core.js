// Core application javascript code

jQuery.i18n.properties({
    name:'messages',
    path: contextPath + '/resources/i18n/',
    mode:'map',
    language:'en_US',
    callback: function() {
        // I specified mode: 'map' because the 'vars' mode
        // will add a lot of global JS vars to the page.

        // Accessing a simple value through the map
        //$.i18n.prop('msg_hello');

        // prints 'привет'
        //alert($.i18n.prop('settings-saved'));

        // Setup: msg_complex = доврое утро {0}!
        //alert($.i18n.prop('msg_complex', 'John'));
    }
});

function Oauth2RestClient(baseUrl, apiToken) {
    this.baseUrl = baseUrl;

    this.get = function(resourceUri, options) {
        return $.ajax($.extend(this.getBaseAjaxOptions(resourceUri, "GET"), options));
    };

    this.patch = function(resourceUri, options) {
        return $.ajax($.extend(this.getBaseAjaxOptions(resourceUri, "PATCH"), options));
    };

    this.post = function(resourceUri, options) {

    };

    this.getBaseAjaxOptions = function(resourceUri, ajaxMethod) {
        apiOptions = {
            url: baseUrl + resourceUri,
            method: ajaxMethod,
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("apiToken")
            },
            error: function(req, status, errorThrown) {
                console.log("Error encountered for API call: " + req + " (" + status + "): " + errorThrown);
            }
        };

        return apiOptions;
    }

}

var client = new Oauth2RestClient(contextPath + "/api/");
