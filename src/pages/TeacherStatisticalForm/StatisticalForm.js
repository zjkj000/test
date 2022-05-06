import { Text, View,ScrollView,Image,Button} from 'react-native';
import React, { Component } from 'react';
import Leijishiyong from './Leijishiyong';
import Ketangshouke from './Ketangshouke';
import Buzhizuoye from './Buzhizuoye';
import Piyueshiti from './Piyueshiti';
import BasePicker from '../../utils/datetimePickerUtils/BasePicker'
import http from '../../utils/http/request'

export default class StatisticalForm extends Component {
    constructor(props){
        super(props)
        this.setBuzhizuoyeDate=this.setBuzhizuoyeDate.bind(this)
        this.setKetangshoukeDate=this.setKetangshoukeDate.bind(this)
        this.setPiyueshitiDate=this.setPiyueshitiDate.bind(this)
        this.state={
            KetangshoukeDateStr:'',
            BuzhizuoyeDateStr:'',
            PiyueshitiDateStr:'',
        }
    }

    UNSAFE_componentWillMount(){
      this.setState({
        KetangshoukeDateStr:new Date().toISOString().substring(0,10),
        BuzhizuoyeDateStr:new Date().toISOString().substring(0,10),
        PiyueshitiDateStr:new Date().toISOString().substring(0,10),
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

  render() {
    return (
      <View>
          <View style={{height:40,backgroundColor:'#FFFFFF',alignItems:'center',alignContent:'center'}}>
            <Text style={{fontSize:20,marginTop:5}}>统计报表</Text>
          </View>
          <ScrollView style={{backgroundColor:'#ECEEED',padding:10,flexDirection:'column',marginBottom:50}}>
            {/* 累计使用 */}
            <Leijishiyong data={this.state.leijishiyonglist}/>
            {/* 课堂授课标题+日历 */}
            <View style={{height:20,flexDirection:'row',justifyContent:'space-between',margin:10,alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{height:18,width:5,backgroundColor:'#47BB3E',marginRight:8}}></View>
                <Text>课堂授课</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#87CEFA'}} onPress={()=>{}}>{'<'}   </Text>
                <Text>{this.state.KetangshoukeDateStr}</Text>
                <Text style={{color:'#87CEFA'}} onPress={()=>{}}>   {'>'}</Text>
              </View>
              <BasePicker modle={'Date'} setDateOrTime={this.setKetangshoukeDate} selected={this.state.KetangshoukeDateStr}/>
            </View>
            {/* 课堂授课图表 */}
            <Ketangshouke data={this.state.ketangshoukelist} date={this.state.KetangshoukeDateStr}/>
            {/* 布置作业标题+日历 */}
            <View style={{height:20,flexDirection:'row',justifyContent:'space-between',margin:10,alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{height:18,width:5,backgroundColor:'#9518BA',marginRight:8}}></View>
                <Text>布置作业</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#87CEFA'}} onPress={()=>{}}>{'<'}   </Text>
                <Text>{this.state.BuzhizuoyeDateStr}   </Text>
                <Text style={{color:'#87CEFA'}} onPress={()=>{}}>{'>'}</Text>
              </View>
              <BasePicker modle={'Date'} setDateOrTime={this.setBuzhizuoyeDate} selected={this.state.BuzhizuoyeDateStr}/>
            </View>
            {/* 布置作业图表 */}
            <Buzhizuoye data={this.state.buzhizuoyelist} date={this.state.BuzhizuoyeDateStr}/>
            {/* 批阅试题标题+日历 */}
            <View style={{height:20,flexDirection:'row',justifyContent:'space-between',margin:10,alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{height:18,width:5,backgroundColor:'#7C67F4',marginRight:8}}></View>
                <Text>批阅试题</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#87CEFA'}} onPress={()=>{}}>{'<'}   </Text>
                <Text>{this.state.PiyueshitiDateStr}   </Text>
                <Text style={{color:'#87CEFA'}} onPress={()=>{}}>{'>'}</Text>
              </View>
              <BasePicker modle={'Date'} setDateOrTime={this.setPiyueshitiDate} selected={this.state.PiyueshitiDateStr}/>
            </View>
            {/* 批阅试题图表 */}
            <Piyueshiti data={this.state.piyueshitilist} date={this.state.PiyueshitiDateStr}/>
            </ScrollView>
      </View>
    
    );
  }
}
