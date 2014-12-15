package koi.kernel;

import koi.KOI;
import koi.Services;
import pond.common.S;
import pond.db.Model;
import pond.db.Record;

import java.util.List;

import static pond.common.S._for;

public class Property extends Model {
    /**
     *
     CREATE TABLE `t_property` (
     id      VARCHAR(64) PRIMARY KEY,
     name    VARCHAR(50) NOT NULL,
     value   VARCHAR(255) COMMENT 'default value',
     process VARCHAR(64),
     UNIQUE (`process`, `name`)
     );
     */ {
        db(KOI.getDb());
        table("t_property");
        id("id");
        //this is the key
        field("name");
        //this is the default value;
        field("value");
        field("process");

        set("_process", null);
    }


    public String name() {
        return this.get("name");
    }

    public Property name(String name) {
        this.set("name", name);
        return this;
    }


    public String defaultValue() {
        return this.get("value");
    }

    public Property defaultValue(String defaultValue) {
        this.set("value", defaultValue);
        return this;
    }

    Process process() {
        return this.get("_process");
    };

    public Property process(String process) {
        this.set("process", process);
        return this;
    }

    public Property refine() {
        this.set("_process", readProcess());
        return this;
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
     * @return the value
     */
    public String runtimeValue(String processInstanceId) {
        S._assert(processInstanceId);
        String sql = "select value from r_process_instance_property where " +
                "process_instance = ? " +
                "and property = ?";
        List<Record> list =
                _getDB().get(t -> t.query(sql, processInstanceId, this.id()));
        return _for(list).first().get("value");
    }

    /**
     *
     * @param processInstanceId
     * @param value
     * @return this property
     */
    public Property runtimeValue(String processInstanceId, String value) {
        S._assert(processInstanceId);
        String sql = "update r_process_instance_property " +
                "set value = ? " +
                "where process_instance = ? and property = ? ";
        _getDB().post(t -> t.exec(sql, value, processInstanceId, this.id()));
        return this;
    }


}
