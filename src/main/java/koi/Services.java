package koi;

import koi.kernel.*;
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
}
