document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        setTimeout(function () {
            $('#loading').fadeOut(500);

            setTimeout(function(){
                $('#mouse').fadeIn(500);
            },2000);
            setTimeout(function(){
                $('#mouse').fadeOut(500);
            },5000);
        }, 0);
    }
}
$(function () {
    $('#operate').append("<div style='background-color: rgba(0,0,0,.5);width:200px;height:50px;text-align: center;line-height: 50px;font-size: 1rem;position: fixed;z-index: 998;color: white'>制作人：王宁</div>");
    var imgSource = $('body').find('img');
    var imgReadyNum = 0;

    imgSource.each(function () {
        $(this).on('load', function () {
            if (this.complete) {
                var html = Math.floor(++imgReadyNum / imgSource.length * 100) + '%';
                $('.progress').html(html);
            }
        });
    })

    //鼠标滚动次数
    var mouseNum = 0;
    //获取可视窗口大小
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    //获取展示单元side的数量
    var sideNum = $('div[class*=side-]').length;
    //floor最大层数，根据页面上的层数来设置
    const floorMax = 8;
    //每一层偏移的目标距离
    var offsetx = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    //滚轮滚动一次移动的距离
    var step = windowWidth / 10;
    //每一层移动的速度
    var speed = [0.1, 1, 0.4, 1.1, 1.6, 3.4, 3.8, 4.8, 5.8];
    //初始化样式

    $('.pre').fadeOut(20);

    //可视窗口大小改变时设置样式
    $(window).resize(function () {
        //函数节流，防止大量快速调用导致的性能问题
        // clearTimeout(window.timer);
        // window.timer = setTimeout(function(){},100);
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        step = windowWidth / 10;
        offsetx = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        mouseNum = 0;
        $('#container').css({ width: windowWidth, height: windowHeight });
        $('#container .side').css({ width: windowWidth, height: windowHeight });

        if (windowWidth <= 1200) {
            $('html').css('fontSize', windowWidth / 100+'px');
        } else {
            $('html').css('fontSize', '12px');
        }

        for (var i = 0; i < $('#container').children('div').length; i++) {
            var $curSide = $('.side-' + i);
            for (var j = 1; j <= $curSide.children('div').length; j++) {
                $curSide.find('div').eq(j).css('transform', 'translateX(' + i * 10 * speed[j + 1] * step + 'px)');
            }
        }

    });
    $(window).resize();

    $(window).mousewheel(function (event) {
        //边缘判断
        if ((mouseNum >= 0 && event.deltaY > 0) || (mouseNum <= -(sideNum - 1) * 10 && event.deltaY < 0)) return;
        mouseNum += event.deltaY;
        if (mouseNum % 10 == 0) {
            mouseNum == 0 ? $('.pre').fadeOut(500) : $('.pre').fadeIn(500);
            mouseNum == -(sideNum - 1) * 10 ? $('.next').fadeOut(500) : $('.next').fadeIn(500);

        } else {
            $('.pre').fadeOut(500);
            $('.next').fadeOut(500);
        }
        for (var i = 0; i < floorMax + 1; i++) {
            offsetx[i] += event.deltaY * speed[i] * step;
            $(".floor-" + i).stop().animate({ 'left': offsetx[i] + 'px' }, 2500, 'easeOutExpo', function () { });
        }
    });

    $('.pre').click(function () {
        if (mouseNum == 0) return;
        mouseNum += 10;
        $('.pre').fadeIn(500);
        $('.next').fadeIn(500);
        if (mouseNum == 0) $('.pre').fadeOut(500);
        for (var i = 0; i < floorMax + 1; i++) {
            offsetx[i] += speed[i] * step * 10;
            $(".floor-" + i).stop().animate({ 'left': offsetx[i] + 'px' }, 2500, 'easeOutExpo', function () { });
        }
    })
    $('.next').click(function () {
        if (mouseNum == -(sideNum - 1) * 10) return;
        mouseNum -= 10;
        $('.pre').fadeIn(500);
        $('.next').fadeIn(500);
        if (mouseNum == -(sideNum - 1) * 10) $('.next').fadeOut(500);
        for (var i = 0; i < floorMax + 1; i++) {
            offsetx[i] += -speed[i] * step * 10;
            $(".floor-" + i).stop().animate({ 'left': offsetx[i] + 'px' }, 2500, 'easeOutExpo', function () { });
        }
    })
})