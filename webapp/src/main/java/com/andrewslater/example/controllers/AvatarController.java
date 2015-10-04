package com.andrewslater.example.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.models.UserFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Controller
public class AvatarController {
    private static final Logger LOG = LoggerFactory.getLogger(AvatarController.class);

    @RequestMapping(value = Mappings.API_PRINCIPAL_AVATAR, method = RequestMethod.POST)
    @ResponseBody
    public UserFile uploadAvatar(@RequestBody BufferedImage image) throws IOException {
        LOG.debug("Handling principal {} avatar upload: {}", image);
        File outputFile = new File("/tmp/foo.png");
        ImageIO.write(image, "png", outputFile);
        return new UserFile();
    }
}
