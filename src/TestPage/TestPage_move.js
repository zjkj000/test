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
            <View>
                    <View >
                        <View style={styles.container}>
                                    <WebCanvas1 
                                        handleBase64={this._handleBase64.bind(this)}
                                        ref='canvas'
                                        height={screenWidth} 
                                        width={screenWidth}
                                        />
                                    
                            </View>
                    </View>
            </View>
            
        );
    }
}
