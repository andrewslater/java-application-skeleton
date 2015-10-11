package com.andrewslater.example.converters;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class Base64EncodedImageHttpMessageConverter extends
    AbstractHttpMessageConverter<BufferedImage> {

    private Logger LOG = Logger.getLogger(this.getClass());

    public Base64EncodedImageHttpMessageConverter() {

        List<MediaType> mediaTypes = new ArrayList<MediaType>();
        String[] supportedMediaTypes = ImageIO.getReaderMIMETypes();
        for (String supportedMediaType : supportedMediaTypes) {
            String[] typeAndSubtype = supportedMediaType.split("/");
            mediaTypes.add(new MediaType(typeAndSubtype[0], typeAndSubtype[1]));
        }

        setSupportedMediaTypes(mediaTypes);
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return clazz.equals(BufferedImage.class);
    }

    @Override
    protected BufferedImage readInternal(Class<? extends BufferedImage> clazz,
        HttpInputMessage inputMessage) throws IOException,
        HttpMessageNotReadableException {

        StringWriter writer = new StringWriter();
        IOUtils.copy(inputMessage.getBody(), writer, "UTF-8");
        String imageInBase64 = writer.toString();
        int startOfBase64Data = imageInBase64.indexOf(",") + 1;
        imageInBase64 = imageInBase64.substring(startOfBase64Data, imageInBase64.length());

        if (!Base64.isBase64(imageInBase64)) {
            LOG.error("************************************************");
            LOG.error("*** IMAGE IN REQUEST IS NOT IN BASE64 FORMAT ***");
            LOG.error("************************************************");
        }

        byte[] decodeBase64 = Base64.decodeBase64(imageInBase64);
        return ImageIO.read(new ByteArrayInputStream(decodeBase64));
    }

    @Override
    protected void writeInternal(BufferedImage t,
        HttpOutputMessage outputMessage) throws IOException,
        HttpMessageNotWritableException {
        ImageIO.write(t, "jpeg", outputMessage.getBody());
        outputMessage.getBody().flush();
    }

}

