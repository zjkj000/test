import { Text, View,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import {OverflowMenu,MenuItem} from "@ui-kitten/components";


//这个页面是做题页面，右上角  导航那一行显示的题目菜单界面
//只有一个 目录字样，设置了一个浮窗效果，最后根据作业数据加载目录

export default class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            datanum:5,
            moduleVisible : false,
         }
    }
    
    renderAvatar = () => {
        return (
            <TouchableOpacity style={{marginRight:20}}
                onPress={() => {
                    this.setState({ moduleVisible: true });
                }}
            >
                <Text style={{fontSize:17,color:'#59B9E0'}}>目录</Text>
            </TouchableOpacity>
        );
    };
  render() {
      var MenuItem_number = [];
      for(var item_num=0;item_num<this.state.datanum;item_num++){
        MenuItem_number.push(<MenuItem
                                title={item_num+1}
                                key={item_num}
                                onPress={() => {
                                }}/>)
      }
    return (
      <View>
        <OverflowMenu
                        anchor={this.renderAvatar}
                        visible={this.state.moduleVisible}
                        onBackdropPress={() => {
                            this.setState({ moduleVisible: false });
                        }}
                    >
                        {MenuItem_number}
              </OverflowMenu>
      </View>
    )
  }
}