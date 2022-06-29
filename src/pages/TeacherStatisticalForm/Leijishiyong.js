import { Text, View,Image,TouchableOpacity} from 'react-native'
import React, { Component } from 'react'
import { OverflowMenu, MenuItem } from "@ui-kitten/components";
import http from '../../utils/http/request'
export default class Leijishiyong extends Component {
  constructor(props){
    super(props)
    this.state={
      SchoolYearTerm:[],
      ketangshouke:'',
      shishenghudong:'',
      buzhizuoye :'',
      piyueshiti:'',
      moduleVisible: false,
      SchoolYearTermName:'本学期统计',
      yearTermStartTime:'',
      yearTermEndTime:'',
    }
  }
  UNSAFE_componentWillMount(){
    this.setState(
      {SchoolYearTerm:this.props.SchoolYearTerm,
        SchoolYearTermName:this.props.SchoolYearTermName,
        yearTermStartTime:this.props.yearTermStartTime,
        yearTermEndTime:this.props.yearTermEndTime,
      }
    )
    this.getanayGetSunNum(this.props.yearTermStartTime,this.props.yearTermEndTime)
  }
  UNSAFE_componentWillReceiveProps(nextprops){
    if(nextprops.yearTermStartTime!=this.state.yearTermStartTime){
      this.getanayGetSunNum(nextprops.yearTermStartTime,nextprops.yearTermEndTime)
    }
  }

  //第一模块数据
  getanayGetSunNum(startTime,endTime){
    const url = global.constants.baseUrl+"teacherApp_anayGetSunNum.do";
    const params = {
              unitId:global.constants.company,                   //单位id
              userId:global.constants.userId,                   //教师id
              startTime:startTime,          //开始时间
              endTime:endTime,            //结束时间
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
            <Text style={{fontSize:18,color:'#87CEFA'}}>{this.state.SchoolYearTermName}</Text>
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
                      this.props.setdatastr(this.state.SchoolYearTerm[item_num].name,this.state.SchoolYearTerm[item_num].yearTermStartTime,this.state.SchoolYearTerm[item_num].yearTermEndTime)
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
                    style={{width:170}}
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
              <View style={{flex:1,justifyContent:'center'}}><Image style={{width:40,height:40,marginLeft:8}} source={require('../../assets/StatisticalForm/Ima_1.png')}></Image></View>
              <View style={{flex:2,flexDirection:'column',padding:10}}>
                <Text style={{fontSize:25}}>{this.state.ketangshouke}</Text>
                <Text style={{fontSize:18}}>课堂授课</Text>
              </View>
            </View>
            <View style={{backgroundColor:'#FCF5E5',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center'}}><Image style={{width:40,height:40,marginLeft:8}} source={require('../../assets/StatisticalForm/Ima_2.png')}></Image></View>
                <View style={{flex:2,flexDirection:'column',padding:10}}>
                    <Text style={{fontSize:25}}>{this.state.shishenghudong}</Text>
                    <Text style={{fontSize:18}}>师生互动</Text>
                </View>
            </View>
          </View> 
          <View style={{flexDirection:'row',alignContent:'space-around'}}>
            <View style={{backgroundColor:'#F2E4FD',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center'}}><Image style={{width:40,height:40,marginLeft:8}} source={require('../../assets/StatisticalForm/Ima_3.png')}></Image></View>
                  <View style={{flex:2,flexDirection:'column',padding:10}}>
                    <Text style={{fontSize:25}}>{this.state.buzhizuoye}</Text>
                    <Text style={{fontSize:18}}>布置作业</Text>
                </View>
            </View>
            <View style={{backgroundColor:'#D9F8FA',flex: 1,marginLeft: 10,marginRight:10,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center'}}><Image style={{width:40,height:40,marginLeft:8}} source={require('../../assets/StatisticalForm/Ima_4.png')}></Image></View>
                  <View style={{flex:2,flexDirection:'column',padding:10}}>
                    <Text style={{fontSize:25}}>{this.state.piyueshiti}</Text>
                    <Text style={{fontSize:18}}>批阅试题</Text>
                </View>
            </View>
          </View>
        </View>
    )
  }
}