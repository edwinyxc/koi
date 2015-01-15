package koi;

import org.junit.Test;
import pond.common.S;
import pond.core.Pond;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.*;

public class KOITest {

    public static void app() {
        Pond.init(app ->{
            app._static("www");
            app.use("/koi", KOI.controller);
            app.use("/util",KOI.util);
        }).listen(8081);
    }

    public static void main(String[] arg) {
        app();
    }
}
