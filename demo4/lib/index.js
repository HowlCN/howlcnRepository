$(function () {

    //实现思想  数据驱动页面
    //所有页面元素根据一个对象数组去渲染
    //改变数组对象 页面随之改变
    var $items = $('.rain-man > div');
    var itemsLenght = $items.length;
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var rainManArr = [];
    for (let i = 0; i < itemsLenght; i++) {
        rainManArr[i] = {
            top: 0,
            left: 0,
            x: 0,
            y: 0,
            z: 0,
            r: 0,
            zIndex: $items.eq(i).data('z')
        }
    }

    //每一层的移动速度
    var speedX = [];
    for (let i = 0; i < 8; i++) {
        speedX[i] = 0
    }
    var rotate = 0;

    //随机对象数组的定位信息
    var randomPosition = function (t, l) {
        rainManArr.forEach(function (item) {
            item.top = randomNum(-windowHeight * 2.5, -333);
            item.left = randomNum(-300, windowWidth + 300);
        })
    }

    //更新对象数组的偏移信息
    var updateTransition = function (dx, dy, dz, dr) {
        rainManArr.forEach(function (item) {
            item.x += dx;
            item.y += dy;
            item.z += dz;
            item.r = dr;
        })
    }

    //渲染Position
    var randerPosition = function () {
        rainManArr.forEach(function (item, idx) {
            $items.eq(idx).css({
                top: item.top + 'px',
                left: item.left + 'px',
            })
        })
    }

    //渲染Transform
    var randerTransform = function () {
        rainManArr.forEach(function (item, idx) {
            $items.eq(idx).css({
                transform: 'translate3d(' + item.x * item.zIndex / 5 + 'px,' + item.y * item.zIndex / 5 + 'px,' + item.z + 'px) rotateZ(' + item.r + 'deg)'
            })
        })
    }

    //生成随机数
    var randomNum = function (min, max) {
        return Math.random() * (max - min) + min;
    }


    //速度递减函数  传入递减速度
    var subSpeed = function (arr, v, md) {
        window.timerSpeed = 0;
        if (md > 0) {
            window.timerSpeed = setInterval(function () {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i] > 0 ? arr[i] - v : 0;
                }
                if (speedX.every(v => v == 0))
                    clearInterval(window.timerSpeed);
            }, 15);
        } else {
            window.timerSpeed = setInterval(function () {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i] < 0 ? arr[i] + v : 0;
                }
                if (speedX.every(v => v == 0))
                    clearInterval(window.timerSpeed);
            }, 15);
        }
    }

    //角度递减函数  传入递减速率
    var subRotate = function (v, md) {
        timerRotate = 0;
        if (md > 0) {
            timerRotate = setInterval(function () {
                rotate += v;
                if (rotate >= 0) {
                    rotate = 0;
                    clearInterval(timerRotate);
                }
            }, 15);
        } else {
            timerRotate = setInterval(function () {
                rotate -= v;
                if (rotate <= 0) {
                    rotate = 0;
                    clearInterval(timerRotate);
                }
            }, 15);
        }
    }

    //判断是否为pc端
    var IsPC = function () {
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

    var mobileFun = function () {
        var moveDirection = 0;
        var startX = 0;
        var directionX = 0;
        document.ontouchstart = function (e) {
            clearInterval(window.timerSpeed);
            clearInterval(window.timerRotate);
            moveDirection = 0;
            startX = e.changedTouches[0].clientX;
        }
        document.ontouchmove = function (e) {
            directionX = e.changedTouches[0].clientX - startX;
            moveDirection = directionX > 0 ? 1 : -1;
            speedX[0] = directionX / 50;
            rotate = -directionX / 10;
        }
        document.ontouchend = function () {
            //手机端结束移动
            subSpeed(speedX, 0.01, moveDirection);
            subRotate(0.12, moveDirection)
        }
    }

    var pcFun = function () {
        //鼠标移动方向
        var moveDirection = 0;

        document.onmousedown = function (e) {
            //pc端鼠标按下
            clearInterval(window.timerSpeed);
            clearInterval(window.timerRotate);
            var startX = e.clientX;
            document.onmousemove = function (e) {
                directionX = e.clientX - startX;
                moveDirection = directionX > 0 ? 1 : -1;
                speedX[0] = directionX / 200;
                rotate = -directionX / 50;
            }
        }
        document.onmouseup = function () {
            subSpeed(speedX, 0.01, moveDirection);
            subRotate(0.12, moveDirection)
            document.onmousemove = function () { }
        }
    }

    //判断当前设备，执行相应代码
    IsPC() ? pcFun() : mobileFun();

    var init = function () {
        randomPosition();
        randerPosition();
        var press = document.getElementById('press');
        setTimeout(function(){
            press.style.display = 'block';
        },2000);

        setTimeout(function(){
            press.style.transition = 'all 1.5s linear';
            press.style.transform = 'translate(-200px,0px)';
        },3000);

        setTimeout(function(){
            press.style.display = 'none';
        },5000);
    }();

    var move = function () {
        setInterval(function () {
            updateTransition(speedX[0], 2, 0, rotate);
            randerTransform();
        }, 15)
        setInterval(function () {
            rainManArr.forEach(function (item, idx) {
                if ($items.eq(idx).offset().top > windowHeight) {
                    randomPosition();
                    item.x = 0;
                    item.y = 0;
                    item.z = 0;
                    item.r = 0;
                }
            })
        }, 3000);
    }();
})