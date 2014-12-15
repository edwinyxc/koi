package koi;

import org.junit.Test;
import pond.core.Pond;

import static org.junit.Assert.*;

public class KOITest {

    public static void app() {
        Pond.init(app ->{
            app._static("www");
            app.use("/koi",KOI.controller);
        }).listen(8081);
    }

    public static void main(String[] arg) {
        app();
    }
}