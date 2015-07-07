package com.andrewslater.example.react;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.ResourceLoader;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

public class ReactEngine {
    private NashornScriptEngine scriptEngine;
    private ResourceLoader resourceLoader;

    public ReactEngine(ResourceLoader resourceLoader) throws IOException, ScriptException {
        this.resourceLoader = resourceLoader;
        scriptEngine = (NashornScriptEngine) new ScriptEngineManager().getEngineByName("nashorn");
        scriptEngine.eval(read("src/main/webapp/resources/js/nashorn-polyfill.js"));
        scriptEngine.eval(read("src/main/webapp/resources/minified/js/backend-libraries.js"));
        scriptEngine.eval(read("src/main/webapp/resources/js/compiled/jsx/list-users.js"));
    }

    public Object invokeFunction(String name, Object... args) throws ScriptException, NoSuchMethodException {
        return scriptEngine.invokeFunction(name, args);
    }

    private Reader read(String path) throws IOException {
        return new FileReader(resourceLoader.getResource("file:" + path).getFile());
    }
}
