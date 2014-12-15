package koi.kernel;

import koi.KOI;
import koi.Services;
import pond.common.S;
import pond.db.Model;
import pond.db.Record;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static pond.common.S._for;

/**
 * Created by yxc on 2014/12/12.
 */
public class Process extends Model {

    public static class Builder {
        final Process ins;

        List<Property> properties = new ArrayList<>();
        List<Element> elements = new ArrayList<>();
        List<Transition> transitions = new ArrayList<>();

        public Builder(String name) {
            ins = Record.newEntity(Process.class);
            ins.set("name",name);
        }

        public Builder property(String name, String defaultValue) {
            property(Record.newEntity(Property.class).name(name).defaultValue(defaultValue));
            return this;
        }

        public Builder activity(String method,
                                String url,
                                Map params) {
            return element(Record.newEntity(Element.class).initActivity(method, url, params));
        }

        public Builder synchronizer(String strategy) {
            return element(Record.newEntity(Element.class).initSynchronizer(strategy));
        }

        public Builder transition(Element from, Element to, String condition) {
            S._assert(from);
            S._assert(to);
            S._assert(((from.isActivity() && to.isSynchronizer()) || (to.isSynchronizer() && to.isActivity())),
                    " two same-type elements can not be connected");
            //TODO add condition validation
            return transition(Record.newEntity(Transition.class).fromTo(from, to).condition(condition));
        }

        public Builder property(Property p) {
            p.process(ins.id());
            properties.add(p);
            return this;
        }

        public Builder element(Element e) {
            e.process(ins.id());
            elements.add(e);
            return this;
        }


        public Builder transition(Transition t) {
            t.process(ins.id());
            transitions.add(t);
            return this;
        }

        public void validate() {
            // TODO Check if all the elements ????
        }

        public Process build() {
            //TODO save to the db
            _for(elements).each(Services.elementServ::add);
            _for(properties).each(Services.propertyServ::add);
            _for(transitions).each(Services.transitionServ::add);
            Services.processServ.add(ins);
            return ins.refine();
        }

    }

    List<Property> properties(){
        return this.get("properties");
    }
    List<Element> elements(){
        return this.get("elements");
    }
    List<Transition> transitions() {
        return this.get("transitions");
    }
    Element startElement() {
        return this.get("startElement");
    }

    {
        db(KOI.getDb());
        table("t_process");
        id("id");
        field("name").init(() -> "defaultProcess");

        set("properties",new ArrayList<>());
        set("elements", new ArrayList<>());
        set("transitions", new ArrayList<>());
        set("startElement", null);
    }


    public Process refine() {
        this.properties().clear();
        this.properties().addAll(readProperties());

        this.elements().clear();
        this.elements().addAll(_for(readElements()).map(Element::refine).toList());

        this.set("startElement", findStarter());
        this.transitions().clear();
        this.transitions().addAll(readTransitions());
        return this;
    }

    /**
     * Returns a Starter-Synchronizer
     *
     * @return
     */
    Element findStarter() {
        return _for(elements()).filter(e -> e.in().size() == 0).first();
    }

    Element findElementById(String element_id) {
        if (element_id == null) return null;
        for (Element e : elements()) {
            if (e.id().equals(element_id)) return e;
        }
        return null;
    }

    public List<Transition> readTransitions() {
        String sql = "select * from t_transition where process = ?";
        return this._getDB().get(t -> t.query(Transition.class, sql, this.id()));
    }

    public List<Element> readElements() {
        String sql = "select * from t_element where process = ?";
        return this._getDB().get(t -> t.query(Element.class, sql, this.id()));
    }

    public List<Property> readProperties() {
        String sql = "select * from t_property where process = ?";
        return this._getDB().get(t -> t.query(Property.class, sql, this.id()));
    }

    List<Transition> relatedTransitions(Element element) {
        String sql = "select * from t_transition where process = ? and ( from = ? or to = ? )";
        return this._getDB().get(t -> t.query(Transition.class, sql, this.id(), element.id(), element.id()));
    }

    public List<Element> nextActivities(Element synchronizer) {
        S._assert(synchronizer.isSynchronizer(), "input must be a synchronizer.");
        return _for(synchronizer.out()).map(Transition::to).toList();
    }

    public Element nextSynchronizer(Element activity) {
        S._assert(activity.isSynchronizer(), "input must be a activity.");
        Transition t = _for(activity.out()).first();
        if (t == null) throw new RuntimeException("activity can not be the end point.");
        return this.findElementById(t.to().id());
    }

    List<Transition> newRow(int length) {
        List<Transition> ret = new ArrayList<>();
        for (int i = 0; i < length; i++) {
            ret.add(null);
        }
        return ret;
    }

    public String toStringPoints() {
        StringBuilder builder = new StringBuilder("G:\n");
        for (Object item : elements()) {
            builder.append(item.toString());
            if (item == elements().get(elements().size() - 1)) {
                builder.append("\n");
            } else {
                builder.append(", ");
            }
        }
        return builder.toString();
    }


//    public String toStringGraph() {
//        StringBuilder builder = new StringBuilder("G:\n");
//        for (List row : graph) {
//            for (Object item : row) {
//                builder.append(String.valueOf(item));
//                if (item == row.get(row.size() - 1)) {
//                    builder.append("\n");
//                } else {
//                    builder.append(", ");
//                }
//            }
//        }
//        return builder.toString();
//    }

//    public String toString() {
//        return toStringPoints() + toStringGraph();
//    }


}
