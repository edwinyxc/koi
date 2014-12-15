package koi.kernel;

import koi.KOI;
import pond.common.S;
import pond.db.Model;
import pond.db.Record;

/**
 * Created by yxc on 2014/12/15.
 */
public class Log extends Model {
    {
        db(KOI.getDb());
        table("t_log");
        id("id");
        field("process_instance");
        field("log");
        field("author");
        field("time");
    }

    static Log build(String process_instance, String logValue, String author) {
        Log log = Record.newEntity(Log.class);
        log.set("process_instance", process_instance);
        log.set("log", logValue);
        log.set("author", author);
        log.set("time", S.time());
        return log;
    }

}
