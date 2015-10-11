package com.andrewslater.example.api.assemblers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.Links;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

@Component
@Qualifier("userResourceAssembler")
public class UserResourceAssembler implements ResourceAssembler<User, UserResource> {

    @Override
    public UserResource toResource(User user) {
        String microAvatarUrl = user.getMicroAvatar() == null ? "/images/default-avatar-micro.png" : user.getMicroAvatar().getUrl();
        String smallAvatarUrl = user.getSmallAvatar() == null ? "/images/default-avatar-small.png" : user.getSmallAvatar().getUrl();
        String mediumAvatarUrl = user.getMediumAvatar() == null ? "/images/default-avatar-medium.png" : user.getMediumAvatar().getUrl();
        String largeAvatarUrl = user.getLargeAvatar() == null ? "/images/default-avatar-large.png" : user.getLargeAvatar().getUrl();

        UserResource resource = new UserResource(user);

        resource.add(Mappings.getLink(Links.SELF, Mappings.composePath(Mappings.API_USER_RESOURCE, user.getUserId())));
        resource.add(Mappings.getLink(Links.RESOURCE_AVATAR_MICRO, microAvatarUrl));
        resource.add(Mappings.getLink(Links.RESOURCE_AVATAR_SMALL, smallAvatarUrl));
        resource.add(Mappings.getLink(Links.RESOURCE_AVATAR_MEDIUM, mediumAvatarUrl));
        resource.add(Mappings.getLink(Links.RESOURCE_AVATAR_LARGE, largeAvatarUrl));

        return resource;
    }
}
