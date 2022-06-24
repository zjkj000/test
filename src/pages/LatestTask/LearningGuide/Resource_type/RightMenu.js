import { Text, View,TouchableOpacity,Alert} from 'react-native'
import React, { Component } from 'react'
import {OverflowMenu,MenuItem} from "@ui-kitten/components";
import http from '../../../../utils/http/request'
import { useNavigation } from "@react-navigation/native";
//这个页面是做题页面，右上角  导航那一行显示的题目菜单界面
//只有一个 目录字样，设置了一个浮窗效果，最后根据作业数据加载目录

export default class RightMenu extends Component {
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
        const url = global.constants.baseUrl+"studentApp_getCatalog.do"
        const params ={
            learnPlanId : this.props.learnPlanId,
            // learnPlanId:'f930226b-1f96-4794-8a13-73f3cf641b6b',//各种题型
            deviceType:'PHONE'
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            let getdatanum = 0;
            //i是最外层的   遍历环节
            for(var i = 0; i<resJson.json.data.length;i++){
                //j是遍历  activityList  的
                for(var j =0;j < resJson.json.data[i].activityList.length;j++){
                    getdatanum+=resJson.json.data[i].activityList[j].resourceList.length
                }
            }
            this.setState({data:resJson.json.data,datanum:getdatanum,learnPlanId:this.props.learnPlanId});
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

      //根据试题个数动态的加载MenuItem的个数
      var MenuItem_number = []; 
      let item_num=0;
      for(var i = 0; i<this.state.data.length;i++){
            //j是遍历  activityList  的
            MenuItem_number.push(
                <MenuItem
                            title={this.state.data[i].link}
                            key={item_num}
                            />
                )
            for(var j =0;j < this.state.data[i].activityList.length;j++){
                    MenuItem_number.push(
                        <MenuItem  
                                    title={'    '+this.state.data[i].activityList[j].activityName}
                                    key={item_num}
                                    />
                        )
                    for(var k =0;k<this.state.data[i].activityList[j].resourceList.length;k++){
                        const index = item_num
                            MenuItem_number.push(
                                <MenuItem
                                            title={'        '+(item_num+1)+'. '+this.state.data[i].activityList[j].resourceList[k].resourceName}
                                            key={item_num}
                                            onPress={() => {
                                                this.props.getselectedindex(index)
                                                this.setState({ moduleVisible: false });
                                                // console.log('点了题目导航的：',this.props,index)
                                            }}/>
                                )
                            item_num += 1;
                        
                    }

            }
    }

    return (
      <View>
        <OverflowMenu
                        style={{width:200,height:800}}
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
