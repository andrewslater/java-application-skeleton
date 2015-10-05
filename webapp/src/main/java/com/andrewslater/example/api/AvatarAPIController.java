package com.andrewslater.example.api;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.AvatarSize;
import com.andrewslater.example.models.User;
import com.andrewslater.example.models.UserFile;
import com.andrewslater.example.security.SecurityUser;
import com.andrewslater.example.services.UserFilesService;
import com.andrewslater.example.services.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
public class AvatarAPIController {
    private static final Logger LOG = LoggerFactory.getLogger(AvatarAPIController.class);

    @Autowired
    private UserFilesService userFilesService;

    @Autowired
    private UserService userService;

    @RequestMapping(value = Mappings.API_PRINCIPAL_AVATAR, method = RequestMethod.POST)
    @JsonView(APIView.Authenticated.class)
    public HttpEntity<UserResource> uploadAvatar(@AuthenticationPrincipal SecurityUser securityUser,
                                 @RequestBody BufferedImage image) throws IOException {
        User principal = securityUser.getUser();
        int requiredDimension = AvatarSize.getLargestSize().getSize();

        if (image.getWidth() != requiredDimension || image.getHeight() != requiredDimension ) {
            String errorMessage = String.format("Provided image has incorrect dimensions (%dx%d). Must be %dx%d",
                                                image.getWidth(),
                                                image.getHeight(),
                                                requiredDimension,
                                                requiredDimension);
            throw new RuntimeException(errorMessage);
        }

        BufferedImage mediumImage = Scalr.resize(image, Scalr.Method.ULTRA_QUALITY, AvatarSize.MEDIUM.getSize());
        BufferedImage smallImage = Scalr.resize(image, Scalr.Method.ULTRA_QUALITY, AvatarSize.SMALL.getSize());

        UserFile largeAvatar = userFilesService.createUserFile(securityUser.getUser(), "avatar-large.png", image);
        UserFile mediumAvatar = userFilesService.createUserFile(securityUser.getUser(), "avatar-medium.png", mediumImage);
        UserFile smallAvatar = userFilesService.createUserFile(securityUser.getUser(), "avatar-small.png", smallImage);

        principal.setLargeAvatar(largeAvatar);
        principal.setMediumAvatar(mediumAvatar);
        principal.setSmallAvatar(smallAvatar);

        userService.update(principal);

        return userService.getResponseEntity(principal);
    }


    @RequestMapping(value = Mappings.API_AVATAR_SIZES, method = RequestMethod.GET)
    public List<AvatarSize> getSizes() {
        return Arrays.asList(AvatarSize.values());
    }
}
