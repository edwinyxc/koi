package koi.kernel;

import pond.core.Pond;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static pond.common.S._notNullElse;

public class Completion extends HashMap<String, Object> {

    public Completion complete(Boolean b) {
        this.put("complete",b);
        return this;
    }

    public Boolean complete() {
        return Boolean.valueOf((String) this.get("complete"));
    }

    @SuppressWarnings("uncheked")
    public Map<String,String> properties() {
        return (Map<String,String>) _notNullElse(this.get("properties"), Collections.emptyMap());
    }

    public Completion properties(Map<String,String> properties) {
        this.put("properties", properties);
        return this;
    }

    public String activityId() {
        return (String) this.get("activity_id");
    }

    public Completion activityId(String id) {
        this.put("activity_id", id);
        return this;
    }

    public String processInstanceId() {
        return (String) this.get("process_instance_id");
    }

    public Completion processInstanceId(String id) {
        this.put("process_instance_id", id);
        return this;
    }

    public Completion property(String key, String value) {
        properties().put(key, value);
        return this;
    }

    public String property(String key) {
        return properties().get(key);
    }

    public String author() {
        return (String) this.get("author");
    }

    public Completion author(String author) {
        this.put("author", author);
        return this;
    }

    public String log() {
        return (String) this.get("log");
    }

    public Completion log(String log) {
        this.put("log", log);
        return this;
    }

    public static Completion parse(String json) {
        return Pond.json().fromString(Completion.class, json);
    }


}
