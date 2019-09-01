$(function () {
    //随机生成rgb颜色
    var randomRGB = function () {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }
    //设置旋转半径
    var r = 100;
    $rotateItems = $('.rotateItem')
    //旋转单位角度
    var identityDeg = 360 / $rotateItems.length;

    //页面样式初始化
    var initStyle = function () {
        //初始化items样式
        var itemsTop = ($('#disc').innerHeight() - $rotateItems.outerHeight()) / 2;
        var itemsLeft = ($('#disc').innerWidth() - $rotateItems.outerWidth()) / 2;
        $rotateItems.each(function (idx) {
            //缩放比例
            var scale = idx<= $rotateItems.length/2?(1 - idx/100):1;
            console.log(identityDeg * idx);
            $(this).css({
                'backgroundColor': randomRGB(),
                // 处理中间最大，两边越来越小的思路
                // 得出当前圆盘移动角度
                // 根据每一个item与该角度差值不同，且两边绝对值对称相等的特性来计算缩放比例
                // 'transform': 'rotate(' + identityDeg * idx + 'deg) translate3d(' + 0 + 'px,' + r + 'px,' + Math.abs(identityDeg * idx-curDiscDeg)/10 + 'px) scale('+Math.abs(identityDeg * idx-curDiscDeg)/180+')',
                'transform': 'rotate(' + identityDeg * idx + 'deg) translate3d(' + 0 + 'px,' + r + 'px,' + Math.abs(identityDeg * idx*1.4-curDiscDeg) + 'px)',
                'top': itemsTop + 'px',
                'left': itemsLeft + 'px',
                // 'z-index': Math.abs(identityDeg * idx-curDiscDeg)
            });
        });
    }

    //当前圆盘旋转角度
    var curDiscDeg = 180;
    $('#btn').click(function () {
        curDiscDeg -= identityDeg;
        console.log(curDiscDeg);
        $('#disc').css('transform', 'rotate(' + curDiscDeg + 'deg)');
    })



    initStyle();
})