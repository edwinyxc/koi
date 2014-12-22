function ProcessFlowEditor(element, options) {
// Points set, option, option, option
    function Point(x, y, option) {
        option = option || {};
        this.type = option.type || 's';
        this.x = x;
        this.y = y;
        this.radius = option.radius || 15;
        this.fillStyle = option.fillStyle || "#eee";
        this.strokeStyle = option.strokeStyle || "#444";
    }

    Point.prototype.render = function (ctx) {
        ctx.strokeStyle = this.strokeStyle;
        if ('s' == this.type) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
        }
        if ('a' == this.type) {
            ctx.strokeStyle = this.strokeStyle;
            ctx.strokeRect(this.x - 40, this.y - 35, 80, 70);
            //name
            ctx.font = "20px Verdana";
            ctx.fillText(this.name, this.x - 30, this.y - 10);
        }
        ctx.strokeStyle = "#444";
    };

    Point.prototype.toSynchronizer = function (strategy) {
        this.type = 's';
        this.syn_strategy = strategy || "any";
    };

    Point.prototype.toActivity = function (method, url, params) {
        this.type = 'a';
        this.act_url = url || this.act_url;
        this.act_method = method || this.act_method;
        this.act_params = $.extend({},this.act_params, params);
        this.syn_strategy = '';
    };

    Point.prototype.toString = function () {
        return "Point(" + this.x + "," + this.y + ")";
    };

    Point.prototype.moveTo = function () {
        if (arguments.length === 1 && typeof arguments[0] === 'object') {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        }
        else if (arguments.length === 2) {
            this.x = arguments[0];
            this.y = arguments[1];
        }
    };

    function Tran(from, to, intermediates) {

        this.from = from;
        this.to = to;
        this.intermediates = intermediates || [];
        /*the el expression*/
        this.condition = "true";

    }


    Tran.prototype.toString = function () {
        var ret = "(" + from.x + "," + from.y + ")";
        $.each(this.intermediates, function (i, elem) {
            ret += "->(" + elem.x + "," + elem.y + ")"
        });
        return ret;
    }

    Tran.prototype.addMidPoint = function (x, y) {
        this.intermediates.push({x: x, y: y});
    }

    Tran.prototype.render = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.from.x, this.from.y);
        $.each(this.intermediates, function (i, elem) {
            ctx.lineTo(elem.x, elem.y);
        });
        ctx.lineTo(this.to.x, this.to.y);
        ctx.closePath();
        ctx.stroke();
    }

    options = options || {
        url: "/koi"
    }

    //process flow id
    var id = null;

    var radius = 15; //px
    var t = this;
    var canvas = element;
    var ctx = element.get(0).getContext('2d');
    var offset = canvas.offset();
    var offset_x = offset.left;
    var offset_y = offset.top;

    function resetOffset() {
        offset = canvas.offset();
        offset_x = offset.left;
        offset_y = offset.top;
    }

    var points = [];

    //transitions
    var trans = [];

    var props = {};

    this.name = "new Process";
    this.canvas = canvas;
    this.points = points;
    this.trans = trans;
    this.props = props;

    this.ctx = ctx;

    function drawLine(p1, p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
    };

    this.load = function(process) {
        t.id = process.id;
        t.name = process.name;
        t.points = process.elements;
        t.trans = process.transitions;
        t.props = process.properties;
    };

    function mapTranToRef(t){
        var i_f = $.inArray(t.from, points);
        var i_t = $.inArray(t.to, points);
        return {
            from: i_f,
            to: i_t,
            condition: t.condition
        };
    }

    this.push = function push() {
        $.post(options.url + '/processes',{
            name:this.name,
            properties: $.toJSON(t.props),
            //TODO may the intermediates allowed to transfer
            transitions: $.toJSON((function(t){
                var ret = [];
                $.each(t, function(i,e){
                    ret.push(mapTranToRef(e));
                });
            })(t.trans)),
            elements: $.toJSON(t.points)
        },function(process){
            console.log('created process',process);//TODO remove this
            t.load(process);
        },'json');
    };

    this.pull = function pull(id) {
        $.get(options.url + '/processes/'+id,{},function(json){
            console.log('got process',process);//TODO remove this
            t.load(process);
        },'json');
    };


    function drawArrow(p1, p2, length) {
        //TODO draw the damm arrow using the degree algorithm
    }

    this.findPoint = findPoint;

    function findPoint(p_in, _radius) {
        _radius = _radius || radius;
        console.log("_radius", _radius);
        var a = p_in.x;
        var b = p_in.y;
        //try to not to judge by the color
        for (var i in points) {
            var p = points[i];
            if (p.type == 'a') {
                if (a < (p.x + 40) && a > (p.x - 40)
                    && b < (p.y + 35) && b > (p.y - 35)) {
                    return p;
                }
            }
            else {
                var x = p.x;
                var y = p.y;
                if (((x - a) * (x - a) + (y - b) * (y - b)) <= _radius * _radius) {
                    return p;
                }
            }
        }
        return undefined;
    }


    this.collidingDetect = collidingDetect;
    function collidingDetect(p) {
        var fp;
        if (fp = findPoint(p, radius * 2)) return fp;
        return false;
    }


    this.mousePoint = mousePoint;
    function mousePoint(event) {
        event.preventDefault();
        event.stopPropagation();
        var start_x = parseInt(event.pageX - offset_x);
        var start_y = parseInt(event.pageY - offset_y);
        var p = new Point(start_x, start_y);
        return p;
    }


    /**
     * Render the elements and the relations
     * on the certain context using the adjective matrix
     * the indices is allocated as them are in the elements array.
     * @param ctx
     * @param elements
     */
    this.render = renderGraph;
    function renderGraph() {
        resetOffset();
        $.each(points, function (i, elem) {
            elem.render(ctx);
        });
        $.each(trans, function (i, elem) {
            elem.render(ctx);
        });
    }

    this.drawPointAsArc = drawPointAsArc;
    function drawPointAsArc(ctx, p, radius) {
        //TODO
        ctx.strokeStyle = p.strokeStyle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
    }

    function drawPointAsRect(ctx, p, radius) {
        ctx.strokeStyle = p.strokeStyle;
        ctx.strokeRect(p.x - 40, p.y - 35, 80, 70);
        //name
        ctx.font = "20px Verdana";
        ctx.fillText(p.name, p.x - 30, p.y - 10);
    }

    /**
     *
     * @param ctx
     * @param canvas -- the canvas element
     */
    this.clear = clear;
    function clear(sureToCleanData) {
        if (sureToCleanData) {
            points = [];
            trans = [];
            props = [];
        }
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
        return this;
    }


    this.addPoint = addPoint;
    function addPoint(p) {
        points.push(p);
    }

    /**
     * Deletes the point and the related associations.
     */
    this.deletePoint = function deletePoint(p) {
        var del_idx = $.inArray(p, points);
        if (del_idx !== -1)
            points.splice(del_idx, 1);
    }

    this.addTran = function (p1, p2, condition) {
        var p1_idx = $.inArray(p1, points);
        var p2_idx = $.inArray(p2, points);
        var t = new Tran(p1, p2);
        t.condition = condition;
        this.trans.push(t);
    }

    this.deleteTran = function deleteTran(p1,p2) {
        var idx = -1;
        var t = null;
        $.each(trans, function(i,elem){
            if(elem.from.x == p1.x
            && elem.from.y == p1.y
            && elem.to.x == p2.x
            && elem.to.y == p2.y) {
                idx = i;
                t = elem;
            }
        });
        if (-1 !== idx) {
            this.trans.splice(idx);
        }
    }

    var __prop__ = {
        name: '',
        value: ''
    }

    this.prop = function (name, value) {
        this.props[name] = value;
    }




}
