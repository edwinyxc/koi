package koi.kernel;

import koi.KOI;
import koi.Services;
import pond.common.S;
import pond.db.Model;
import pond.db.Record;

import java.util.List;

import static pond.common.S._for;

/**
 * Created by yxc on 2014/12/12.
 */
public class Transition extends Model {
    {
        db(KOI.getDb());
        table("t_transition");
        id("id");
        /*element id*/
        field("from");
        /*element id*/
        field("to");
        field("desc");
        /*process id*/
        field("process");
        //EL expr
        field("condition");

        set("_process", null);
        set("_from", null);
        set("_to", null);
    }

    Process process() {
        return this.get("_process");
    }

    Element from() {
        return this.get("_from");
    }

    Element to() {
        return this.get("_to");
    }

    public Transition init(String from, String to) {
        set("from", from);
        set("to", to);
        return this;
    }

    public Transition condition(String condition) {
        set("condition", condition);
        return this;
    }

    public Transition name(String name) {
        set("name", name);
        return this;
    }

    public Transition desc(String desc) {
        set("desc", desc);
        return this;
    }

    public Transition process(String process) {
        this.set("process", process);
        return this;
    }

    public Transition fromTo(Element from, Element to) {
        if(from != null) {
            this.set("from", from.id());
            this.set("_from", from);
        }
        if(to != null) {
            this.set("to", to.id());
            this.set("_to",to);
        }
        return this;
    }



    public Transition refine() {
        this.set("_process",readProcess());
        this.set("_from", readFrom());
        this.set("_to", readTo());
        return this;
    }

    public Element readFrom() {
        String from_id = this.get("from");
        if (S.str.isBlank(from_id))
            throw new RuntimeException("Blank process id!");
        return Services.elementServ.get(from_id);
    }

    public Element readTo() {
        String to_id = this.get("from");
        if (S.str.isBlank(to_id))
            throw new RuntimeException("Blank process id!");
        return Services.elementServ.get(to_id);
    }

    public Process readProcess() {
        String process_id = this.get("process");
        if (S.str.isBlank(process_id))
            throw new RuntimeException("Blank process id!");
        return Services.processServ.get(process_id);
    }


    /**
     * Reads the runtime value by the input processInstance
     *
     * @return
     */
    public Boolean runtimeResult(String processInstanceId) {
        S._assert(processInstanceId);
        String sql = "select result from r_process_instance_transition where " +
                "process_instance = ? " +
                "and transition = ?";
        List<Record> list =
                _getDB().get(t -> t.query(sql, processInstanceId, this.id()));
        return Boolean.valueOf((String)_for(list).first().get("result"));
    }


}
