import { Text, View,TouchableOpacity,Alert} from 'react-native'
import React, { Component,forwardRef } from 'react'
import {OverflowMenu,MenuItem} from "@ui-kitten/components";
import http from '../../../../utils/http/request'
import { useNavigation } from "@react-navigation/native";
//这个页面是做题页面，右上角  导航那一行显示的题目菜单界面
//只有一个 目录字样，设置了一个浮窗效果，最后根据作业数据加载目录

export default class Menu extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            data:[],
            learnPlanId:'',
            datanum:0,
            moduleVisible : false,
         }
    }
    
    UNSAFE_componentWillMount(){
        const url = 
                "http://"+
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/studentApp_getJobDetails.do"
        const params ={
            learnPlanId : this.props.learnPlanId,
            userName : 'ming5059'
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            this.setState({data:resJson.data,datanum:resJson.data.length,learnPlanId:this.props.learnPlanId});
        })
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

    //  forwardRef((props, ref) => {
    //     const [form] = Form.useForm();
    //     useImperativeHandle(ref, () => ({
    //         myForm: form,
    //     }));

      //根据试题个数动态的加载MenuItem的个数
      var MenuItem_number = [];
      for(let item_num=0;item_num<this.state.datanum;item_num++){
        MenuItem_number.push(
            // <TouchableOpacity onPress={()=>{
            //     alert('需要跳转',item_num)
            //     console.log('点了题目导航的：',item_num)
            // }}>
                            <MenuItem
                                title={this.state.data[item_num].questionName}
                                key={item_num}
                                onPress={() => {
                                    //需要用到导航，进行跳转
                                    //nagevation.nagevite()
                                    this.props.getselectedindex(item_num)
                                    this.setState({ moduleVisible: false });
                                    console.log('点了题目导航的：',this.props,item_num)
                                }}/>
            // </TouchableOpacity>
                                )
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
