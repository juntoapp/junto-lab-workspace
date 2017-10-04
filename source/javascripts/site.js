// This is where it all goes :)



﻿
var initLoadingScreen = function() {
    $('form').on('submit', function() {
        $('.loading').show();
        return;
    });
};


var parseName = function() {
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };


    var name = getUrlParameter('name');
    $('#name').text(name);
    $('#nameForm').val(name);
    return name;
};


var application = function() {
    var self = {};

    self.data = {};

    self.click = function(event) {
        var area = self.getArea(event.offsetX, event.offsetY);
        console.log(area);
        if (area === false) {
            self.showAreas();
        } else {
            if (area.url !== undefined) {
                $('.loading').show();
                location.href = area.url;
            }
        }
    };


    self.showAreas = function() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var areas = self.data.areas;

        function draw(ctx, areas) {
            for (var i = 0; i < areas.length; i++) {
                var a = areas[i];
                ctx.beginPath();
                ctx.lineWidth = "4";
                ctx.strokeStyle = "green";
                ctx.rect(a.x, a.y, a.w, a.h);
                ctx.stroke();
            }
        }

        (function() {
            var alpha = 0,
                delta = 0.1,
                loopBreak = false;

            function loop() {
                /// increase alpha with delta value
                alpha += delta;
                //// if delta <=0 or >=1 then reverse
                if (alpha <= 0 || alpha >= 1) {
                    delta = -delta;
                    loopBreak = true;
                }
                /// clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                /// set global alpha
                ctx.globalAlpha = alpha;
                draw(ctx, areas);

                if (loopBreak === true && alpha <= 0) {
                    return;
                }
                requestAnimationFrame(loop);
            }
            loop();
        })();
    };

    self.draw = function() {
        var chgBg = function(file) {
            $(".canvas").css("background", "urL('" + file + "')");
            $(".canvas").css("background-size", "cover");
            $(".canvas").css("background-repeat", "no-repeat");
        };
        console.log('state:', self.data);
        chgBg(self.data.picture);
    };

    self.getArea = function(x, y) {
        console.log(x, y);
        var areas = self.data.areas;
        for (var i = 0; i < areas.length; i++) {
            var a = areas[i];
            if ((a.x <= x && x <= a.x + a.w) && (a.y <= y && y <= a.y + a.h)) {
                return a;
            }
        }
        return false;
    };


    self.init = function(pdata) {
        self.data = pdata;
        self.draw();
        $(".canvas").click(self.click);

        // self.preload();


        window.requestAnimationFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    };

    return self;
};
