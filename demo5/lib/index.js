; (function () {
    var canvas = document.getElementById('canvas');
    var mode = document.getElementById('mode');
    var grass = document.getElementById('grass');
    var body = document.getElementsByTagName('body')[0];

    canvas.width = document.getElementsByTagName('body')[0].offsetWidth;
    canvas.height = document.getElementsByTagName('body')[0].offsetHeight;
    canvas.style.backgroundColor = '#fff';

    var clientW = document.documentElement.clientWidth;
    var clientH = document.documentElement.clientHeight;
    //获取canvas上下文
    window.ctx = canvas.getContext('2d');

    var curmode = 'light';
    mode.onclick = function (e) {
        curmode = curmode == 'light' ? 'dark' : 'light';
        if (curmode == 'dark') {
            //清除画布 
            window.ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.backgroundColor = '#000';
            mode.style.backgroundPositionY = '-90px';
            grass.style.backgroundPositionY = '-90px';
            window.color = '#fff';
            window.branches = [];
            var t = new Tree(new Vector(clientW / 2, clientH), 8, curmode, window.randomRgba());
            t.render();
        } else {
            window.ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.backgroundColor = '#fff';
            mode.style.backgroundPositionY = '0px';
            grass.style.backgroundPositionY = '0px';
            window.color = '#000';
            window.branches = [];
            var t = new Tree(new Vector(clientW / 2, clientH), 8, curmode, window.randomRgba());
            t.render();
        }
        window.stopBubble(e);
    }

    body.onclick = function (e) {
        if (window.preTreeOk) {
            var t = new Tree(new Vector(e.clientX, clientH), 8, curmode, window.randomRgba());
            t.render();
        }
    }

    ///////////////
    //全局工具
    window.preTreeOk = true;

    window.random = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    //亮色随机方案
    //  rgb至少有一个255
    //  其他两位相加不能超过255
    window.randomRgba = function () {
        var c1 = Math.round(window.random(0, 255));
        var c2 = Math.round(window.random(0, 255 - c1));
        var rgb = [255, c1, c2];
        var i = Math.round(window.random(0, 2));
        var r = rgb[i]; rgb.splice(i, 1);
        i = Math.round(window.random(0, 1));
        var g = rgb[i]; rgb.splice(i, 1);
        var b = rgb[0];
        return {
            r: r,
            g: g,
            b: b,
            a: 1
        }
    }
    //阻止事件冒泡
    window.stopBubble = function (e) {
        if (e && e.stopPropagation) {//非IE
            e.stopPropagation();
        }
        else {//IE
            window.event.cancelBubble = true;
        }
    }
    //全局工具
    ///////////////


    //点对象
    var Vector = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector.prototype = {
        add: function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },
        //两点之间的距离
        length: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        rotate: function (theta) {
            this.x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
            this.y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
            return this;
        }
    };

    //树枝对象
    var Branch = function (preDot, v, r, m, t, g, pl, trgba) {
        //当前要画的点的坐标
        this.preDot = preDot || null;
        //x轴 y轴的移动速度
        this.v = v || null;
        //当前点的半径
        this.r = r || 0;
        //当前树枝已画的长度
        this.length = 0;
        //当前枝条的目标长度
        this.targetLength = window.random(pl * 2 / 3, pl);
        //当前树枝的代数
        this.generation = g || 8;
        //树枝偏移方向
        this.theta = t || 0;
        //树枝分叉位置
        this.forkPos = [];
        //当前树的末梢颜色（树颜色渐变的目标色）
        this.targetRgba = trgba || null;
        //颜色模式
        this.mode = m || 'light';

        //若是明亮模式则书的颜色始终为黑色， 黑暗模式下树初始色为白色，随树的生长变色
        this.color = m == 'light' ? 'rgba(0,0,0,1.0)' : this.changeRgba();

        this.register();

    };




    var m = 0;
    Branch.prototype = {

        register: function () {
            //确定生长方向
            this.v.rotate(this.theta);
            //确定树枝分叉位置
            this.forkPosInit();
            Tree.addBranch(this);
        },

        //绘制一个点
        draw: function () {
            window.ctx.beginPath();
            window.ctx.fillStyle = this.color;
            window.ctx.moveTo(this.preDot.x, this.preDot.y);
            window.ctx.arc(this.preDot.x, this.preDot.y, this.r, 0, Math.PI * 360 / 180, true);
            window.ctx.fill();
        },

        update: function () {
            this.preDot.add(this.v);
            this.length += this.v.length();
            if (this.length > this.targetLength) {

                Tree.removeBranch(this);
                // this.fork(this, window.random(-0.1, 0.1));
                return;
            }
            //当树枝的生长周期结束 在window.branches中清除该树枝对象
            if (this.length > this.targetLength * 7 / 8 && this.forkPos[2].isfork) {
                this.forkPos[2].isfork = false;
                this.fork(this, this.forkPos[2].forkd);
            }
            if (this.length > this.targetLength * 3 / 4 && this.forkPos[1].isfork) {
                this.forkPos[1].isfork = false;
                this.fork(this, this.forkPos[1].forkd);
            }
            if (this.length > this.targetLength * 1 / 2 && this.forkPos[0].isfork) {
                this.forkPos[0].isfork = false;
                this.fork(this, this.forkPos[0].forkd);
            }

        },

        //增加一个分叉  设定角度
        fork: function (b, theta) {
            if (this.r < 0.5) {
                // console.log('结束');
                return;
            };
            var r = new Branch(new Vector(b.preDot.x, b.preDot.y), new Vector(b.v.x, b.v.y), b.r * 0.7, b.mode, theta, b.generation + 1, b.targetLength, b.targetRgba);
        },

        //初始化树枝分叉位置，以及分叉方向
        //在 1/2 处，3/4处，8/7处是否分叉
        forkPosInit: function () {
            //概率设定
            // 1/2 
            var a = 0.9;
            // 3/4
            var b = 0.9;
            // 8/1
            var c = 0.4;

            var random = Math.random();
            this.forkPos[0] = {
                isfork: Math.random() > a ? false : true,
                forkd: Math.random() > 0.8 ? -0.5 : 0.5
            }
            this.forkPos[1] = {
                isfork: Math.random() > b ? false : true,
                forkd: Math.random() > 0.9 ? 0.3 : -0.3
            }
            this.forkPos[2] = {
                isfork: Math.random() > c ? false : true,
                forkd: Math.random() > 0.8 ? -0.2 : 0.2
            }
        },

        //根据代数改变树枝颜色
        changeRgba: function () {

            var r = 255 - (255 - this.targetRgba.r) / 8 * this.generation;
            var g = 255 - (255 - this.targetRgba.g) / 8 * this.generation;
            var b = 255 - (255 - this.targetRgba.b) / 8 * this.generation;
            var a = 1 - this.generation / 10;
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        },


        grow: function () {
            this.draw();
            this.update();
        }
    }

    var Tree = function (x, r, m, rgba) {
        //树根半径
        this.rootR = r || 8;
        //树根起始点
        this.rootP = x || new Vector(clientW / 2, clientH);
        //light模式 或者 dack 模式
        this.treeMode = m || 'light';
        //黑暗模式下树末梢的rgba
        this.targetRgba = rgba || { r: 255, g: 255, b: 255, a: 1 };
        window.branches = [];
        window.timer = 0;

        //遍历数组中的树枝对象，进行渲染
        this.render = function () {
            window.preTreeOk = false;
            var that = this;
            window.timer = setInterval(function () {
                if (window.branches.length > 0) {
                    for (var i = 0; i < window.branches.length; i++) {
                        window.branches[i].grow();
                    }
                }
                else {
                    window.preTreeOk = true;
                    clearInterval(timer);
                }
            }, 30);

        };
        this.init();
    }

    Tree.prototype = {
        init: function () {//(preDot, v, r, m, t, g, pl, trgba)
            var b = new Branch(this.rootP, new Vector(0, -2.5), this.rootR, this.treeMode, 0, 1, 200, this.targetRgba)
        }
    }


    Tree.addBranch = function (b) {
        window.branches.push(b)
    }

    Tree.removeBranch = function (b) {
        for (var i = 0; i < window.branches.length; i++) {
            if (window.branches[i] === b) {
                window.branches.splice(i, 1);
                return;
            }
        }
    };

    var t = new Tree(new Vector(clientW / 2, clientH), 8, 'light', window.randomRgba());
    t.render();
}())