package com.andrewslater.example.api;

import com.andrewslater.example.annotations.Patchable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Component;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class ModelPatcher {
    private static final Logger LOG = LoggerFactory.getLogger(ModelPatcher.class);

    public void patchModel(Object model, Object patchSourceModel) {
        if (!model.getClass().equals(patchSourceModel.getClass())) {
            throw new RuntimeException("Cannot patch class of type " + model.getClass() + " with class of type " + patchSourceModel.getClass());
        }

        // TODO: Return list of fields on patchSourceModel which are not @Patchable so we can warn the API user
        BeanWrapper srcInfo = new BeanWrapperImpl(patchSourceModel);
        BeanWrapper targetInfo = new BeanWrapperImpl(model);

        for (Field field : getPatchableFields(model)) {
            Object patchValue = srcInfo.getPropertyValue(field.getName());
            if (patchValue != null) {
                targetInfo.setPropertyValue(field.getName(), patchValue);
            }
        }

    }

    private List<Field> getPatchableFields(Object model) {
        List<Field> fields = new ArrayList<>();
        for (Field field : model.getClass().getDeclaredFields()) {
            if (isPatchableField(field)) {
                fields.add(field);
            }
        }
        return fields;
    }

    private boolean isPatchableField(Field field) {
        for (Annotation annotation : field.getDeclaredAnnotations()) {
            if (annotation.annotationType().equals(Patchable.class)) {
                return true;
            }
        }
        return false;
    }
}
