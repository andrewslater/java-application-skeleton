package com.andrewslater.example.models;

import com.andrewslater.example.api.Links;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AvatarSize {
    MICRO(32, Links.RESOURCE_AVATAR_MICRO),
    SMALL(64, Links.RESOURCE_AVATAR_SMALL),
    MEDIUM(128, Links.RESOURCE_AVATAR_MEDIUM),
    LARGE(256, Links.RESOURCE_AVATAR_LARGE);

    private String linkRel;
    private int size;

    AvatarSize(int size, String linkRel) {
        this.size = size;
        this.linkRel = linkRel;
    }

    public static AvatarSize getLargestSize() {
        AvatarSize largest = null;

        for (AvatarSize size : values()) {
            largest = largest == null || size.getSize() > largest.getSize() ? size : largest;
        }

        return largest;
    }

    public int getSize() {
        return size;
    }

    public String getLinkRel() {
        return linkRel;
    }
}
