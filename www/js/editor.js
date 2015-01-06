var Designer = (function ($) {
    return {
        config: {
            layoutId: 'designer_layout',
            containerId: 'canvas_container',
            canvasId: 'designer_canvas',
            viewportId: 'designer_viewport',
            panelItemWidth: 30,
            panelItemHeight: 30,
            canvasWidth: 1050,
            canvasHeight: 1050,
            pageMargin: 1000,
            anchorSize: 8,
            rotaterSize: 9,
            anchorColor: "#833",
            selectorColor: "#833",
            scale: 1
        },

        Dock:{

        },

        Shape:{

        },

        Menu:{
            /**
             *
             */
            register:function(){
                //TODO
            }

        },

        init: function () {
            var layout = $("#" + Designer.config.layoutId);
            var container = layout.find("#" + Designer.config.containerId);
            var canvas = layout.find("#" + Designer.config.canvasId);
            container.css({
                width: Designer.config.canvasWidth,
                height: Designer.config.canvasHeight,
                padding: Designer.config.pageMargin
            });
            canvas.attr({
                width: Designer.config.canvasWidth,
                height: Designer.config.canvasHeight
            });

            var ctx = canvas.get(0).getContext('2d');
            ctx.fillStyle = '#fff'// 红
            ctx.fillRect(0, 0, 1000, 1000);
            ctx.strokeStyle = '#FFF';
            ctx.strokeRect(1, 1, 998, 998);


            console.log(layout.get(0).scrollLeft);
            console.log(layout.get(0).scrollTop);

            Designer.resize();
            Designer.centralize();

            //window events
            $(window).resize(function (e) {
                Designer.resize();
                e.preventDefault();
            });
        },
        centralize: function () {
            var layout = $("#" + Designer.config.layoutId);
            layout.get(0).scrollLeft = Designer.config.pageMargin - 10;
            layout.get(0).scrollTop = Designer.config.pageMargin - 10;
        },
        resize: function () {
            var layout = $("#" + Designer.config.layoutId);
            var h = $(window).height() - 35 - 15;
            console.log(h);
            console.log(layout.get(0));
            layout.css({
                height: h + "px"
            });
        },
        open: function (process) {

        },
        save: function (process, url) {

        }
    };
})($);