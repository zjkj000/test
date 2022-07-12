 import React, { Component } from 'react';
 import {
   StyleSheet,
   View,
   Text,
   TouchableOpacity
 } from 'react-native';
 import WebView from 'react-native-webview'
 var html = 
 `<html>
 <head>
   <title>canvas</title>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
   <style>
     
   </style>
 </head> 
 <body>
   <canvas id='can'>
     您的浏览器不支持canvas
   </canvas>
   
   <script type="text/javascript">
      (function() {
        var c = document.getElementById('can');
        var ctx = c.getContext('2d');
        var ax,
          ay,
          r = 30,
          num = 1; //绘制图形的参数
        var timeOutEvent = 0; //区分拖拽和点击的参数
        //创建图形

        function ParamEllipse(context, x, y, a, b) {
          //max是等于1除以长轴值a和b中的较大者
          //i每次循环增加1/max，表示度数的增加
          //这样可以使得每次循环所绘制的路径（弧线）接近1像素
          var step = (a > b) ? 1 / a : 1 / b;
          context.fillStyle = "#ff0000";
          context.beginPath();
          context.moveTo(x + a, y); //从椭圆的左端点开始绘制
          for (var i = 0; i < 2 * Math.PI; i += step) {
              //参数方程为x = a * cos(i), y = b * sin(i)，
              //参数为i，表示度数（弧度）
              context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
          }
          context.closePath();
          context.stroke();
          context.fill();
          context.closePath();
      };
      
      //绘制矩形
      function FillRect(context, x, y, w, h, flag) {
          var grd = context.createLinearGradient(x+w/2, y, x + w/2, y + h);
          if (flag) {
              grd.addColorStop(0, "yellow");
              grd.addColorStop(1, "red");
          } else {
              grd.addColorStop(0, "red");
              grd.addColorStop(1, "yellow");
          }
          context.fillStyle = grd;
          context.fillRect(x, y, w, h);
      }
      
      //绘制线条
      function SetLine(ctx, x, y, x1, y1) {
          ctx.beginPath();
          ctx.strokeStyle = "yellow";
          ctx.moveTo(x,y);
          ctx.lineTo(x1,y1);
          ctx.stroke();
          ctx.closePath();
      }
      
    var startX = 180; //中心坐标x
    var startY = 100; //中心坐标y
    var pWidth = 60; //椭圆长轴
    var pHeigth = 40; //椭圆形短轴
    var fWidth = 48; //矩形宽
    var fheight = 16; //矩形高
    //绘制椭圆
    ParamEllipse(ctx, startX, startY, pWidth, pHeigth);
    //在椭圆上方和下方绘制长方形，且有一半的高度和椭圆重叠
    FillRect(ctx, startX - fWidth / 2, startY - pHeigth - (fheight / 2), fWidth, fheight, true);
    FillRect(ctx, startX - fWidth / 2, startY + pHeigth - (fheight / 2), fWidth, fheight, false);
    //在矩形下方绘制线条,8个单位一条线,长度为40，均匀分布在矩形下方
    var lLen = fheight; //画线的范围始终在矩形之下
    var lInterval = 8; //线与线之间的间隔
    for (var i = 0; i < (fWidth / 8) + 1; i++) {
        SetLine(ctx, startX - fWidth / 2 + i * lInterval, startY + pHeigth + fheight / 2, startX - fWidth / 2 + i * lInterval, startY + pHeigth + fheight / 2 + lLen);
    }
  
    //画线，将其连接起来
    var lsX = startX + pWidth + 20;
    var lsY = startY;
    var leX = startX + pWidth + 20 + 100;
    var leY = startY;
    SetLine(ctx, lsX, startY - 30, leX - 30, leY - 150);
    SetLine(ctx, lsX, startY - 15, leX, leY - 50);
    SetLine(ctx, lsX, startY + 15, leX, leY + 100);
    SetLine(ctx, lsX, startY + 30, leX - 30, leY + 150);

    //左上标写上说明
    ctx.font = "35px Arial";
    var t = "     灯笼";
    ctx.fillText(t, 100, 40);









        // function createBlock(a, b, r) {
        //   ctx.beginPath();
        //   ctx.fillStyle = 'red';
        //   ctx.arc(a, b, r, 0, Math.PI * 2);
        //   ctx.fill();
        // }


        c.onmousedown = function(ev) {
          var e = ev || event;
          var x = e.clientX;
          var y = e.clientY;
          timeOutEvent = setTimeout('longPress()', 500);
          e.preventDefault();
          drag(x, y, r);
        };
        //缩放
        c.onmousewheel = function(ev) {
          var e = ev || event;
          num += e.wheelDelta / 1200;
          r = 30 * num;
          ctx.clearRect(0, 0, c.width, c.height);
          if (ax == null || ay == null) {
            createBlock(200, 200, r);
          } else {
            if (r > 0) {
              createBlock(ax, ay, r);
            }
          }
        };
        //拖拽函数
        function drag(x, y, r) {
          if (ctx.isPointInPath(x, y)) {
            //路径正确，鼠标移动事件
            c.onmousemove = function(ev) {
              var e = ev || event;
              ax = e.clientX;
              ay = e.clientY;
              clearTimeout(timeOutEvent);
              timeOutEvent = 0;
              //鼠标移动每一帧都清除画布内容，然后重新画圆
              ctx.clearRect(0, 0, c.width, c.height);
              createBlock(ax, ay, r);
            };
            //鼠标移开事件
            c.onmouseup = function() {
              c.onmousemove = null;
              c.onmouseup = null;
              clearTimeout(timeOutEvent);
              if (timeOutEvent != 0) {
                alert('你这是点击，不是拖拽');
              }
            };
          }
        }
       function longPress() {
          timeOutEvent = 0;
        }
      })();
    </script>


 </body>
 </html>
 `;
 
 var _width,_height;
 export default class WebCanvas extends Component {
   webview = {};
   constructor(props) {
     super(props);
     this.state = {
       height: this.props.height,
       width: this.props.width
     }
   }
   // 铅笔
   _pen(){
     this.post({action: 1})
   }
   // 橡皮
   _clean(){
     this.post({action: 2})
   }
   // 初始化画板
   _init(){
     this.post({action:'-1'})
   }
 
   // 以url的形式添加背景
   _addImageUrl(data){
    this._init()
     this.post({action: 4, data: data})
   }
 
   // 以base64的形式添加背景
   _addImageBase64(data){
    this._init()
     this.post({action: 5, data: data})
   }
 
   _addImage(data){
     this.post({action: 4, data: data})
   }
 
   // 得到图片的base64形式
   _getBase64(){
     this.post({action: 0})
   }
 
   // 图片右转
   _rotateRight(){
     this.post({action: 3})
   }
 
   post(obj){
     this.webview.postMessage(JSON.stringify(obj));
   }
 
   webviewload(){
     // alert('加载成功！')
     this.webview.injectJavaScript('init_canvas('+this.props.width+', '+this.props.height+');');
 
     if (this.props.onLoad){
       this.props.onLoad();
     }
   }
 
   messageHandler(e){
     var obj = JSON.parse(e.nativeEvent.data);
     if (obj.action == 0){
       this.props.handleBase64(obj.data);
     }
   } 
 
   render() {
     return (
       <View style={[styles.container, {width:this.state.width, height:this.state.height}]}>  
         <WebView 
            androidHardwareAccelerationDisabled
           style={{width:this.state.width, height:this.state.height}}
           ref = {(w) => {this.webview = w}}
           onLoad={
            this.webviewload.bind(this)
          }
           source={{html: html}}
           onMessage={
            this.messageHandler.bind(this)}
           javaScriptEnabled={true}
           domStorageEnabled={false}
           automaticallyAdjustContentInsets={true}
           scalesPageToFit={Platform.OS === 'android' ? true : false}
           scrollEnabled={false}
           originWhitelist={['*']}
           />

           <TouchableOpacity style={{height:30,justifyContent:'center',alignItems:"center",width:"100%"}}>
             <Text>缩放查看</Text>
           </TouchableOpacity>
       </View>
     );
   }
 }
 
 const styles = StyleSheet.create({ 
     container: {  
         alignItems: 'flex-start',  
         backgroundColor: 'green',
 
     }
 }); 