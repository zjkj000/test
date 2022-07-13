import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { screenHeight, screenWidth } from "../utils/Screen/GetSize";
import { styles } from "./styles";
import WebCanvas1 from "./WebCanvas1";

export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNum: 0,
            imgState: 1,
            yidongFlag:true,
            pigaiFlag:false,
        };
    }

    _pen(){
        this.refs.canvas._pen();
      }
    
      _clean(){
        this.refs.canvas._clean();
      }
    
      // 以url的形式添加背景
      _addImageUrl(){
        this.refs.canvas._addImageUrl(url);
      }
    
      // 以base64的形式添加背景
      _addImageBase64(){
        this.refs.canvas._addImageBase64(base64);
      }
    
      // 得到图片的base64形式
      _getBase64(){
        this.refs.canvas._getBase64(base64);
      }
     
    
      // 保存base64
      _handleBase64(data){
        base64=data
      }
    
      // 图片右转
      _rotateRight(){
        this.refs.canvas._rotateRight();
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
                            <WebCanvas1 
                                          handleBase64={this._handleBase64.bind(this)}
                                          ref='canvas'
                                          height={screenWidth} 
                                          width={screenWidth}
                                          />
                          </View>
                          <View style={{flexDirection:'row',width:'100%',justifyContent:"space-around",height:70,alignItems:"center"}}>
                                          <TouchableOpacity onPress={()=>{this.setState({pigaiFlag:!this.state.pigaiFlag,yidongFlag:false})}}>
                                            <Image style={{width:50,height:50}}  source={this.state.pigaiFlag?require('../assets/correctpaper/pigaia.png'):require('../assets/correctpaper/pigai.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={()=>{this.setState({yidongFlag:!this.state.yidongFlag,pigaiFlag:false})}} >
                                            <Image style={{width:50,height:50}}  source={ this.state.yidongFlag?require('../assets/correctpaper/yidonga.png'):require('../assets/correctpaper/yidong.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity   >
                                            <Image style={{width:50,height:50}} source={require('../assets/correctpaper/qingkong.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity   >
                                            <Image v source={require('../assets/correctpaper/chexiao.png')}></Image>
                                          </TouchableOpacity>
                                          <TouchableOpacity>
                                            <Image style={{width:50,height:50}} source={require('../assets/correctpaper/xuanzhuan.png')}></Image>
                                          </TouchableOpacity>
                          </View>
                                    
                            </View>
            
        );
    }
}
