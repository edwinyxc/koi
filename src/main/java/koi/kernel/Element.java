package koi.kernel;

import koi.KOI;
import pond.common.S;
import pond.common.f.Tuple;
import pond.core.Pond;
import pond.db.Model;
import pond.db.Record;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static pond.common.S._for;

public class Element extends Model {

    final public static String SYN_STRATEGY_ALL = "all";
    final public static String SYN_STRATEGY_ANY = "any";

    final public static String TYPE_ACTIVITY = "a";
    final public static String TYPE_SYNCHRONIZER = "s";

    final public static String ACT_METHOD_GET = "get";
    final public static String ACT_METHOD_POST = "post";
    final public static String ACT_METHOD_PUT = "put";
    final public static String ACT_METHOD_DELETE = "delete";

    final public static int STATE_UNHANDLED = 0;
    final public static int STATE_CURRENT = 1;
    final public static int STATE_FINISHED = 9;


    {
        db(KOI.getDb());
        table("t_element");
        id("id");
        /*
        * a - activity
        * s - synchronizer
        * */
        field("type");
        field("name");
        field("process");
        field("x").init(() -> 0);
        field("y").init(() -> 0);
        field("act_url");
        field("act_method");

        //a json formatted data
        field("act_params").init(() -> "{}");

        field("syn_strategy");

        set("in", new ArrayList<>());
        set("out", new ArrayList<>());
    }

    public static Element parse(Map map) {
        Element e = Record.newEntity(Element.class);
        return (Element) e.merge(map);
    }

    List<Transition> in() {
        return this.get("in");
    }
    List<Transition> out() {
        return this.get("out");
    }

    List<Transition> readIn() {
        String sql = "select * from t_transition where process = ? and to = ?";
        String process = this.get("process");
        S._assert(process);
        return this._getDB().get(t -> t.query(Transition.class, sql, process, this.id()));
    }

    String strategy() {
        S._assert(isSynchronizer());
        return this.get("syn_strategy");
    }

    Tuple.T3<String,String,Map> asActivity() {
        return Tuple.t3(this.get("act_method"), this.get("act_url"),
                Pond.json().fromString(Map.class,this.get("act_params")));
    }

    List<Transition> readOut() {
        String sql = "select * from t_transition where process = ? and from = ?";
        String process = this.get("process");
        S._assert(process);
        return this._getDB().get(t -> t.query(Transition.class, sql, process, this.id()));
    }

    public Element process(String process) {
        this.set("process", process);
        return this;
    }

    public Element refine() {
        this.in().clear();
        this.in().addAll(readIn());
        this.out().clear();
        this.out().addAll(readOut());
        return this;
    }

    public Element initActivity(String method, String url, Map params) {
        //TODO make it more seriously
        S._assert(method);
        //TODO add malformed url examination
        S._assert(url);
        this.set("type", TYPE_ACTIVITY);
        this.set("act_method", method);
        this.set("act_url", url);
        this.set("act_params", params);
        return this;
    }

    public Element initSynchronizer(String strategy) {
        this.set("type", TYPE_SYNCHRONIZER);
        this.set("syn_strategy", strategy);
        return this;
    }

    public boolean isActivity() {
        return TYPE_ACTIVITY.equals(this.get("type"));
    }

    public boolean isSynchronizer() {
        return TYPE_SYNCHRONIZER.equals(this.get("type"));
    }

    /**
     * <pre> Reads the runtime State by the input processInstance
     * the State can be:
     *  0. Default value means unhandled.
     *  1. Current, handled but not completed yet, waiting for completing signal.( Activity Only)
     *  9. Handled And Completed, shall reopen only when looping.
     * </pre>
     *
     * @return
     */
    public int runtimeState(String processInstanceId) {
        S._assert(processInstanceId);
        String sql = "select state from r_process_instance_element where " +
                "process_instance = ? " +
                "and element = ?";
        List<Record> list =
                _getDB().get(t -> t.query(sql, processInstanceId, this.id()));
        return _for(list).first().get("result");
    }

    /**
     *
     * @param processInstanceId
     * @param state
     * @return this property
     */
    public Element runtimeState(String processInstanceId, int state) {
        S._assert(processInstanceId);
        String sql = "update r_process_instance_element " +
                "set state = ? " +
                "where process_instance = ? and property = ? ";
        _getDB().post(t -> t.exec(sql, state, processInstanceId, this.id()));
        return this;
    }


}
