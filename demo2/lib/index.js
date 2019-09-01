$(function () {

    var x = 50;
    $('[class^=item-]').each(function (idx) {
        x -= 50;
        $(this).css({
            transform: 'rotateY(' + idx * 15 + 'deg) translate3d(' + 0 + 'px,' + -542 + 'px,' + 187 + 'px)',
            background: 'url(./lib/soupmat.jpg) no-repeat ' + x + 'px 0px'
        })
    });

    //判断是否为pc端
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }


    var soupPosition = document.getElementById('soup-position');
    var soup = document.getElementById('soup');

    var mobileFun = function () {
        var curZ = 0;
        var curY = 0;
        var curX = -30;
        var startX = 0;
        var startY = 0;
        //鼠标X移动方向
        var directionX = 0;
        //鼠标Y移动方向
        var directionY = 0;
        var tempX = 0;
        var tempY = 0;
        document.ontouchstart = function (e) {
            //pc端鼠标按下
            startX = e.changedTouches[0].clientX;
            startY = e.changedTouches[0].clientY;
            //鼠标X移动方向
            directionX = 0;
            //鼠标Y移动方向
            directionY = 0;
            tempX = 0;
            tempY = 0;
            soup.style.webkitAnimationPlayState = "paused";
        }
        document.ontouchmove = function (e) {
            directionX = e.changedTouches[0].clientX == tempX ? 0 : (e.changedTouches[0].clientX > tempX ? 1 : -1);
            directionY = e.changedTouches[0].clientY == tempY ? 0 : (e.changedTouches[0].clientY > tempY ? 1 : -1);
            tempX = e.changedTouches[0].clientX;
            tempY = e.changedTouches[0].clientY;
            curY += directionX;
            curZ += directionY;
            curX += directionY;
            soupPosition.style.transform = 'rotateX(' + curX + 'deg) rotateZ(' + -curZ + 'deg)';
            soup.style.transform = 'rotate3d(0, 1, 0, ' + curY + 'deg)';
        }
        document.ontouchend = function () {
            soup.style.webkitAnimationPlayState = "running";
        }
    }
    var pcFun = function () {
        var curZ = 0;
        var curY = 0;
        var curX = -30;
        document.onmousedown = function (e) {
            //pc端鼠标按下
            var startX = e.clientX;
            var startY = e.clientY;
            //鼠标X移动方向
            var directionX = 1;
            //鼠标Y移动方向
            var directionY = 1;
            var tempX = 0;
            var tempY = 0;
            //////////////////////////////
            // 实时判断鼠标移动方向的解决思路
            // 1、声明一个变量 temp 用于存储上一次 移动事件触发时鼠标的位置
            // 2、每次mousemove触发时，将所存储的变量与当前触发时鼠标的位置作比较：
            //         若大于：更新方向变量direction为1
            //         若小于：更新方向变量direction为-1
            //         若等于：更新方向变量direction为0
            // 3、将当前鼠标位置更新到temp
            // 4、执行第2步
            //////////////////////////////

            soup.style.webkitAnimationPlayState = "paused";
            document.onmousemove = function (e) {
                directionX = e.clientX == tempX ? 0 : (e.clientX > tempX ? 1 : -1);
                directionY = e.clientY == tempY ? 0 : (e.clientY > tempY ? 1 : -1);
                tempX = e.clientX;
                tempY = e.clientY;
                curY += directionX;
                curZ += directionY;
                curX += directionY;
                soupPosition.style.transform = 'rotateX(' + curX + 'deg) rotateZ(' + -curZ + 'deg)';
                soup.style.transform = 'rotate3d(0, 1, 0, ' + curY + 'deg)';
            }

        }
        document.onmouseup = function () {
            //pc端鼠标弹起
            document.onmousemove = function () { }
            soup.style.webkitAnimationPlayState = "running";
        }
    }
    //判断当前设备，执行相应代码
    IsPC() ? pcFun() : mobileFun();
});