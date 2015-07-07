var getLink = function(resource, rel) {
    resource.links.forEach(function(link) {
        if (link.rel == rel) {
            return link;
        }
    })
};
