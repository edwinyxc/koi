package koi;

import koi.kernel.*;
import koi.kernel.Process;
import pond.common.S;
import pond.core.Controller;
import pond.core.Pond;
import pond.core.Request;
import pond.core.Response;
import pond.core.http.HttpMethod;
import pond.db.DB;
import pond.db.Record;
import pond.db.connpool.SimplePool;

import java.lang.Integer;
import java.lang.String;
import java.util.List;
import java.util.Map;

import static pond.common.S._for;
import static pond.common.S._notNullElse;
import static pond.core.Render.json;

/**
 * Created by yxc on 2014/12/15.
 */
public class KOI {
    static DB db;

    public static DB getDb() {
        if (db == null) {
            db = new DB(new SimplePool().loadConfig(S.file.loadProperties("koi.conf")));
        }
        return db;
    }

    public ProcessInstance build(String addresser, String process) {
        ProcessInstance newInstance = Record.newEntity(ProcessInstance.class);
        newInstance.init(addresser, process);
        Services.processInstanceService.add(newInstance);
        return newInstance;
    }

    public static Controller controller = new Controller() {

        /*process*/
        @Mapping(value = "/processes/${_id}", methods = {HttpMethod.GET})
        public void getProcess(Request req, Response resp) {

        }

        @Mapping(value = "/processes", methods = {HttpMethod.POST})
        public void createProcess(Request req, Response resp) {
            String name = _notNullElse(req.param("name"), "process");
            String points_json = _notNullElse(req.param("elements"), "{}");
            List<Map> points = Pond.json().fromString(List.class, points_json);

            String edges_json= _notNullElse(req.param("transitions"), "{}");
            List<Map> edges = Pond.json().fromString(List.class, edges_json);

            String params_json = _notNullElse(req.param("properties"),"{}");
            List<Map> params = Pond.json().fromString(List.class, params_json);

            List<Element> elements = _for(points).map(Element::parse).toList();
            List<Transition> transitions = _for(edges).map(map -> {
                Integer from = (Integer) map.get("from");
                Integer to = (Integer) map.get("to");
                String condition = (String) map.get("condition");
                return Record.newEntity(Transition.class)
                        .init(elements.get(from).id(), elements.get(to).id())
                        .condition(condition);
            }).toList();
            List<Property> properties = _for(params).map( map ->
                    (Property)Record.newEntity(Property.class).merge(map)).toList();

            //build the process
            Process.Builder builder = new Process.Builder(name);
            _for(elements).each(builder::element);
            _for(transitions).each(builder::transition);
            _for(properties).each(builder::property);

            //build & save to db
            Process process = builder.build();

            resp.send(200,Pond.json().toString(process));
        }

        //
//        @Mapping(value = "/processes/${_id}", methods = {HttpMethod.PUT})
//        public void updateProcess(Request req, Response resp) {  }


        @Mapping(value = "/processInstances", methods = {HttpMethod.POST})
        public void createProcessInstance(Request req, Response resp) {
            String process_id = req.param("process_id");
            S._assert(process_id);
            Process process = Services.processServ.get(process_id);
            //check
            S._assert(process, "process not exists");
            String addresser = req.param("addresser");
            ProcessInstance p = Record.newEntity(ProcessInstance.class);
            p.init(addresser,process_id);
            Services.processInstanceService.add(p);
            resp.send(200,p.id());
        }

        @Mapping(value = "/processInstances/${_id}", methods = {HttpMethod.GET})
        public void getProcessInstance(Request req, Response resp) {
            String id = req.param("_id");
            S._assert(id);
            ProcessInstance pi = Services.processInstanceService.get(id);
            S._assert(pi);
            resp.render(json(pi.refine()));
        }

        @Mapping(value = "/processInstances/${_id}", methods = {HttpMethod.PUT})
        public void updateProcessInstance(Request req, Response resp) {
            //TODO
        }

        @Mapping(value = "/processInstances/${_id}/current", methods = {HttpMethod.PUT})
        public void processInstanceCurrentActs(Request req, Response resp) {
            String id = req.param("_id");
            S._assert(id);
            ProcessInstance pi = Services.processInstanceService.get(id);
            S._assert(pi);
            pi.refine();
            resp.render(json(pi.findCurrentElements()));
        }

        /**
         * activity_id;
         * process_instance_id;
         * completion --post-entity
         */
        @Mapping(value = "/complete", methods = {HttpMethod.POST})
        public void completeActivity(Request req, Response resp) {
            String activity_id = req.param("activity_id");
            String process_instance_id = req.param("process_instance_id");
            ProcessInstance pi = Services.processInstanceService.get(process_instance_id);
            Element a = Services.elementServ.get(activity_id);
            String properties_json = req.param("properties");

            S._assert(pi);
            S._assert(a);
            pi.refine().complete(a, new Completion()
                            .complete(true)
                            .activityId(activity_id)
                            .processInstanceId(process_instance_id)
                            .properties(Pond.json().fromString(Map.class, properties_json))
                            .author(req.param("author"))
                            .log(req.param("log"))
            );
            resp.send(200, process_instance_id);
        }

        @Mapping(value = "/complete/${process_instance_id}/${activity_id}")
        public void completeActivityFast(Request req, Response resp) {
            completeActivity(req, resp);
        }

        /**
         * process_instance_id
         */
        @Mapping(value = "/start/${process_instance_id}", methods = {HttpMethod.GET, HttpMethod.POST})
        public void startProcess(Request req, Response resp) {
            String pi_id = req.param("process_instance_id");
            ProcessInstance pi = Services.processInstanceService.get(pi_id);
            S._assert(pi);
            pi.refine();
            Element startNode = pi.start();
            resp.send(200, startNode.id());
        }

        @Mapping(value = "/abort/${process_instance_id}", methods = {HttpMethod.GET, HttpMethod.POST})
        public void abortProcess(Request req, Response resp) {
            String pi_id = req.param("process_instance_id");
            ProcessInstance pi = Services.processInstanceService.get(pi_id);
            S._assert(pi);
            pi.refine();
            Element startNode = pi.start();
            resp.send(200, startNode.id());
        }

    };

   public static Controller util = new UtilController();
}
