/**
 * 颜色取色器

(function($){
    function fun(selector){
        //初始化界面
        this.init();
        //初始化左侧选择竖颜色条
        this.colorBar();
        //初始选择颜色面板
        this.colorBox();
        //绑定事件
        this.bind();
        //将控件追加到某个位置
        this.toAppend(selector);
        //重置尺寸
        this.resize();
    }
    fun.prototype={
        constructor:fun,
        //主面板
        wrapper:null,
        //父级面板
        content:null,
        //颜色选择器面板
        canvas:null,
        //颜色绘画面板
        drawing:null,
        //信息主体面板
        reveal:null,
        //目前没用/
        target:null,
        //R面板
        r:null,
        //G面板
        g:null,
        //B面板
        b:null,
        //16进制颜色面板
        h:null,
        //RGB~颜色
        reg:null,
        //16进制颜色
        hex:null,
        //点击事件
        click:null,
        //颜色选中事件
        select:null,
        init:function(){
            var that=this;

            this.canvas=$("<canvas>").attr("width","286").attr("height","256");
            this.drawing=this.canvas[0].getContext('2d');
            this.r=$("<input value='0'>");
            this.g=$("<input value='0'>");
            this.b=$("<input value='0'>");
            this.h=$("<input value='#000000'>");

            var btn= $("<input type='button' value='确定' >").css("margin-left","20px").css("margin-top","14px").css("width","60px").css("border-radius","4px")
                .css("border","1px solid #ccc").css("height","30px").on("click",function(){
                    if(that.click && typeof that.click==="function"){
                        that.click.call(that,that.hex,"rgb("+that.r+","+that.g+","+that.b+")");
                    }
                }
            )
            
            this.wrapper=$(`
                <div></div>
            `)

        },
        resize:function(){
            
        },
        setTarget:function(e){
            this.target=e;
        },
        toAppend:function(selector){
            this.content=$(selector).append(this.wrapper);
        },
        hideButton:function(){
            this.wrapper.find("input[type='button']").hide();
        },
        showButton:function(){
            this.wrapper.find("input[type='button']").hide();
        },
        show:function(b){
            if(b){
                this.content.show();
            }
            this.wrapper.show();
        },
        hide:function(b){
            if(b){
                this.content.hide();
            }
            this.wrapper.hide();
        },
        colorBar:function(){
            var gradientBar = this.drawing.createLinearGradient(0, 0, 0, 256);
            gradientBar.addColorStop(0, '#f00');
            gradientBar.addColorStop(1 / 6, '#f0f');
            gradientBar.addColorStop(2 / 6, '#00f');
            gradientBar.addColorStop(3 / 6, '#0ff');
            gradientBar.addColorStop(4 / 6, '#0f0');
            gradientBar.addColorStop(5 / 6, '#ff0');
            gradientBar.addColorStop(1, '#f00');

            this.drawing.fillStyle = gradientBar;
            this.drawing.fillRect(0, 0, 20, 256);
        },
        colorBox:function(color){
            color=color||'rgba(255,0,0,1)';
            // 底色填充，也就是（举例红色）到白色
            var gradientBase = this.drawing.createLinearGradient(30, 0, 256 + 30, 0);
            gradientBase.addColorStop(1, color);
            gradientBase.addColorStop(0, 'rgba(255,255,255,1)');
            this.drawing.fillStyle = gradientBase;
            this.drawing.fillRect(30, 0, 256,256);
            // 第二次填充，黑色到透明
            var my_gradient1 = this.drawing.createLinearGradient(0, 0, 0, 256);
            my_gradient1.addColorStop(0, 'rgba(0,0,0,0)');
            my_gradient1.addColorStop(1, 'rgba(0,0,0,1)');
            this.drawing.fillStyle = my_gradient1;
            this.drawing.fillRect(30, 0, 256,256);
        },
        rgb2hex:function(rgb){
            var aRgb = rgb instanceof Array ? rgb : (rgb.split(',') || [0, 0, 0]);
            var temp;
            return "#"+[
                (temp = Number(aRgb[0]).toString(16)).length == 1 ? ('0' + temp) : temp,
                (temp = Number(aRgb[1]).toString(16)).length == 1 ? ('0' + temp) : temp,
                (temp = Number(aRgb[2]).toString(16)).length == 1 ? ('0' + temp) : temp,
            ].join('');
        },
        hex2rgb:function(hex){
            if(hex.length == 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            return [
                parseInt(hex[0] + hex[1], 16),
                parseInt(hex[2] + hex[3], 16),
                parseInt(hex[4] + hex[5], 16)
            ].join();
        },
        getRgbaAtPoint:function(pos, area) {
            if(area == 'bar') {
                var imgData = this.drawing.getImageData(0, 0, 20, 256);
            } else {
                var imgData = this.drawing.getImageData(0, 0, this.canvas[0].width, this.canvas[0].height);
            }

            var data = imgData.data;
            var dataIndex = (pos.y * imgData.width + pos.x) * 4;
            return [
                data[dataIndex],
                data[dataIndex + 1],
                data[dataIndex + 2],
                (data[dataIndex + 3] / 255).toFixed(2),
            ];
        },
        outColor:function(rgb){
            this.reg="rgb("+rgb.split(",")[0]+","+rgb.split(",")[1]+","+rgb.split(",")[2]+")";
            this.hex=this.rgb2hex(rgb);
            this.h.val(this.hex);
            this.reveal.css("background-color",this.hex);
            this.r.val(rgb.split(",")[0]);
            this.g.val(rgb.split(",")[1]);
            this.b.val(rgb.split(",")[2]);
            if(this.select && typeof this.select==="function"){
                this.select(this.hex,"rgb("+rgb+")");
            }
        },
        bind:function(){
            var that=this;
            var click=false;
            this.canvas.on('click',function(e) {
                
                var ePos = {
                    x: e.offsetX || e.layerX,
                    y: e.offsetY || e.layerY
                }
                
                var rgbaStr = '#000';
                if(ePos.x >= 0 && ePos.x < 20 && ePos.y >= 0 && ePos.y < 256) {
                    // in
                    rgbaStr = that.getRgbaAtPoint(ePos, 'bar');
                    that.colorBox('rgba(' + rgbaStr + ')');
                } else if(ePos.x >= 30 && ePos.x < 30 + 256 && ePos.y >= 0 && ePos.y < 256) {
                    rgbaStr = that.getRgbaAtPoint(ePos, 'box');
                } else {
                    return;
                }
                that.outColor(rgbaStr.slice(0, 3).join());
            }).on("mousedown",function(){
                click=true;
            }).on("mousemove",function(e) {
                if(click){
                    var ePos = {
                        x: e.offsetX || e.layerX,
                        y: e.offsetY || e.layerY
                    }
                    var rgbaStr = '#000';
                    if(ePos.x >= 0 && ePos.x < 20 && ePos.y >= 0 && ePos.y < 256) {
                        // in
                        rgbaStr = that.getRgbaAtPoint(ePos, 'bar');
                        that.colorBox('rgba(' + rgbaStr + ')');
                    } else if(ePos.x >= 30 && ePos.x < 30 + 256 && ePos.y >= 0 && ePos.y < 256) {
                        rgbaStr = that.getRgbaAtPoint(ePos, 'box');
                    } else {
                        return;
                    }
                    that.outColor(rgbaStr.slice(0, 3).join());
                }
            }).on("mouseup",function(){
                click=false;
            });

            this.r.on("input",function(){
                this.value=parseInt(this.value);
                if(this.value>255){
                    this.value=255;
                }else if(this.value<0){
                    this.value=0;
                }
                that.outColor(that.r.val()+","+that.g.val()+","+that.b.val());
                that.colorBox("rgba("+that.r.val()+","+that.g.val()+","+that.b.val()+",1.0)");
            });
            this.g.on("input",function(){
                this.value=parseInt(this.value);
                if(this.value>255){
                    this.value=255;
                }else if(this.value<0){
                    this.value=0;
                }
                that.outColor(that.r.val()+","+that.g.val()+","+that.b.val());
                that.colorBox("rgba("+that.r.val()+","+that.g.val()+","+that.b.val()+",1.0)");
            });
            this.b.on("input",function(){
                this.value=parseInt(this.value);
                if(this.value>255){
                    this.value=255;
                }else if(this.value<0){
                    this.value=0;
                }
                that.outColor(that.r.val()+","+that.g.val()+","+that.b.val());
                that.colorBox("rgba("+that.r.val()+","+that.g.val()+","+that.b.val()+",1.0)");
            });
            this.h.on("input",function(){
                var rgb= fun.hexToRgb(this.value);
                rgb=rgb.substring(4,rgb.length-1);
                that.outColor(rgb);
                that.colorBox("rgba("+that.r.val()+","+that.g.val()+","+that.b.val()+",1.0)");
            });
        }
    }
    fun.randomHexColorSimple=function(){
        var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
        while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
            hex = '0' + hex;
        }
        return '#' + hex; //返回‘#’开头16进制颜色
    }
    fun.randomHexColor=function(){
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
    }
    fun.randomRgbColor=function(){
        var r = Math.floor(Math.random() * 256); //随机生成256以内r值
        var g = Math.floor(Math.random() * 256); //随机生成256以内g值
        var b = Math.floor(Math.random() * 256); //随机生成256以内b值
        return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
    }
    fun.randomRgbaColor=function(){
        var r = Math.floor(Math.random() * 256); //随机生成256以内r值
        var g = Math.floor(Math.random() * 256); //随机生成256以内g值
        var b = Math.floor(Math.random() * 256); //随机生成256以内b值
        var alpha = Math.random(); //随机生成1以内a值
        return `rgba(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
    }
    fun.hexToRgb=function(hex){
        var rgb = []; // 定义rgb数组
        if (/^\#[0-9A-F]{3}$/i.test(hex)) { //判断传入是否为#三位十六进制数
            let sixHex = '#';
            hex.replace(/[0-9A-F]/ig, function(kw) {
                sixHex += kw + kw; //把三位16进制数转化为六位
            });
            hex = sixHex; //保存回hex
        }
        if (/^#[0-9A-F]{6}$/i.test(hex)) { //判断传入是否为#六位十六进制数
            hex.replace(/[0-9A-F]{2}/ig, function(kw) {
                rgb.push(eval('0x' + kw)); //十六进制转化为十进制并存如数组
            });
            return `rgb(${rgb.join(',')})`; //输出RGB格式颜色
        } else {
            console.log(`Input ${hex} is wrong!`);
            return 'rgb(0,0,0)';
        }
    }
    fun.rgbToHex=function(rgb){
        if (/^rgb\((\d{1,3}\,){2}\d{1,3}\)$/i.test(rgb)) { //test RGB
            var hex = '#'; //定义十六进制颜色变量
            rgb.replace(/\d{1,3}/g, function(kw) { //提取rgb数字
                kw = parseInt(kw).toString(16); //转为十六进制
                kw = kw.length < 2 ? 0 + kw : kw; //判断位数，保证两位
                hex += kw; //拼接
            });
            return hex; //返回十六进制
        } else {
            console.log(`Input ${rgb} is wrong!`);
            return '#000'; //输入格式错误,返回#000
        }
    }

    

    return window.colordrawing=window.colorDrawing=fun;
}(jQuery)); */