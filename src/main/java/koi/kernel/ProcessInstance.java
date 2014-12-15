package koi.kernel;

import koi.KOI;
import koi.Services;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import pond.common.S;
import pond.common.f.Tuple;
import pond.db.Model;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static pond.common.S._for;

/**
 * Created by yxc on 2014/12/12.
 */
public class ProcessInstance extends Model {

    {
        db(KOI.getDb());
        table("t_process_instance");
        id("id");
        field("name");
        field("process");
        field("addresser");
        field("start_time");
        field("ent_time");

        set("_process", null);
        set("_properties", new ArrayList<>());
    }

    Process process() {
        return this.get("_process");
    }

    List<Property> properties() {
        return this.get("_properties");
    }

    public ProcessInstance refine() {
        this.set("_process", readProcess().refine());
        this.properties().clear();
        this.properties().addAll(process().properties());
        return this;
    }

    public Map variables() {
        Map ret = new HashMap();
        _for(properties()).each(p -> {
            ret.put(p.name(), p.runtimeValue(this.id()));
        });
        return ret;
    }

//    public Map properties() {
//        Map ret = new HashMap();
//        _for(properties).each(p -> {
//            ret.put(p.name(),p.defaultValue());
//        });
//        return ret;
//    }

    public void updateVariable(String key, String value) {
        S._assert(key);
        Property variable = _for(properties()).filter(p -> key.equals(p.name())).first();
        S._assert(variable, "Property " + key + " not found.");
        variable.runtimeValue(this.id(), value);
    }

    public Process readProcess() {
        String process_id = this.get("process");
        if (S.str.isBlank(process_id))
            throw new RuntimeException("Blank process id!");
        return Services.processServ.get(process_id);
    }

    /**
     * Initialize the addresser and the start_time,
     * using the input process to run a instance;
     *
     * @param addresser
     * @return
     */
    public ProcessInstance init(String addresser, String process) {
        this.set("addresser", addresser);
        this.set("process", process);
        this.set("start_time", S.time());
        return this;
    }

    public Element start() {
        S._assert(process().startElement() != null && process().startElement().isSynchronizer());
        process().startElement().runtimeState(this.id(), Element.STATE_CURRENT);
        run(process().startElement());
        return process().startElement();
    }

    public ProcessInstance complete(Element activity, Completion completion) {
        S._assert(activity.asActivity());
        S._assert(process().elements().contains(activity));
         //update runtime properties
        _for(completion.properties())
                .each(param -> updateVariable(param.getKey(), param.getValue()));
        //change activity state
        if (completion.complete()) {
            activity.runtimeState(this.id(), Element.STATE_FINISHED);
            //run the sync and do something useful
            run(process().nextSynchronizer(activity));
        } else {
            activity.runtimeState(this.id(), Element.STATE_CURRENT);
        }
        //save log
        Services.logServ.add(logFromCompletion(completion));
        return this;
    }

    public void run(Element element) {
        S._assert(element);
        S._assert(Element.STATE_FINISHED != element.runtimeState(this.id()));
        if (element.isSynchronizer()) {

            String strategy = element.strategy();

            if (strategy.equals(Element.SYN_STRATEGY_ALL)) {
                List<Element> preActivities = _for(element.in()).map(t -> t.from()).toList();
                //if all pre-activities are finished
                for (Element pre : preActivities) {
                    if (pre.runtimeState(this.id()) != Element.STATE_FINISHED) {
                        //not all-finished, wait.
                        return;
                    }
                }
            } else if (Element.SYN_STRATEGY_ANY.equals(strategy)) {
                //nothing to do, just to run next.
            }

            //find valid transitions
            List<Transition> out = element.out();
            List<Element> validElements = new ArrayList<>();
            _for(out).each(t -> {
                if (t.runtimeResult(this.id())) {
                    validElements.add(t.to());
                }
            });
            _for(validElements).each(this::run);
        } else if (element.isActivity()) {
            //TODO SEND HTTP REQUEST
            Tuple.T3<String, String, Map> activity = element.asActivity();
            String method = activity._a;
            String url = activity._b;
            Map actParams = activity._c;
            Map params = variables();
            params.putAll(actParams);
            params.put("process_id", this.process().id());
            params.put("process_instance_id", this.id());
            params.put("element_id", element.id());

            switch (method) {
                case Element.ACT_METHOD_GET:
                    S.http.get(url, params, response -> {
                        //do nothing special here, only to check if the message has been sent correctly.
                        if (response.getStatusLine().getStatusCode() >= 300) {
                            throw new RuntimeException("Activity@" + element.id() + "[" + element.get("name") + "] sent failed.");
                        }
                        HttpEntity entity = response.getEntity();
                        if (entity != null) {
                            ContentType contentType = ContentType.getOrDefault(entity);
                            Charset charset = contentType.getCharset();
                            try (InputStream inputStream = entity.getContent()) {
                                String responseJson = S.stream.readFully(inputStream, charset);
                                Completion completion = Completion.parse(responseJson);
                                complete(element, completion);
                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                        }
                        //if response has
                    });
                    break;
            }

        }
        throw new RuntimeException("something went wrong, very wrong X( ");
    }

    Log logFromCompletion(Completion c) {
        return Log.build(c.processInstanceId(), c.log(), c.author());
    }

    /**
     * Returns the
     *
     * @return
     */
    public List<Element> findCurrentElements() {
        return _for(process().elements()).
                filter(e -> e.isActivity() && e.runtimeState(this.id()) == Element.STATE_CURRENT).toList();
    }


}
