var Util = {};
$(function () {
    $.ajaxSetup({cache: false});
    $("[title],[original-title]").live("mouseover", function () {
        if ($(this).attr("disableTitle")) {
            return false
        }
        var k = $(this);
        if (k.attr("title")) {
            k.attr("original-title", k.attr("title"));
            k.removeAttr("title")
        }
        if (!k.attr("original-title")) {
            return
        }
        var l = k.attr("original-title");
        var j = $("#hover_tip");
        if (j.length == 0) {
            j = $("<div id='hover_tip'><div class='tip_arrow'></div><div class='tip_content radius3'></div></div>").appendTo("body")
        }
        $(".tip_content").html(l);
        $("#hover_tip").show();
        $(".tip_arrow").removeClass("tip_right").removeClass("tip_top").css("top", "");
        if (k.attr("title_pos") == "right") {
            j.css({
                left: k.offset().left + k.outerWidth() + 7,
                top: k.offset().top + k.outerHeight() / 2 - j.outerHeight() / 2
            });
            $(".tip_arrow").attr("class", "tip_arrow tip_right").css("top", j.outerHeight() / 2 - 7)
        } else {
            if (k.attr("title_pos") == "top") {
                j.css({
                    left: k.offset().left + k.outerWidth() / 2 - j.outerWidth() / 2,
                    top: k.offset().top - j.outerHeight()
                });
                $(".tip_arrow").attr("class", "tip_arrow tip_top")
            } else {
                if (k.attr("title_pos") == "left") {
                    j.css({
                        left: k.offset().left - j.outerWidth() - 7,
                        top: k.offset().top + k.outerHeight() / 2 - j.outerHeight() / 2
                    });
                    $(".tip_arrow").attr("class", "tip_arrow tip_left")
                } else {
                    j.css({
                        left: k.offset().left + k.outerWidth() / 2 - j.outerWidth() / 2,
                        top: k.offset().top + k.outerHeight()
                    });
                    $(".tip_arrow").attr("class", "tip_arrow")
                }
            }
        }
    }).live("mouseout", function () {
        $("#hover_tip").hide()
    });
    var f;
    var i;
    var d;
    $(".user_quickinfo").live("mouseenter", function () {
        var k = $(this);
        var j = k.attr("userId");
        if (f) {
            f.abort()
        }
        clearTimeout(i);
        i = setTimeout(function () {
            f = Util.ajax({
                url: "/u/quickinfo", data: {userId: j}, success: function (m) {
                    if (m.result == "not_exists") {
                        return
                    }
                    var l = g();
                    l.attr("userId", j);
                    l.html(m);
                    l.show();
                    l.popMenu({autoClose: false, target: k, position: "left"});
                    l.unbind().bind("mouseenter", function () {
                        clearTimeout(d)
                    }).bind("mouseleave", function () {
                        l.popMenu("close")
                    });
                    $("#userinfo_follow_btn").unbind().bind("click", function () {
                        if ($(this).hasClass("green")) {
                            Util.ajax({
                                url: "/start/unfollow", data: {followId: j}, success: function (n) {
                                    $("#userinfo_follow_btn").text("关注").removeClass("green").addClass("default")
                                }
                            })
                        } else {
                            Util.ajax({
                                url: "/start/savefollow", data: {followIds: j}, success: function (n) {
                                    $("#userinfo_follow_btn").text("关注中").removeClass("default").addClass("green")
                                }
                            })
                        }
                    })
                }
            })
        }, 400)
    }).live("mouseleave", function () {
        if (f) {
            f.abort()
        }
        clearTimeout(i);
        d = setTimeout(function () {
            $("#userQuickInfo").popMenu("close")
        }, 400)
    });
    function g() {
        var j = $("#userQuickInfo");
        if (j.length == 0) {
            j = $("<div id='userQuickInfo' class='shadow_1 radius3' style='display:none;'></div>").appendTo("body")
        }
        return j
    }

    var h;
    var b;
    var c;
    $(".tag_quickinfo").live("mouseenter", function () {
        var k = $(this);
        var j = k.attr("tag");
        if (h) {
            h.abort()
        }
        clearTimeout(b);
        b = setTimeout(function () {
            h = Util.ajax({
                url: "/tags/quickinfo", data: {tag: j}, success: function (m) {
                    if (m.result == "not_exists") {
                        return
                    }
                    var l = e();
                    l.html(m);
                    l.show();
                    l.popMenu({autoClose: false, target: k, position: "left"});
                    l.unbind().bind("mouseenter", function () {
                        clearTimeout(c)
                    }).bind("mouseleave", function () {
                        l.popMenu("close")
                    });
                    $("#taginfo_follow_btn").unbind().bind("click", function () {
                        if ($(this).hasClass("green")) {
                            Util.ajax({
                                url: "/tags/unfollow", data: {tagName: j}, success: function (n) {
                                    $("#taginfo_follow_btn").text("关注").removeClass("green").addClass("default")
                                }
                            })
                        } else {
                            Util.ajax({
                                url: "/tags/follow", data: {tagName: j}, success: function (n) {
                                    $("#taginfo_follow_btn").text("关注中").removeClass("default").addClass("green")
                                }
                            })
                        }
                    })
                }
            })
        }, 400)
    }).live("mouseleave", function () {
        if (h) {
            h.abort()
        }
        clearTimeout(b);
        c = setTimeout(function () {
            $("#tagQuickInfo").popMenu("close")
        }, 400)
    });
    function e() {
        var j = $("#tagQuickInfo");
        if (j.length == 0) {
            j = $("<div id='tagQuickInfo' class='shadow_1 radius3' style='display:none;'></div>").appendTo("body")
        }
        return j
    }

    var a = document.referrer;
    if (a && a.indexOf("processon.com") < 0) {
        Util.setCookie("processon_referrer", encodeURI(a), 1)
    }
});
Array.prototype.inArray = function (b) {
    for (var a = 0; a < this.length; a++) {
        if (this[a] == b) {
            return true
        }
    }
    return false
};
Array.prototype.indexOf = function (b) {
    for (var a = 0; a < this.length; a++) {
        if (this[a] == b) {
            return a
        }
    }
    return -1
};
Array.prototype.remove = function (b) {
    var a = this.indexOf(b);
    if (a > -1) {
        this.splice(a, 1)
    }
};
Util.formatMsg = function (str, args) {
    if (typeof args != "object") {
        eval("args=['" + args + "']")
    }
    for (var i = 0; i < args.length; i++) {
        var toReplace = "{" + i + "}";
        str = str.replace(toReplace, args[i])
    }
    return str
};
Util.formatNumber = function (e, c) {
    if (/[^0-9\.]/.test(e)) {
        return "0"
    }
    if (e == null || e == "") {
        return "0"
    }
    e = e.toString().replace(/^(\d*)$/, "$1.");
    e = (e + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    e = e.replace(".", ",");
    var d = /(\d)(\d{3},)/;
    while (d.test(e)) {
        e = e.replace(d, "$1,$2")
    }
    e = e.replace(/,(\d\d)$/, ".$1");
    if (c == 0) {
        var b = e.split(".");
        if (b[1] == "00") {
            e = b[0]
        }
    }
    return e
};
Util.onlyNum = function (b) {
    var a = b || window.event;
    if (!(a.keyCode >= 8 && a.keyCode <= 20) || (a.keyCode >= 33 && a.keyCode <= 46)) {
        if (!((a.keyCode >= 48 && a.keyCode <= 57) || (a.keyCode >= 96 && a.keyCode <= 105))) {
            if (window.event) {
                a.returnValue = false
            } else {
                a.preventDefault()
            }
        }
    }
    return a.keyCode
};
$.fn.clear = function () {
    $(this).find("input[type=text]").val("");
    $(this).find("input[type=password]").val("");
    $(this).find("textarea").val("");
    $(this).find("select").val("")
};
$.fn.submitFormAjax = function (a) {
    var b = $(this);
    if (a.onSubmit) {
        if (a.onSubmit.call() == false) {
            return
        }
    }
    $.ajax({
        url: a.url ? a.url : $(this).attr("action"),
        type: "POST",
        data: $(this).serialize(),
        success: function (c) {
            if (c.error == "error") {
                $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
            } else {
                if (c.error == "notlogin") {
                    Util.loginWindow("open", function () {
                        b.submitFormAjax(a)
                    })
                } else {
                    if (a.success) {
                        a.success(c)
                    }
                }
            }
        },
        error: function (c) {
            $.simpleAlert("暂时无法处理您的请求，请稍候重试。".errorMsg, "error", 3000);
            if (a.error) {
                a.error(c)
            }
        }
    })
};
$.fn.submitForm = function (opt) {
    var defaultOpt = {json: true};
    var options = $.extend(defaultOpt, opt);
    var form = $(this);
    if (options.onSubmit) {
        if (options.onSubmit.call(form) == false) {
            return
        }
    }
    if (options.url) {
        form.attr("action", options.url)
    }
    var frameId = "submit_frame_" + (new Date().getTime());
    var frame = $("<iframe id=" + frameId + " name=" + frameId + "></iframe>").attr("src", window.ActiveXObject ? "javascript:false" : "about:blank").css({
        position: "absolute",
        top: -1000,
        left: -1000
    });
    form.attr("target", frameId);
    frame.appendTo("body");
    frame.bind("load", submitCallback);
    form.append("<input type='hidden' name='submitFormByHiddenFrame' id='submitFormByHiddenFrameParam' value='hiddenFrame'/>");
    form[0].submit();
    $("#submitFormByHiddenFrameParam").remove();
    var checkCount = 10;

    function submitCallback() {
        frame.unbind();
        var body = $("#" + frameId).contents().find("body");
        var data = body.html();
        if (data == "") {
            if (--checkCount) {
                setTimeout(submitCallback, 200);
                return
            }
            return
        }
        var ta = body.find(">textarea");
        if (ta.length) {
            data = ta.val()
        } else {
            var pre = body.find(">pre");
            if (pre.length) {
                data = pre.html()
            }
        }
        try {
            eval("data=" + data);
            if (data.error == "error") {
                $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
            } else {
                if (data.error == "notlogin") {
                    Util.loginWindow("open", function () {
                        form.submitForm(options)
                    })
                } else {
                    if (options.success) {
                        options.success(data)
                    }
                }
            }
        } catch (e) {
            if (options.json) {
                $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000);
                if (options.error) {
                    options.error(data)
                }
            } else {
                if (options.success) {
                    options.success(data)
                }
            }
        }
        setTimeout(function () {
            frame.unbind();
            frame.remove()
        }, 100)
    }
};
Util.ajax = function (a) {
    if (a.onSend) {
        if (a.onSend() == false) {
            return
        }
    }
    var b = {type: "POST"};
    a = $.extend(b, a);
    return $.ajax({
        url: a.url, type: a.type, traditional: true, data: a.data, success: function (c) {
            if (c.error == "error") {
                $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000);
                if (a.error) {
                    a.error(c)
                }
            } else {
                if (c.error == "notlogin") {
                    if (a.loginValidate) {
                        a.loginValidate(c)
                    }
                    Util.loginWindow("open", function () {
                        Util.ajax(a)
                    })
                } else {
                    if (a.success) {
                        a.success(c)
                    }
                }
            }
        }, error: function (c) {
            if (c.status) {
                if (a.error) {
                    a.error(c)
                } else {
                }
            }
        }
    })
};
Util.load = function (d, a, c, e, b) {
    $.ajax({
        url: a, type: "POST", dataType: "html", data: c, success: function (f) {
            if (f.error == "error") {
                $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
            } else {
                if (f.error == "notlogin") {
                    Util.loginWindow("open", function () {
                        Util.load(d, a, c, e, b)
                    })
                } else {
                    if (b) {
                        if (b(f)) {
                            d.html(f);
                            if (e) {
                                e(f)
                            } else {
                                d.html(f)
                            }
                        }
                    } else {
                        if (e) {
                            d.html(f);
                            e(f)
                        } else {
                            d.html(f)
                        }
                    }
                }
            }
        }, error: function (f) {
            $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
        }
    })
};
Util.get = function (a, b, c) {
    $.ajax({
        url: a, type: "GET", data: b, success: function (d) {
            if (d.error == "error") {
                $.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
            } else {
                if (d.error == "notlogin") {
                    Util.loginWindow("open", function () {
                        Util.get(a, b, c)
                    })
                } else {
                    c(d)
                }
            }
        }, error: function (d) {
        }
    })
};
Util.filterXss = function (a) {
    a = a.toString();
    a = a.replace(/[<%3C]/g, "&lt;");
    a = a.replace(/[>%3E]/g, "&gt;");
    a = a.replace(/"/g, "&quot;");
    a = a.replace(/'/g, "&#39;");
    return a
};
$.fn.disable = function (c, b) {
    $(this).attr("disable", true);
    $(this).addClass("opacity");
    for (var a = 0; a < $(this).length; a++) {
        var d = $(this)[a];
        $(d).unbind("mouseover.disable").bind("mouseover.disable", function () {
            var e = $("<div class='disabled-mask'></div>").appendTo("body");
            if (!c) {
                c = 2
            }
            e.css({
                width: $(this).outerWidth() + c,
                height: $(this).outerHeight() + 4,
                top: $(this).offset().top,
                left: $(this).offset().left
            });
            if (b) {
                e.css("z-index", b)
            }
            e.bind("mouseout", function () {
                $(this).remove()
            })
        }).bind("focus", function () {
            $(this).blur()
        });
        $(d).trigger("mouseover.disable")
    }
    return this
};
$.fn.enable = function () {
    $(this).attr("disable", false);
    $(this).removeClass("opacity");
    for (var a = 0; a < $(this).length; a++) {
        var b = $(this)[a];
        $(b).unbind("mouseover.disable").unbind("focus")
    }
    $(".disabled-mask").trigger("mouseout");
    return this
};
Util.loginWindow = function (c, b) {
    if (typeof c == "undefined") {
        c = "open"
    }
    if (c == "open") {
        if ($("#loginWindow").length) {
            $("#loginWindow").remove()
        }
        var a = $("<div id='loginWindow' class='loginWindow'></div>").appendTo("body");
        a.append("<div id='loginWindow-content' class='loginWindow-content'><img src='/images/ajaxload.gif' style='margin:80px 0px 0px 45%'/></div>");
        $("#loginWindow-content").load("/login/window", function () {
            loginCallback = b
        });
        a.dialog()
    } else {
        if (c = "close") {
            $("#loginWindow").dialog("close")
        }
    }
};
Util.globalTopTip = function (d, c, b) {
    if (typeof d == "undefined") {
        return
    }
    if (b == null) {
        b = 5000
    }
    if (c == null) {
        c = "top_success"
    }
    var e = $("#global_top_dialog");
    if (e.length > 0) {
        e.remove()
    }
    e = $('<div id="global_top_dialog" class="global_top_dialog"><div class="left_arrow"></div>' + d + '<div class="right_arrow"></div></div>').appendTo("body");
    e.addClass(c);
    var a = e.outerWidth();
    if ($("#header").length == 0) {
        e.css("top", "0px")
    }
    e.css({"margin-left": -(a * 0.5) + "px"}).show();
    setTimeout(function () {
        e.addClass("show");
        setTimeout(function () {
            e.removeClass("show");
            setTimeout(function () {
                e.fadeOut("slow").remove()
            }, 250)
        }, b)
    }, 50)
};
Util.setCookie = function (b, c, a) {
    var d = new Date();
    d.setDate(d.getDate() + a);
    document.cookie = b + "=" + escape(c) + ((a == null) ? "" : ";expires=" + d.toGMTString())
};
Util.getCookies = function (b) {
    if (document.cookie.length > 0) {
        var c = document.cookie.indexOf(b + "=");
        if (c != -1) {
            c = c + b.length + 1;
            var a = document.cookie.indexOf(";", c);
            if (a == -1) {
                a = document.cookie.length
            }
            return unescape(document.cookie.substring(c, a))
        }
    }
    return ""
};
Util.checkPrivateFileCount = function (a) {
    Util.ajax({
        url: "/view/getprivatefilecount", success: function (b) {
            if (b.filecount >= b.totalcount) {
                $.confirm({
                    content: "私有存储空间已经不足<br><br><span>▪ 您只能创建公开文件，点击确定继续。</span><br>▪ 您也可以去 <a target='_blank' href='/support/privatefile'>扩容</a>",
                    onConfirm: function () {
                        a()
                    }
                })
            } else {
                a()
            }
        }
    })
};
(function ($) {
    var b = 0;
    $.mask = function (d) {
        if (typeof d == "undefined") {
            d = "open"
        }
        if (d == "open") {
            if (b == 0) {
                var c = $("<div id='window-mask' class='window-mask' style='display:none'></div>").appendTo("body");
                c.css({
                    width: $(window).width() + "px",
                    height: $(window).height() + "px",
                    filter: "alpha(opacity=60)"
                }).show();
                $(window).bind("resize.mask", function () {
                    c.css({width: $(window).width() + "px", height: $(window).height() + "px"})
                })
            }
            b++
        } else {
            if (d == "close") {
                b--;
                if (b == 0) {
                    $("#window-mask").remove();
                    $(window).unbind("resize.mask")
                }
            }
        }
    };
    $.fn.dialog = function (e) {
        var d = $(this);
        if (typeof e == "string") {
            if (e == "close") {
                d.find(".dialog_close").trigger("click");
                if ($("#window-mask") != null) {
                    $("#window-mask").hide()
                }
            }
        } else {
            var g = {fixed: true, closable: true, mask: true};
            e = $.extend(g, e);
            if (!e) {
                e = {}
            }
            var h = "";
            if (e.title) {
                h = e.title
            } else {
                if (d.attr("title")) {
                    h = d.attr("title");
                    d.attr("title", "")
                }
            }
            d.addClass("dialog_box").show();
            var i = $("<div class='dialog_close'></div>").appendTo(d);
            i.bind("click", function () {
                if (e.onClose) {
                    if (e.onClose() == false) {
                        return
                    }
                }
                $.mask("close");
                d.hide();
                d.removeClass("dialog_box").find(".dialog_close").remove();
                var j = d.find(".dialog_title");
                d.attr("title", j.text());
                j.remove();
                $(window).unbind("resize.dialog")
            });
            if (e.closable) {
                i.show()
            }
            if (h != "") {
                d.prepend("<h2 class='dialog_title'>" + h + "</h2>")
            }
            if (e.mask) {
                $.mask()
            }
            var f = d.outerWidth();
            var c = d.outerHeight();
            $(window).bind("resize.dialog", function () {
                var k = 0;
                if (e.fixed) {
                    d.css("position", "fixed");
                    k = ($(window).height() - c) / 2 + "px"
                } else {
                    d.css("position", "absolute");
                    k = ($(window).height() - c) / 2 + $(document).scrollTop() + "px"
                }
                var j = ($(window).width() - f) / 2 + "px";
                d.css({top: k, left: j})
            });
            $(window).trigger("resize.dialog");
            d.find(".dialog_title").draggable({target: d})
        }
        return d
    };
    $.confirm = function (c) {
        var d = $("#global_confirm_window");
        if (!d.length) {
            d = $("<div id='global_confirm_window' title='请确认'><div class='msg'></div><div class='buttons'><span class='button default okbtn'>确定</span>&nbsp;&nbsp;<span class='button cancelbtn'>取消</span></div></div>").appendTo("body")
        }
        d.find(".msg").html(c.content);
        if (c.width) {
            d.css("width", c.width)
        }
        if (c.height) {
            d.css("height", c.height)
        }
        d.dialog();
        d.find(".okbtn").unbind().bind("click", function () {
            d.dialog("close");
            if (c.onConfirm) {
                c.onConfirm()
            }
        });
        d.find(".cancelbtn").unbind().bind("click", function () {
            d.dialog("close");
            if (c.onCancel) {
                c.onCancel()
            }
        })
    };
    $.fn.popMenu = function (c) {
        var i = $(this);
        if (typeof c == "string") {
            if (c == "close") {
                i.hide().removeClass("popover");
                $(window).unbind("resize.popmenu")
            }
            return
        }
        var h = {
            position: "left",
            fixed: false,
            offsetX: 0,
            offsetY: 0,
            zindex: 2,
            autoClose: true,
            closeAfterClick: false,
            autoPosition: true
        };
        var d = $.extend(h, c);
        var g = $(d.target);
        i.addClass("popover").css("z-index", d.zindex);
        if (d.fixed) {
            i.css("position", "fixed")
        }
        if (d.autoClose) {
            if (d.closeAfterClick == false) {
                i.unbind("mouseup.popmenu").bind("mouseup.popmenu", function (j) {
                    j.stopPropagation()
                })
            }
            $(document).bind("mouseup.popmenu", function () {
                i.popMenu("close");
                $(document).unbind("mouseup.popmenu");
                if (d.onClose) {
                    d.onClose()
                }
            })
        }
        $(window).bind("resize.popmenu", function () {
            i.popMenu(c)
        });
        i.show();
        var f = 0;
        if (d.position == "center") {
            f = g.offset().left + g.outerWidth() / 2 - i.outerWidth() / 2
        } else {
            if (d.position == "right") {
                f = g.offset().left + g.outerWidth() - i.outerWidth()
            } else {
                f = g.offset().left
            }
        }
        if (f + i.outerWidth() > $(window).width()) {
            f = $(window).width() - i.outerWidth()
        }
        var e = g.offset().top + g.outerHeight();
        if (d.autoPosition && e + d.offsetY + i.outerHeight() > $(window).height() + $(document).scrollTop()) {
            i.css({top: $(window).height() - i.outerHeight() + $(document).scrollTop(), left: f + d.offsetX})
        } else {
            i.css({top: e + d.offsetY, left: f + d.offsetX})
        }
    };
    $.simpleAlert = function (h, f, d) {
        if (h == "close") {
            $("#simplealert").remove();
            return
        }
        if ($("#simplealert").length) {
            $("#simplealert").remove()
        }
        var g = "simplealert-icon-info";
        if (f) {
            g = "simplealert-icon-" + f
        }
        var c = $("<div id='simplealert' class='simplealert'></div>").appendTo("body");
        var e = "<div class='" + g + "'>";
        if (f == "loading") {
            e += "<img src='/images/default/designer/loading.gif' style='margin:10px 0px 0px 12px'/>"
        }
        e += "</div><div class='simplealert-msg'>" + h + "</div><div class='simplealert-right'></div>";
        c.html(e);
        c.css("top", ($(window).height() - c.height()) / 2 + $(window).scrollTop() + "px");
        c.css("left", ($(window).width() - c.width()) / 2 + $(window).scrollLeft() + "px");
        c.show();
        if (d != "no") {
            setTimeout(function () {
                c.fadeOut(200)
            }, d ? d : 3500)
        }
    };
    $.fn.tooltip = function (d, c, f) {
        var e;
        c = c ? c : "warning";
        if (c != "none") {
            d = "<img src='/images/icon/ico-" + c + ".png' style='vertical-align:middle;margin-right:5px;'/><span>" + d + "</span>"
        }
        if ($("p#p_toolTip").length) {
            $("p#p_toolTip").remove()
        }
        $("body").append('<p id="p_toolTip" class="radius3"><img id="img_toolTip_Arrow" src="/images/icon/arrow-left.png" />' + d + "</p>");
        e = $("p#p_toolTip");
        $("p#p_toolTip #img_toolTip_Arrow").css({position: "absolute", top: "5px", left: "-13px"});
        if (!f) {
            e.show()
        } else {
            e.fadeIn("fast")
        }
        e.css({left: $(this).offset().left + $(this).width() + 18, top: $(this).offset().top - 16})
    };
    $.closeTooltip = function () {
        $("p#p_toolTip").remove()
    };
    $.fn.draggable = function (c) {
        var e = {target: $(this)};
        var d = $.extend(e, c);
        $(this).unbind("dragstart").bind("dragstart", function () {
            return false
        });
        $(this).unbind("mousedown.drag").bind("mousedown.drag", function (g) {
            $(document).bind("selectstart", function () {
                return false
            });
            var j = g.pageX;
            var h = g.pageY;
            var i = d.target.offset().left;
            var f = d.target.offset().top;
            $(document).bind("mousemove.drag", function (n) {
                var m = n.pageX - j + i;
                var l = n.pageY - h + f;
                if (d.bounding) {
                    var k = d.bounding.offset().left;
                    var o = d.bounding.offset().top;
                    if (m > k && l > o && m < k + d.bounding.outerWidth() - d.target.outerWidth() && l < o + d.bounding.outerHeight() - d.target.outerHeight()) {
                        d.target.offset({left: m, top: l})
                    }
                } else {
                    d.target.offset({left: m, top: l})
                }
            });
            $(document).bind("mouseup.drag", function (k) {
                $(document).unbind("selectstart");
                $(document).unbind("mousemove.drag");
                $(document).unbind("mouseup.drag")
            })
        })
    };
    $.fn.suggest = function (d) {
        var h = $(this);
        var g = {
            valueField: "value", width: h.outerWidth(), format: function (j) {
                return j.text
            }
        };
        var e = $.extend(g, d);
        if (!h.data("suggest")) {
            var i = $("<ul class='suggest_menu'></ul>").appendTo("body");
            i.width(e.width);
            h.data("suggest", i)
        }
        var c = -1;
        var f = "";
        h.unbind("keydown.suggest").bind("keydown.suggest", function (k) {
            var l = h.data("suggest");
            if (k.keyCode == 40) {
                k.preventDefault();
                if (c < l.children().length - 1) {
                    c++;
                    l.find(".selected").removeClass("selected");
                    l.find("li[index=" + c + "]").addClass("selected")
                }
            } else {
                if (k.keyCode == 38) {
                    k.preventDefault();
                    l.find(".selected").removeClass("selected");
                    if (c >= 0) {
                        c--;
                        l.find("li[index=" + c + "]").addClass("selected")
                    }
                } else {
                    if (k.keyCode == 13) {
                        var j = l.find(".selected");
                        if (j.length) {
                            h.val(j.attr("val"))
                        }
                        if (e.onEnter) {
                            e.onEnter(h)
                        }
                        l.empty().popMenu("close")
                    }
                }
            }
        }).unbind("keyup.suggest").bind("keyup.suggest", function (k) {
            var l = h.data("suggest");
            var j = h.val();
            if (j == "") {
                l.empty().popMenu("close")
            } else {
                if (j != f) {
                    c = -1;
                    $.get(e.url, {q: j}, function (p) {
                        l.empty();
                        var m = p.items;
                        if (m.length == 0) {
                            l.empty().popMenu("close")
                        } else {
                            for (var n = 0; n < m.length; n++) {
                                var o = m[n];
                                var q = "<li index='" + n + "' class='suggest_item' val='" + o[e.valueField] + "'>";
                                q += e.format(o);
                                q += "</li>";
                                l.append(q)
                            }
                            l.popMenu({target: h, zindex: 4});
                            l.find(".suggest_item").bind("mousedown", function (r) {
                                r.preventDefault();
                                h.val($(this).attr("val"));
                                if (e.onEnter) {
                                    e.onEnter(h)
                                }
                                l.empty().popMenu("close")
                            })
                        }
                    })
                }
            }
            f = j
        }).unbind("blur.suggest").bind("blur.suggest", function (j) {
            var k = h.data("suggest");
            k.empty().popMenu("close")
        })
    };
    $.fn.switchbutton = function (d) {
        var j = {
            val: true,
            width: 82,
            height: 30,
            innerHeight: 22,
            innerWidth: 22,
            innerBackground: "#fff",
            enable: true,
            title: ""
        };
        var e = $.extend(j, d);
        var i = $(this), c = i.find(".switch"), g = i.find(".switch-left"), f = i.find(".switch-right");
        i.css({width: e.width, height: e.height, "line-height": e.height - 10 + "px"});
        c.css({width: e.innerWidth, height: e.innerHeight, background: e.innerBackground});
        i.on("click", function () {
            if (!e.enable) {
                return
            }
            if (e.val) {
                e.val = false
            } else {
                e.val = true
            }
            h()
        });
        h();
        function h() {
            if (!e.val) {
                i.attr("title", e.true_tip);
                i.removeClass("green").addClass("gray");
                c.addClass("left").removeClass("right");
                g.hide();
                f.show();
                c.html("<span class='lock-icon'></span>")
            } else {
                i.attr("title", e.false_tip);
                i.removeClass("gray").addClass("green");
                c.addClass("right").removeClass("left");
                g.show();
                f.hide();
                c.html("<span class='unlock-icon'></span>")
            }
            i.attr("val", e.val)
        }
    };
    $.fn.pagination = function (m, h, l, g) {
        if (h <= 0) {
            return
        }
        var n = 5;
        if (g) {
            n = g
        }
        var j = $(this).addClass("pagination");
        var c = 1;
        var e = h;
        if (h > n) {
            var k = Math.floor(n / 2);
            var c = (m - k) > 0 ? (m - k) : 1;
            if (h - c < n) {
                c = h - n + 1
            }
            var e = c + n - 1
        }
        var d = "";
        if (m > 1) {
            d += "<a p='" + (m - 1) + "'>«</a>"
        } else {
            d += "<a class='disabled'>«</a>"
        }
        if (c >= 2) {
            d += "<a p='1'>1</a>"
        }
        if (c >= 3) {
            d += "<a class='disabled ellipsis'>...</a>"
        }
        for (var f = c; f <= e; f++) {
            if (f > h) {
                break
            }
            if (f == m) {
                d += '<a class="disabled">' + f + "</a>"
            } else {
                d += "<a p='" + f + "'>" + f + "</a>"
            }
        }
        if (e <= h - 2) {
            d += "<a class='disabled ellipsis'>...</a><a p='" + h + "'>" + h + "</a>"
        } else {
            if (e <= h - 1) {
                d += "<a p='" + h + "'>" + h + "</a>"
            }
        }
        if (m < h) {
            d += "<a p='" + (m + 1) + "'>»</a>"
        } else {
            d += "<a class='disabled'>»</a>"
        }
        j.html(d);
        if (l) {
            j.find("a[p]").bind("click", function () {
                var i = $(this).attr("p");
                l(i)
            })
        }
    };
    $.fn.fileSize = function () {
        var g = this.get(0);
        var c = 0;
        if ($.browser.msie && !g.files) {
            var e = g.value;
            var f = new ActiveXObject("Scripting.FileSystemObject");
            var d = f.GetFile(e);
            c = d.Size
        } else {
            c = g.files[0].size
        }
        return c * 1024
    };
    $.fn.errorTip = function (e, d) {
        var g;
        var f = "error";
        if ($(".signin-error").length) {
            $(".signin-error").remove()
        }
        if (d != null) {
            f = d
        }
        var c = '<span class="signin-error"><span class="signin-' + f + '-tip">' + e + '<label class="signin-' + f + '-tip-arrow right"></label><label class="signin-' + f + '-tip-arrow right1"></label></span></span>';
        if ($(this).offset().left < 200) {
            c = '<span class="signin-error"><span class="signin-' + f + '-tip">' + e + '<label class="signin-' + f + '-tip-arrow left"></label><label class="signin-' + f + '-tip-arrow left1"></label></span></span>'
        }
        $("body").append(c);
        g = $(".signin-error");
        g.css({
            left: $(this).offset().left - g.width(),
            top: $(this).offset().top + $(this).height() / 2 - 7,
            opacity: "0",
            filter: "alpha(opacity=0)"
        });
        $(this).addClass(f);
        if ($(this).offset().left < 200) {
            g.animate({
                left: $(this).offset().left + g.width(),
                top: $(this).offset().top + $(this).height() / 2 - 7,
                opacity: "0.7",
                filter: "alpha(opacity=70)"
            }, 200)
        } else {
            g.animate({
                left: $(this).offset().left - g.width() - 14,
                top: $(this).offset().top + $(this).height() / 2 - 7,
                opacity: "0.7",
                filter: "alpha(opacity=70)"
            }, 200)
        }
    };
    $.closeErrorTip = function () {
        $(".signin-error").remove();
        $("input.error").removeClass("error")
    }
})(jQuery);
String.prototype.isEmpty = function () {
    if (this.replace(/(^\s*)|(\s*$)/g, "").length <= 0) {
        return true
    } else {
        return false
    }
};
String.prototype.notEmpty = function () {
    return !this.isEmpty()
};
String.prototype.isEmail = function () {
    if (this.isEmpty() || (!/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/.test(this))) {
        return false
    } else {
        return true
    }
};
String.prototype.isPhoneNumber = function () {
    if (this.isEmpty() || (!/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(this))) {
        return false
    } else {
        return true
    }
};
String.prototype.minLength = function (a) {
    if (this.length >= a) {
        return true
    } else {
        return false
    }
};
String.prototype.maxLength = function (a) {
    if (this.length <= a) {
        return true
    } else {
        return false
    }
};
String.prototype.cut = function (a, d) {
    var c = "";
    if (this == "") {
        return c
    }
    if (typeof d == "undefined") {
        d = "..."
    }
    var e = 0;
    for (var b = 0; b < this.length; b++) {
        if (this.charCodeAt(b) > 127 || this.charCodeAt(b) == 94) {
            e += 2
        } else {
            e++
        }
    }
    if (e <= a) {
        return this.toString()
    }
    e = 0;
    a = (a > d.length) ? a - d.length : a;
    for (var b = 0; b < this.length; b++) {
        if (this.charCodeAt(b) > 127 || this.charCodeAt(b) == 94) {
            e += 2
        } else {
            e++
        }
        if (e > a) {
            c += d;
            break
        }
        c += this.charAt(b)
    }
    return c
};
String.prototype.byteLength = function () {
    var b = 0;
    for (var a = 0; a < this.length; a++) {
        if (this.charCodeAt(a) > 127 || this.charCodeAt(a) == 94) {
            b += 2
        } else {
            b++
        }
    }
    return b
};
function initTemplateCategorySelect() {
    $("#template-category-select li").unbind().bind("click", function () {
        $(".template-category li").removeClass("current");
        $(this).addClass("current");
        var a = $(this).attr("category");
        getTemplates(a)
    });
    $(".item-container").die().live("click", function () {
        $(".template_selected").removeClass("template_selected");
        $(this).addClass("template_selected");
        $("#template_select_ok").enable()
    }).live("dblclick", function () {
        templateSelected()
    })
}
function getTemplates(a) {
    Util.get("/diagraming/gettemplates", {category: a}, function (e) {
        if (a == "my_template") {
            $(".template-select").remove()
        } else {
            $(".template-select[chartId!='']").remove();
            if ($(".template-select[chartId='']").length == 0) {
                $("#template-container").append('<div class="item-container template-select template_selected radius3" chartId=""><div></div>空模板</div>')
            }
        }
        for (var c = 0; c < e.templates.length; c++) {
            var b = e.templates[c];
            $("#template-container").append('<div define="' + b.chartId + '" class="item-container template-select radius3"><div><img src="/chart_image/thumb/' + b.thumbnail + '.png"/></div>' + b.title + "</div>")
        }
        var d = $(".template_selected");
        if (d.length <= 0) {
            $("#template_select_ok").disable()
        }
    })
}
var globalNewTeamId;
var globalNewFolderId;
function globalNewDialog(c, a, b) {
    globalNewTeamId = c;
    globalNewFolderId = a;
    if ($("#dialog_new_diagram").length == 0) {
        Util.ajax({
            url: "/diagraming/new_dialog", data: {}, success: function (d) {
                $("body").append(d);
                $("#dialog_new_diagram").dialog();
                initTemplateCategorySelect();
                $("#template_select_ok").bind("click", function () {
                    templateSelected(b)
                });
                $("#template_select_cancel").bind("click", function () {
                    $("#dialog_new_diagram").dialog("close")
                });
                getTemplates("uncategorized")
            }
        })
    } else {
        $("#dialog_new_diagram").dialog()
    }
}
function templateSelected(g) {
    var e = $(".template_selected");
    if (e.length <= 0) {
        return
    }
    var d = $("#template-category-select li.current");
    var f = d.attr("category");
    var c = e.attr("define");
    if (!c) {
        c = ""
    }
    var b = $("#privateornot").attr("val");
    $("#dialog_new_diagram").dialog("close");
    var a = "/diagraming/new?template=" + c + "&category=" + f;
    if (f == "my_template") {
        a = "/diagrams/new_from_template?chartId=" + c
    }
    if (g == "template") {
        a = "/diagraming/new?template=" + c + "&category=" + f + "&istemplate=true"
    }
    if (globalNewTeamId) {
        a += "&team=" + globalNewTeamId
    }
    if (globalNewFolderId) {
        a += "&folder=" + globalNewFolderId
    }
    if (b == "true") {
        a += "&status=public"
    } else {
        a += "&status=private"
    }
    window.location.href = a
};