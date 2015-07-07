package com.andrewslater.example.react;

import org.apache.commons.pool2.impl.GenericObjectPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReactUtils {
    private static final Logger LOG = LoggerFactory.getLogger(ReactUtils.class);

    @Autowired
    private GenericObjectPool<ReactEngine> reactEnginePool;

    public String invokeFunction(String name, Object... args) throws ReactException {
        ReactEngine reactEngine = null;
        try {
            reactEngine = reactEnginePool.borrowObject();
            Object html = reactEngine.invokeFunction(name, args);
            return String.valueOf(html);
        } catch (Exception ex) {
            throw new ReactException("Failed to render react component", ex);
        } finally {
            try {
                if (reactEngine != null) {
                    reactEnginePool.returnObject(reactEngine);
                }
            } catch(Exception e){
                LOG.error("Error returning ReactEngine to pool: " + e.getMessage(), e);
            }
        }
    }
}
