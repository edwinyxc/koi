package koi;

import koi.kernel.*;
import pond.common.S;
import pond.core.Request;
import pond.db.RecordService;

/**
 * Created by yxc on 2014/12/13.
 */
public class Services {
    public static RecordService<koi.kernel.Process> processServ = RecordService.build(new koi.kernel.Process());
    public static RecordService<ProcessInstance> processInstanceService = RecordService.build(new ProcessInstance());
    public static RecordService<Property> propertyServ = RecordService.build(new Property());
    public static RecordService<Element> elementServ = RecordService.build(new Element());
    public static RecordService<Transition> transitionServ = RecordService.build(new Transition());
    public static RecordService<Log> logServ = RecordService.build(new Log());

    public static ProcessInstance processInstanceFromReq(Request req){
        String pid = req.param("process_instance_id");
        S._assert(pid);
        return processInstanceService.get(pid);
    }

    public static Element activityFromReq(Request req){
        String aid = req.param("activity_id");
        S._assert(aid);
        return elementServ.get(aid);
    }
}
