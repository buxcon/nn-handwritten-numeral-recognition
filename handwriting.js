var canvasWidth = Math.min(400, $(window).width() - 20);
var canvasHeight = canvasWidth;

var isMouseDown = false;
var lastLoc = {x: 0, y: 0};
var lastTimeStamp = 0;
var lastLineWidth = -1;
var strokeColor = "black";
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css("width", canvasWidth + "px");
drawGrid();

function ret(obj) {
    $("#loading").css("display", "none");
    $("#result_holder").css("display", "block");
    $("#result").text(obj.responseText);
}

$("#clear_btn").click(
    function () {
        $(".tips").css("display", "none");
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrid();
    }
);

$("#send_btn").click(
    function () {
        $("#loading").css("display", "block");

        var imgData = canvas.toDataURL("image/png");
        rec = $.ajax({
            type: "post",
            url: "rec.php",
            data: {image: imgData},
            async: true,
            success: function() {
                ret(rec);
            },
            error: function() {
                $("#loading").css("display", "none");
                alert("error");
            }
        });
    }
);

function beginStroke(point) {
    isMouseDown = true;
    var loc = windowToCanvas(point.x, point.y);
    lastLoc = loc;
    lastTimeStamp = new Date().getTime();
}

function endStroke() {
    isMouseDown = false;
}

function moveStroke(point) {
    var curLoc = windowToCanvas(point.x, point.y);
    var curTimeStamp = new Date().getTime();
    var s = calcDistance(curLoc, lastLoc);
    var t = curTimeStamp - lastTimeStamp;
    var lineWidth = calcLineWidth(t, s);

    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);

    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.linejoin = "round";
    context.stroke();

    lastLoc = curLoc;
    lastTimeStamp = curTimeStamp;
    lastLineWidth = lineWidth;
}

canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x: e.clientX, y: e.clientY});
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if (isMouseDown) {
        moveStroke({x: e.clientX, y: e.clientY});
    }
};

var touch;
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x: touch.pageX, y: touch.pageY});
});
canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (isMouseDown) {
        touch = e.touches[0];
        moveStroke({x: touch.pageX, y: touch.pageY});
    }
});
canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
    endStroke();
});

function calcLineWidth(t, s) {
    var v = s / t;

    var resultLineWidth;
    if (v <= 0.1) {
        resultLineWidth = 20;
    } else if (v >= 10) {
        resultLineWidth = 1;
    } else {
        resultLineWidth = 30 - (v - 0.1) / (10 - 0.1) * (30 - 1);
    }
    if (lastLineWidth = -1) {
        return resultLineWidth;
    }
    return lastLineWidth * 2 / 3 + resultLineWidth * 1 / 3;
}

function calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));//x轴距离的平方与上y轴距离的平方的和再开根号;
}

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)};
}

function drawGrid() {
    context.save();
    context.fillStyle="rgb(255,255,255)";
    context.fillRect(0,0,canvasWidth,canvasHeight);
    context.restore();
}