// got from https://gist.github.com/bgrins/6194623
var isDataURL = function(s) {
    if (!s) {
        return false;
    }
    var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !!s.match(regex);
};

module.exports = isDataURL;
