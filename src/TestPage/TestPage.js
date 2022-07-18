import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { screenHeight, screenWidth } from "../utils/Screen/GetSize";
import { styles } from "./styles";
import WebCanvas from "./WebCanvas";
import http from '../utils/http/request'
var base64 ='';
var baseurl='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F21031FKU44S6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660123240&t=70bf04c04f065c75c8676c464dd360c6'
var url = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F21031FKU44S6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660123240&t=70bf04c04f065c75c8676c464dd360c6';
export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNum: 0,
            imgState: 1,
            flag:'yidong',
            url:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F21031FKU44S6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660123240&t=70bf04c04f065c75c8676c464dd360c6'
        };
    }
    saveimage_base64(base64){
      const urla = global.constants.baseUrl + "studentApp_uploadUserPhoto.do";
      const params = {
          userId: global.constants.userName,
          baseCode: base64,
      };
      // http.post(urla, params, false).then((res) => {
      //     if(res.success){
      //       this.setState({url:res.data})
      //     }
      // })
    }

     _pen(){
        this.canvas._pen();
        this.setState({flag:'pigai'})
      }
    
      _clean(){
        this.canvas._clean();
        this.setState({flag:'qingkong'})
      }
      // 以url的形式添加背景
      _addImageUrl(){
        this.canvas._addImageUrl(url);
      }
      // 以base64的形式添加背景
      _addImageBase64(){
        this.canvas._addImageBase64(base64);
      }
      // 得到图片的base64形式
      _getBase64(){
        this.canvas._getBase64(base64);
      }
      // 保存base64
      _handleBase64(data){
        this.saveimage_base64(data)
        base64=data
        // this.canvas.webview.reload()
        // this.canvas._addImageBase64(data);
      }
      _destoryDraw(){
        this._getBase64()
        this.setState({flag:'yidong'})
        this.canvas._destoryDraw()
      }
      // 图片右转
      _rotateRight(){
        this.canvas._rotateRight();
      }

    render() {
        return (
                        <View style={{height:screenHeight,flexDirection:'column',height:'100%'}}>
                           <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',justifyContent:"center",borderBottomWidth:0.5,borderColor:"#CBCBCB"}}>
                                  <TouchableOpacity style={{position:'absolute',left:10}} 
                                                    onPress={()=>{this.props.navigation.goBack()
                                }}>
                                    <Image style={{width:30,height:30}} source={require('../assets/teacherLatestPage/goback.png')} ></Image>
                                  </TouchableOpacity>
                                  <Text style={{color:'#59B9E0',fontSize:20}}>批改作业</Text>
                            </View>
                          <View style={{height:screenHeight-130}}>
                      <WebCanvas 
                                          handleBase64={this._handleBase64.bind(this)}
                                          ref={ref => this.canvas = ref}
                                          url={url}
                                          height={screenWidth} 
                                          width={screenWidth}
                                          />
                          </View>
                          <View style={{flexDirection:'row',width:'100%',justifyContent:"space-around",height:70,alignItems:"center"}}>
                                          <TouchableOpacity onPress={this._pen.bind(this)}>
                                            <Image style={{width:50,height:50}}  source={this.state.flag=='pigai'?require('../assets/correctpaper/pigaia.png'):require('../assets/correctpaper/pigai.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={
                                            ()=>{
                                              this._destoryDraw()
                                            }
                                            // this._getBase64.bind(this)
                                            } >
                                            <Image style={{width:50,height:50}}  source={ this.state.flag=='yidong'?require('../assets/correctpaper/yidonga.png'):require('../assets/correctpaper/yidong.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity   onPress={()=>{
                                            url=baseurl
                                            this.canvas.webview.reload()
                                              this.setState({flag:'yidong'})
                                          }}>
                                            <Image style={{width:50,height:50}} source={require('../assets/correctpaper/qingkong.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity   onPress={()=>{
                                              this.setState({flag:'chexiao'})
                                          }}>
                                            <Image source={require('../assets/correctpaper/chexiao.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={this._rotateRight.bind(this)}>
                                            <Image style={{width:50,height:50}} source={require('../assets/correctpaper/xuanzhuan.png')}></Image>
                                          </TouchableOpacity>
                          </View>
                                    
                            </View>
            
        );
    }
}
