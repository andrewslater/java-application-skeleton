module.exports = function(user, role) {
    if (user) {
        var roles = user.roles || [];
        for (var i = 0; i < roles.length; i++) {
            if (roles[i] == role) {
                return true;
            }
        }
    }

    return false;
};
