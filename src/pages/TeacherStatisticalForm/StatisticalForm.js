import { Text, View,ScrollView,Image,Button, TouchableOpacity} from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import Leijishiyong from './Leijishiyong';
import Ketangshouke from './Ketangshouke';
import Buzhizuoye from './Buzhizuoye';
import Piyueshiti from './Piyueshiti';
import BasePicker from '../../utils/datetimePickerUtils/BasePicker'
import http from '../../utils/http/request'
import Loading from '../../utils/loading/Loading'
import { useNavigation } from '@react-navigation/native';
export default function StatisticalForm() {
  const navigation = useNavigation()
  return (
    <StatisticalFormContoner navigation={navigation}/>
  )
}
 class StatisticalFormContoner extends Component {
    constructor(props){
        super(props)
        this.setBuzhizuoyeDate=this.setBuzhizuoyeDate.bind(this)
        this.setKetangshoukeDate=this.setKetangshoukeDate.bind(this)
        this.setPiyueshitiDate=this.setPiyueshitiDate.bind(this)
        this.setselectYearTerm = this.setselectYearTerm.bind(this)
        this.state={
            KetangshoukeDateStr:'',
            BuzhizuoyeDateStr:'',
            PiyueshitiDateStr:'',
            SchoolYearTerm:[],
            SchoolYearTermName:'',
            yearTermStartTime:'',
            yearTermEndTime:'',
            isrefresh:false,
        }
    }   

    UNSAFE_componentWillMount(){
      const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_anayGetSchoolYearTerm.do";
      const params = {
            unitId:global.constants.company                //单位id
          }
      http.get(url, params).then((resStr) => {
        let resJson = JSON.parse(resStr);
        if(resJson.success){
          this.setState({
                        SchoolYearTerm:resJson.data,
                        SchoolYearTermName:resJson.data[0].name,
                        yearTermStartTime:resJson.data[0].yearTermStartTime,
                        yearTermEndTime:resJson.data[0].yearTermEndTime,
                        KetangshoukeDateStr:new Date().toISOString().substring(0,10),
                        BuzhizuoyeDateStr:new Date().toISOString().substring(0,10),
                        PiyueshitiDateStr:new Date().toISOString().substring(0,10),
                      })
            }
      })
    }
    

    setselectYearTerm(name,starstr,endstr){
      this.setState({
            SchoolYearTermName:name,
            yearTermStartTime:starstr,
            yearTermEndTime:endstr,
      })
    }

    setBuzhizuoyeDate(str){
        this.setState({BuzhizuoyeDateStr:str})
    }
    setPiyueshitiDate(str){
        this.setState({PiyueshitiDateStr:str})
    }
    setKetangshoukeDate(str){
        this.setState({KetangshoukeDateStr:str})
    }
    nextDay(str){
      var year = parseInt(str.substring(0,4))
      var month = parseInt(str.substring(5,7))
      var day = parseInt(str.substring(8,10))
      if(month==2&&day==28&&year%100==0&&yaer%400!=0){
         month=3
         day=1
      }else if(month==2&&day==28&&day%4!=0){
        month=3
        day=1
      }else if(month==2&&day<28){
        day+=1
      }else if(day=='30'&&(month=='2'||month=='4'||month=='6'||month=='9'||month=='11')){
        month+=1
        day=1
      }else if(day=='31'){
        day = 1
        if(month<12){
          month=month+1
        }else{
          month=1
          year+=1
        }
      }else{
        day+=1
      }
      return year+'-'+ month.toString().padStart(2,'0')+'-'+day.toString().padStart(2,'0')
    }
    theLastDay(str){
      var year = parseInt(str.substring(0,4))
      var month = parseInt(str.substring(5,7))
      var day = parseInt(str.substring(8,10))
      if(day==1){
        if(month>1){
          month-=1
          if(month==2){
            if(year%100==0&&yaer%400==0){
              day=29
            }else if(year%100!=0&&year%4==0){
              day=29
            }else{
              day=28
            }
          }else if(month=='2'||month=='4'||month=='6'||month=='9'||month=='11'){
            day=30
          }else{
            day=31
          }
        }else{
          year-=1
          month=12
          day=31
        }
      }else{
        day-=1
      }
      return year+'-'+month.toString().padStart(2,'0')+'-'+day.toString().padStart(2,'0')
    }

  render() {
    if(this.state.SchoolYearTermName==''){
      return(
        <View>
            <Loading show='true' color='#59B9E0'/>
        </View>
      )
    }else{
      return (
        <View>
          <View style={{height:40,backgroundColor:'#FFFFFF',alignItems:'center',alignContent:'center'}}>
            <Text style={{fontSize:20,marginTop:5}}>统计报表</Text>
          </View>
          <ScrollView style={{backgroundColor:'#ECEEED',padding:10,flexDirection:'column',marginBottom:45}}>
            {/* 累计使用 */}
            <Leijishiyong data={this.state.leijishiyonglist} setdatastr={this.setselectYearTerm} SchoolYearTerm={this.state.SchoolYearTerm} SchoolYearTermName={this.state.SchoolYearTermName}yearTermStartTime={this.state.yearTermStartTime}yearTermEndTime={this.state.yearTermEndTime}/>
            {/* 课堂授课标题+日历 */}
            <View style={{height:30,flexDirection:'row',justifyContent:'space-between',margin:10,alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{height:25,width:5,backgroundColor:'#47BB3E',marginRight:5}}></View>
                <Text style={{fontSize:20}}>课堂授课</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{this.setState({KetangshoukeDateStr:this.theLastDay(this.state.KetangshoukeDateStr)})}}>
                  <Text style={{color:'#87CEFA',fontSize:18}} >{'<'}   </Text>
                </TouchableOpacity>
                <Text style={{fontSize:18}}>{this.state.KetangshoukeDateStr}</Text>
                <TouchableOpacity onPress={()=>{this.setState({KetangshoukeDateStr:this.nextDay(this.state.KetangshoukeDateStr)})}}>
                  <Text style={{color:'#87CEFA',fontSize:18}} >   {'>'}</Text>
                </TouchableOpacity>
                
              </View>
              <BasePicker modle={'Date'} setDateOrTime={this.setKetangshoukeDate} selected={this.state.KetangshoukeDateStr}/>
            </View>
            {/* 课堂授课图表 */}
            <Ketangshouke data={this.state.ketangshoukelist} date={this.state.KetangshoukeDateStr} yearTermStartTime={this.state.yearTermStartTime} yearTermEndTime={this.state.yearTermEndTime} />
            {/* 布置作业标题+日历 */}
            <View style={{height:30,flexDirection:'row',justifyContent:'space-between',margin:10,alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{height:25,width:5,backgroundColor:'#9518BA',marginRight:5}}></View>
                <Text style={{fontSize:20}}>布置作业</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={()=>{this.setState({BuzhizuoyeDateStr:this.theLastDay(this.state.BuzhizuoyeDateStr)})}}>
                    <Text style={{color:'#87CEFA',fontSize:18}} >{'<'}   </Text>
                  </TouchableOpacity>
                <Text style={{fontSize:18}}>{this.state.BuzhizuoyeDateStr}</Text>
                <TouchableOpacity onPress={()=>{this.setState({BuzhizuoyeDateStr:this.nextDay(this.state.BuzhizuoyeDateStr)})}}>
                  <Text style={{color:'#87CEFA',fontSize:18}} >{'>'}</Text>
                </TouchableOpacity>
                
              </View>
              <BasePicker modle={'Date'} setDateOrTime={this.setBuzhizuoyeDate} selected={this.state.BuzhizuoyeDateStr}/>
            </View>
            {/* 布置作业图表 */}
            <Buzhizuoye data={this.state.buzhizuoyelist} date={this.state.BuzhizuoyeDateStr} yearTermStartTime={this.state.yearTermStartTime} yearTermEndTime={this.state.yearTermEndTime}/>
            {/* 批阅试题标题+日历 */}
            <View style={{height:30,flexDirection:'row',justifyContent:'space-between',margin:10,alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{height:25,width:5,backgroundColor:'#7C67F4',marginRight:5}}></View>
                <Text style={{fontSize:20}}>批阅试题</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{this.setState({PiyueshitiDateStr:this.theLastDay(this.state.PiyueshitiDateStr)})}}>
                  <Text style={{color:'#87CEFA',fontSize:18}} >{'<'}   </Text>
                </TouchableOpacity>
                <Text style={{fontSize:18}}>{this.state.PiyueshitiDateStr}</Text>
                <TouchableOpacity onPress={()=>{this.setState({PiyueshitiDateStr:this.nextDay(this.state.PiyueshitiDateStr)})}}>
                  <Text style={{color:'#87CEFA',fontSize:18}} >{'>'}</Text>
                </TouchableOpacity>
                
              </View>
              <BasePicker modle={'Date'} setDateOrTime={this.setPiyueshitiDate} selected={this.state.PiyueshitiDateStr} />
            </View>
            {/* 批阅试题图表 */}
            <Piyueshiti data={this.state.piyueshitilist} date={this.state.PiyueshitiDateStr} yearTermStartTime={this.state.yearTermStartTime} yearTermEndTime={this.state.yearTermEndTime}/>
          </ScrollView>
      </View>
      )
    }
  }
}
