function ProcessFlowTester() {

    var t = this;
    this.load = function(process_instance) {
        t.id = process_instance.id;
        t.process = process_instance.process;
    };

    this.abort = function abort() {
        if (!t.id) {
            alert("Please post/pull first.");
        }
        $.get('/koi/abort/' + t.id, {}, function () {

        });
    };

    this.complete = function complete() {

    };

    this.run = function test() {
        if (!t.id) {
            alert("Please post/pull first.");
        }
        $.get('/koi/start/' + t.id, {}, function () {

        });
    };

}