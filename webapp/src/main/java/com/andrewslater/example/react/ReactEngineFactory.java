package com.andrewslater.example.react;

import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

@Component
public class ReactEngineFactory extends BasePooledObjectFactory<ReactEngine> implements
    ResourceLoaderAware {

    private ResourceLoader resourceLoader;

    @Override public ReactEngine create() throws Exception {
        return new ReactEngine(resourceLoader);
    }

    @Override
    public PooledObject<ReactEngine> wrap(ReactEngine reactEngine) {
        return new DefaultPooledObject<>(reactEngine);
    }

    @Override public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }
}
