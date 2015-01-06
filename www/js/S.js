var S={};
var _for = function(o){
    if ((typeof o) === 'object'){

    }
    return {
        each:function(){},
        map:function(){},
        grep:function(){}
    }
};

S.setCookie = function (b, c, a) {
    var d = new Date();
    d.setDate(d.getDate() + a);
    document.cookie = b + "=" + escape(c) + ((a == null) ? "" : ";expires=" + d.toGMTString())
};
S.getCookies = function (b) {
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
(function($){
    if($ == undefined){
        throw new Error('Please load jquery');
    };
    $.fn.clear = function () {
        $(this).find("input[type=text]").val("");
        $(this).find("input[type=password]").val("");
        $(this).find("textarea").val("");
        $(this).find("select").val("")
    };
})($);
