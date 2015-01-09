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
        $layout:null,
        $container:null,
        $scope: null,
        $canvas: null,
        Mouse: {
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            canvasX: 0, // relative to canvas
            canvasY: 0,
            updateMouse: function (e) {
                Designer.Mouse.clientX = e.clientX;
                Designer.Mouse.clientY = e.clientY;
                Designer.Mouse.pageX = e.pageX;
                Designer.Mouse.pageY = e.pageY;
                var canvas_offset = Designer.$canvas.offset();
                var canvas_x = canvas_offset.left - parseInt($(window).scrollLeft());
                var canvas_y = canvas_offset.top - parseInt($(window).scrollTop());
                Designer.Mouse.canvasX = Designer.Mouse.clientX - canvas_x;
                Designer.Mouse.canvasY = Designer.Mouse.clientY - canvas_y;
                Designer.$scope.$digest();
            }
        },
        Popup: {
            $popups: $('#popups'),
            register: function (name, $trigger, tmplUrl, $target) {
                var $p = Designer.Popup.$popups.find('div.popup_container[name=' + name + ']');
                if ($p.length == 0) {
                    $p = $('<div/>').css({display: 'none'});
                    $p.load(tmplUrl, function () {
                        $(this).attr('_popup', 'false')
                            .attr('name', name).addClass('popup_container');
                        _angularCompile($(this), Designer.$scope).appendTo(Designer.Popup.$popups);
                        $trigger.click(function () {
                            Designer.Popup.toggle($p, $target);
                        });
                    });
                }
            },
            toggle: function ($origin, $target) {
                $target.children().each(function (i, elem) {
                    if (elem !== $origin.get(0)) {
                        $(elem).hide(function () {
                            $(this).attr('_popup', 'false')
                                .detach().appendTo(Designer.Popup.$popups);
                        });
                    }
                });
                if ($origin.attr('_popup') == 'true') {
                    $origin.attr('_popup', 'false');
                    $origin.hide(function () {
                        $origin.detach().appendTo(Designer.Popup.$popups);
                        $target.hide();
                    });
                }
                else {
                    $origin.attr('_popup', 'true');
                    $target.show(function () {
                        $origin.detach().appendTo($target);
                        $origin.show();
                        Designer.$scope.$digest();
                    });
                }
            }
        },
        Dock: {
            $container: $('#details').find('ul'),
            $popup: $('#right_popup'),
            docks: [],
            init: function () {
                this.register('element', 'fa fa-code', '/app/tmpls/element_detail.html');
                this.register('properties', 'fa fa-list', '/app/tmpls/properties.html');
                this.render();
            },
            register: function (name, iconClass, tmplUrl) {
                var docks = Designer.Dock.docks;
                docks.push({
                    name: name,
                    icon: iconClass,
                    tmpl: tmplUrl
                });
            },
            render: function () {
                var $e = Designer.Dock.$container;
                var docks = Designer.Dock.docks;
                var $popup = Designer.Dock.$popup;
                $popup.hide();
                $e.empty();
                $(docks).each(function (i, elem) {
                    var $li = $('<li/>').append($('<a/>').append($('<i/>').addClass(elem.icon))
                        .attr('name', elem.name));
                    $e.append($li);
                    Designer.Popup.register(elem.name, $li, elem.tmpl, $popup);
                });
            }
        },

        Element: {},

        Menu: {
            /**
             *
             */
            register: function () {
                //TODO
            }

        },

        init: function ($scope) {
            Designer.$scope = $scope;

            var layout = Designer.$layout = $("#" + Designer.config.layoutId);
            var container = Designer.$container = layout.find("#" + Designer.config.containerId);
            var canvas = Designer.$canvas= layout.find("#" + Designer.config.canvasId);
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

            Designer.resize();
            Designer.centralize();

            Designer.Dock.init();

            //window events
            $(window).resize(function (e) {
                Designer.resize();
                e.preventDefault();
            });
            $(window).on('mousemove', function (e) {
                Designer.Mouse.updateMouse(e);
            });
            return this;
        },
        centralize: function () {
            var layout = $("#" + Designer.config.layoutId);
            layout.get(0).scrollLeft = Designer.config.pageMargin - 10;
            layout.get(0).scrollTop = Designer.config.pageMargin - 10;
        },
        resize: function () {
            var layout = $("#" + Designer.config.layoutId);
            var jqH = $(window).height();
            var wih = window.innerHeight;
            var h = $(window).height() - 35 - 18;
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