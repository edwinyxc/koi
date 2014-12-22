package koi;

import koi.kernel.Completion;
import koi.util.GetResource;
import pond.common.S;
import pond.core.Controller;
import pond.core.Request;
import pond.core.Response;

import static pond.core.Render.json;

/**
 * Created by yxc on 2014/12/18.
 */
class UtilController extends Controller{
    static GetResource get = new GetResource();
    @Mapping(value = "/get")
    public void getResource (Request req, Response resp) {
        get.apply(req,resp);
    }

    @Mapping(value ="/debug")
    public void debug(Request req, Response resp) {
        Completion c = new Completion().complete(true);
        c.property("_koi_debug_"+ S.time(),req.param("msg"));
        resp.render(json(c));
    }

    @Mapping(value ="/pause")
    public void pause(Request req, Response resp) {
        Completion c = new Completion().complete(false);
        c.property("_koi_paused_at", Services.activityFromReq(req).id());
        c.property("_koi_paused_msg", req.param("msg"));
        resp.render(json(c));
    }
}
