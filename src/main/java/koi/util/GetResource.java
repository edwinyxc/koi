package koi.util;

import koi.kernel.Completion;
import koi.kernel.Element;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import pond.common.S;
import pond.common.f.Callback;
import pond.common.f.Function;
import pond.core.Mid;
import pond.core.Request;
import pond.core.Response;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import static pond.common.S._notNullElse;
import static pond.core.Render.json;

/**
 * Created by yxc on 2014/12/18.
 */
public class GetResource implements Callback.C2<Request,Response>{

    static Map<String, Function<Completion,Request>> cbs = new HashMap<>();
    static{
        cbs.put("putin", req ->{
            String processInstanceId = req.param("process_instance_id");
            String activityId = req.param("activity_id");
            String uri = req.param("uri");
            Completion ret = new Completion();
            S.http.get(uri, null, (response) -> {
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    ContentType contentType = ContentType.getOrDefault(entity);
                    Charset charset = contentType.getCharset();
                    try (InputStream inputStream = entity.getContent()) {
                        String responseText = S.stream.readFully(inputStream, charset);
                        ret.property(activityId+"_putin", responseText);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
            S._assert(uri, "uri must not null");
            return ret .complete(true);
        });
    }

    public GetResource(){ }

    @Override
    public void apply(Request request, Response response) {
        //return a competion
       String cb = request.param("cb");
       response.render(json(_notNullElse(cbs.get(cb),
               req->new Completion().complete(true))
               .apply(request)));
    }
}
