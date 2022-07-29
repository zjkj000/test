import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
var html = `<html>
 <head>
   <title>canvas</title>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
   <style>
     *{
       margin: 0;
       padding: 0;
     }
   </style>
 </head> 
 <body>
   <canvas id='can'>
     您的浏览器不支持canvas
   </canvas>
   <script>
    var canvas = $('#can'),isclean=false,drawState=false,lastX,lastY,ctx;
    ctx = canvas[0].getContext("2d");
    var _width,_height,_dataUrl;
    //撤销相关
    var cPushArray = new Array();
    var cStep = -1;
    window.document.addEventListener('message', function (e){
        var obj = JSON.parse(e.data);
        switch (parseInt(obj.action)){
          case 1:
              /* 画笔 */
              isclean=false;
              registDraw();
              break;
          case 2:
              /* 橡皮 */
              isclean=true;
              break;
          case 3:
              /* 右转 */
              rotateRight();
              break;
          case 4:
              /* url加载图片 */
              createImg(obj.data);
              break;
          case 5:
              /* case64加载图片 */
              createImg(obj.data);
              break;
          case 6:
              /* 销毁监听函数 */
              destoryDraw();
              break;
          case 7:
              /* 销毁监听函数 */
              cUndo();
              break;
          case 0:
              /* 返回base64 */
              returnBase64();
              break;
          case -1:
              /* 初始化画板 */
              ctx.clearRect(0,0, _width, _height);
              break;
        }
    });

    function init_canvas(width,height,dataurl){
      _width = width;
      _height = height;
      _dataurl=dataurl
      canvas.attr('width', width);
      canvas.attr('height', height);
    }

    //点击了移动  应该把监听的函数销毁   这里有问题  销毁不掉
    function destoryDraw(){
      cPushArray = new Array();
      cStep = -1;
      var canvas  = document.getElementById("can");
      dataUrl = canvas.toDataURL();
      window.ReactNativeWebView.postMessage(JSON.stringify({action: 6, data: dataUrl}));
    }

 
    function cPush() {
        cStep++;
        if (cStep < cPushArray.length) { cPushArray.length = cStep; }
        cPushArray.push(document.getElementById('can').toDataURL());
    }
    function cUndo() {
        if (cStep > 0) {
            cStep--;
            var canvasPic = new Image();
            canvasPic.src = cPushArray[cStep];
            canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        }
    }

    function registDraw(){
        var ox;
        var oy;
        var ox2;
        var oy2;
        canvas.on("touchstart", function (e){
            e = e.originalEvent.touches[0];
            ox2 = e.screenX;
            oy2 = e.screenY;
            drawState = true;
            var x = e.clientX -  canvas.offset().left;
            var y = e.clientY -  canvas.offset().top + $(document).scrollTop();
            lastX = x;
            lastY = y;
            draw(x, y, true, isclean);
            cPush()
            return false;
        });
        canvas.on("touchmove", function (ev){
            e = ev.originalEvent.touches[0];
            if (drawState){
                if (lastX == null || lastY == null ){
                  canvas.lastX = canvas.lastY = null;
                    lastX = e.clientX - canvas.offset().left;
                    lastY = e.clientY - canvas.offset().top + $(document).scrollTop();
                }
                draw(e.clientX - canvas.offset().left, 
                    e.clientY - canvas.offset().top + $(document).scrollTop(),true,isclean);
                return false;
            }
            cPush()
            return false;
        });
        $(document).on("touchend", function (e){
            drawState = false;
        });
    };

      function draw(x, y, isDown, isclean){
        if (isDown) {
            ctx.globalCompositeOperation = isclean ? "destination-out" : "source-over";
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
        lastX = x;
        lastY = y;
      };

      /* 旋转 */
      function rotateRight(){
        var obj = ctx.getImageData(0,0,_width, _height);
        var new_obj = ctx.createImageData(obj.height, obj.width);
        var num = 0;
        for (var j=0;j<obj.width;j++){
            for (var i=obj.height;i>0;i--){
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+1];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+2];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+3];
            }
        }
        _width = new_obj.width;
        _height = new_obj.height;
        canvas.attr("width", this.width);
        canvas.attr("height",this.height);
        ctx.clearRect(0,0,this.width,this.height);  
        ctx.putImageData(new_obj, 0, 0);
      };

      function createImg(data){
      var img = new Image();
      img.crossOrigin = '*';
      img.onload = function (){
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        can = canvas[0];
        ctx = can.getContext("2d");
        ctx.drawImage(img, 0, 0, _width, _height);
      };
      $(img).attr('src', data);
      }


      function imageData2base64(imgdata){
        var can = $("<canvas>").attr("width", imgdata.width).attr("height", imgdata.height);
        can = can[0];
        var ctx = can.getContext("2d");
        ctx.putImageData(imgdata, 0, 0);
        return can.toDataURL();
      }



      /*
        保存图片功能，将图片保存成一张图片并返回base64
      */
      function saveAsBase64(){
        var obj = this.ctx_img.getImageData(0,0,this.width, this.height);
        var obj2 = this.ctx_edit.getImageData(0,0,this.width, this.height);
        var new_obj = this.ctx_img.createImageData(this.width, this.height);
        var len = obj2.data.length / 4;
        for(var i=0;i<len;i++){
            if (obj2.data[i*4+3] != 0){
                new_obj.data[i*4] = obj2.data[i*4];
                new_obj.data[i*4+1] = obj2.data[i*4+1];
                new_obj.data[i*4+2] = obj2.data[i*4+2];
                new_obj.data[i*4+3] = 255;
            }else{
                new_obj.data[i*4] = obj.data[i*4];
                new_obj.data[i*4+1] = obj.data[i*4+1];
                new_obj.data[i*4+2] = obj.data[i*4+2];
                new_obj.data[i*4+3] = obj.data[i*4+3];
            }
        } 
        return imageData2base64(new_obj);
      }
      /* 将图片处理成base64返回 */
      function returnBase64(){
      var data = canvas[0].toDataURL();
      window.ReactNativeWebView.postMessage(JSON.stringify({action: 0, data: data}));
      }
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
       width: this.props.width,
       url:String(this.props.url).replace('cn901.com', 'cn901.net:8111')
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
   _cUndo(){
    this.post({action: 7})
   }
   // 初始化画板
   _init(){
     this.post({action:'-1'})
   }
   _destoryDraw(){
    this.post({action:6})
   }
 
   // 以url的形式添加背景
   _addImageUrl(data){
    console.log('WebCanvas-----addImageUrl',data)
    // this._init()
    this.post({action: 4, data: data})
   }
 
   // 以base64的形式添加背景
   _addImageBase64(data){
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
     console.log('WebCanvas---webviewload')
     this.webview.injectJavaScript('init_canvas('+this.props.width+', '+this.props.height+')');
     if(this.state.url!=null){
      this._addImageUrl(String(this.state.url).replace('cn901.com', 'cn901.net:8111'))
     }
     if (this.props.onLoad){
       this.props.onLoad(); 
     }
   }
 
   messageHandler(e){
     var obj = JSON.parse(e.nativeEvent.data);
     if (obj.action == 0){
       this.props.handleBase64(obj.data);
     }else if (obj.action == 6){
      console.log('监听到了html') 
      this.props.handleUrl(obj.data);
    }
   } 

   UNSAFE_componentWillMount(){
    
    console.log('检查原因：++Will++',String(this.props.url).substring(75))
    // console.log('WebCanvas加载了----WillMount',this.props.url)
    this.setState({url:String(this.props.url).replace('cn901.com', 'cn901.net:8111')})
   }

   UNSAFE_componentWillUpdate(nextProps){
    console.log('检查原因：++Update++',String(nextProps.url).substring(75))
    
    if(this.state.url!=nextProps.url&&this.state.url!=''){
      this.setState({url:nextProps.url})
    }
   
   }

   render() {
     return (
       <View style={[styles.container, {width:this.state.width, height:this.state.height}]}>  
         <WebView 
          androidHardwareAccelerationDisabled
           style={{width:this.state.width, height:this.state.height}}
           ref = {(w) => {this.webview = w}}
           onLoad={this.webviewload.bind(this)}
           source={{html: html}}
           onMessage={this.messageHandler.bind(this)}
           javaScriptEnabled={true}
           domStorageEnabled={false}
           automaticallyAdjustContentInsets={true}
           scalesPageToFit={Platform.OS === 'android' ? true : false}
           scrollEnabled={false}
           originWhitelist={['*']}
           />
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
