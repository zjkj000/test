import { Text, View,Image,TouchableOpacity} from 'react-native'
import React, { Component } from 'react'
import { OverflowMenu, MenuItem } from "@ui-kitten/components";
import http from '../../utils/http/request'
export default class Leijishiyong extends Component {
  constructor(props){
    super(props)
    this.state={
      SchoolYearTerm:[],
      ketangshouke:'627',
      shishenghudong:'3701',
      buzhizuoye :'328',
      piyueshiti:'1751/1980',
      moduleVisible: false,
      SchoolYearTermName:'本学期统计',
      yearTermStartTime:'',
      yearTermEndTime:'',
    }
  }
  UNSAFE_componentWillMount(){
    this.getSchoolYearTerm()
    this.getanayGetSunNum()
  }
  //获取学年数据
  getSchoolYearTerm(){
    const url =
              "http://" +
              "www.cn901.net" +
              ":8111" +
              "/AppServer/ajax/teacherApp_anayGetSchoolYearTerm.do";
    const params = {
              unitId:'6105230000001 '                //单位id
            }
      http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          if(resJson.success){
            this.setState(
              {SchoolYearTerm:resJson.data,
                SchoolYearTermName:resJson.data[0].name,
                yearTermStartTime:resJson.data[0].yearTermStartTime,
                yearTermEndTime:resJson.data[0].yearTermEndTime,
              }
            )
          }
      })
  }

  //第一模块数据
  getanayGetSunNum(){
    const url =
              "http://" +
              "www.cn901.net" +
              ":8111" +
              "/AppServer/ajax/teacherApp_anayGetSunNum.do";
    const params = {
              unitId:'6105230000001',                   //单位id
              userId:'dlzx2019',                        //教师id
              startTime:'2021-12-27 00:00:00',          //开始时间
              endTime:'2021-12-29 00:00:00',            //结束时间
            }
      http.get(url, params).then((resStr) => {
          let resJson = JSON.parse(resStr);
          if(resJson.success){
            this.setState(
              {ketangshouke:resJson.data.ktNum,
              shishenghudong:resJson.data.hdNum,
              buzhizuoye :resJson.data.zyNum,
              piyueshiti:resJson.data.pgNum,
              }
            )
          }
      })
  }

  renderAvatar = () => {
    return (
        <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {this.setState({ moduleVisible: true });}}>
            <Text style={{fontSize:15,color:'#87CEFA'}}>{this.state.SchoolYearTermName}</Text>
            <Text> ▼</Text>
        </TouchableOpacity>
    );
};

  render() {
    var MenuItem_number = [];
        for (let item_num = 0; item_num < this.state.SchoolYearTerm.length; item_num++) {
            MenuItem_number.push(
                <MenuItem
                    title={this.state.SchoolYearTerm[item_num].name}
                    key={item_num}
                    onPress={() => {
                      this.setState({ 
                        moduleVisible: false ,
                        yearTermStartTime:this.state.SchoolYearTerm[item_num].yearTermStartTime,
                        yearTermEndTime:this.state.SchoolYearTerm[item_num].yearTermEndTime,
                        SchoolYearTermName:this.state.SchoolYearTerm[item_num].name
                      })}}
                />
            );
        }
    return (
      <View style={{backgroundColor:'#FFFFFF',padding:20,alignItems:'stretch'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap'}}>
            <Text style={{fontSize:20}}>累计使用</Text>
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
          <View  style={{flexDirection:'row',alignContent:'space-around',marginBottom:20,zIndex:1}}>
            <View style={{backgroundColor:'#E0F3E0',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
              <View style={{flex:1,justifyContent:'center'}}><Image source={require('../../assets/StatisticalForm/Ima_1.png')}></Image></View>
              <View style={{flex:2,flexDirection:'column',padding:10}}>
                <Text style={{fontSize:15}}>{this.state.ketangshouke}</Text>
                <Text style={{fontSize:15}}>课堂授课</Text>
              </View>
            </View>
            <View style={{backgroundColor:'#FCF5E5',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center',paddingLeft:15}}><Image source={require('../../assets/StatisticalForm/Ima_2.png')}></Image></View>
                <View style={{flex:2,flexDirection:'column',padding:10}}>
                    <Text style={{fontSize:15}}>{this.state.shishenghudong}</Text>
                    <Text style={{fontSize:15}}>师生互动</Text>
                </View>
            </View>
          </View> 
          <View style={{flexDirection:'row',alignContent:'space-around'}}>
            <View style={{backgroundColor:'#F2E4FD',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center',paddingLeft:15}}><Image source={require('../../assets/StatisticalForm/Ima_3.png')}></Image></View>
                  <View style={{flex:2,flexDirection:'column',padding:10}}>
                    <Text style={{fontSize:15}}>{this.state.buzhizuoye}</Text>
                    <Text style={{fontSize:15}}>布置作业</Text>
                </View>
            </View>
            <View style={{backgroundColor:'#D9F8FA',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center',paddingLeft:15}}><Image source={require('../../assets/StatisticalForm/Ima_4.png')}></Image></View>
                  <View style={{flex:2,flexDirection:'column',padding:10}}>
                    <Text style={{fontSize:15}}>{this.state.piyueshiti}</Text>
                    <Text style={{fontSize:15}}>批阅试题</Text>
                </View>
            </View>
          </View>
        </View>
    )
  }
}