import { Text, View ,Image,StyleSheet, Dimensions} from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import MyTable from './MyTable'
import Echarts from 'native-echarts';

import http from '../../utils/http/request'
import { useNavigation } from '@react-navigation/native';
export default function Piyueshiti(props) {
  const navigation = useNavigation()
  const yearTermStartTime = props.yearTermStartTime
  const yearTermEndTime = props.yearTermEndTime
  return (
    <PiyueshitiContent navigation={navigation} yearTermStartTime={yearTermStartTime} yearTermEndTime={yearTermEndTime}/>
  )
}class PiyueshitiContent extends Component {
  constructor(props){
    super(props)
    this.state={
      PiuyueshitiTableNum:3,
      startTime:'',
      piyuzongshu:0,
      status: '',//先看该字段，no，表示没有数据；yes表示有数据
      sumNum: 0,
      tkNum: 0,
      qtNum: 0,
      tableData: [
                    
                  ],
      Xlist: ["","","","",""],
      tableHead: ["序号","班级","开始时间","结束时间","填空题","其它题","批阅总数"],
      Ylist: [{ "data": [0,0,0,0,0],
                "name": "填空题"},
              { "data": [0,0,0,0,0],
                "name": "其他题"}
              ]

    }
  }
  UNSAFE_componentWillMount(){
    // this.setState({startTime:this.props.date})
    this.getanayGetPGQueNum(this.props.yearTermStartTime,this.props.yearTermEndTime)
  }
  UNSAFE_componentWillReceiveProps(nextprops){
    if(nextprops.yearTermStartTime!=this.state.yearTermStartTime){
      this.getanayGetPGQueNum(nextprops.yearTermStartTime,nextprops.yearTermEndTime)
    }
  }

    //第四模块数据
    getanayGetPGQueNum(startTime,endTime){
      const url =
                "http://" +
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/teacherApp_anayGetPGQueNum.do";
      const params = {
                unitId:global.constants.company,                   //单位id
                userId:global.constants.userId,
                startTime:startTime,
                endTime:endTime,       
              }
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
              if(resJson.data.status=='yes'){
                this.setState({
                  status:resJson.data.status,
                  sumNum: resJson.data.sumNum,
                  tkNum: resJson.data.tkNum,
                  qtNum: resJson.data.qtNum,
                  tableData: resJson.data.tableData,
                  Xlist:resJson.data.Xlist,
                  tableHead:resJson.data.tableHead,
                  Ylist: resJson.data.Ylist})
              }else{
                this.setState({
                  status:resJson.data.status})
              }
              
            }
        })
    }

  render() {
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {
        data: ["其它题", "填空题"],
        right:'5%'},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: this.state.Xlist
      },
      title: [
          {
            text: '试题数量'
          }
        ],
      series: [
        {
          name: this.state.Ylist[1].name,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          color:['#FFD700'],
          data: this.state.Ylist[1].data
        },
        {
          name: this.state.Ylist[0].name,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          color:['#87CEFA'],
          data: this.state.Ylist[0].data
        }
      ]
    };

    return (
        <View style={{backgroundColor:'#FFFFFF',flexDirection:'column',paddingBottom:20}}>
        <View style={{flexDirection:'row',marginLeft:20,marginTop:20}}>
          <View style={{flex:1,justifyContent:'center'}}  ><Image style={{width:70,height:70}} source={require('../../assets/StatisticalForm/Ima_piyue.png')}></Image></View>
          <View style={{flex:5,flexDirection:'row',justifyContent:'space-evenly'}}>
              <View style={{flexDirection:'column'}}>
                  <Text style={{flex:1,fontSize:18}}>批阅总数</Text>
                  <Text style={{flex:2,fontSize:30,color:'#7B70BE'}}>{this.state.sumNum}</Text>
              </View>
              <View style={{flexDirection:'column',padding:10}}>
                    <View style={{margin:10}}><Text style={{fontSize:20}}>填空题:{this.state.tkNum}</Text></View>
                    <View style={{margin:10}}><Text style={{fontSize:20}}>其它题:{this.state.qtNum}</Text></View>
              </View>
          </View>
        </View>
        <View>
          <Echarts option={option} height={250} width={width-20} />
        </View>
        <View>
          {this.state.tableData.length>0?(
            <MyTable data={this.state.tableData.length>this.state.PiuyueshitiTableNum?this.state.tableData.slice(0,this.state.PiuyueshitiTableNum):this.state.tableData} 
                             tablehead={this.state.tableHead}/>
          ):(<></>)}
                             </View>
        {this.state.tableData.length>this.state.PiuyueshitiTableNum?(
                  <View style={{justifyContent:'center',flexDirection:'row'}}>
                    <Text  onPress={()=>this.setState({PiuyueshitiTableNum:this.state.tableData.length})
                      }  style={{color:'#87CEFA'}} >查看全部{' >>'}</Text>
                  </View>
                ):this.state.tableData.length>3?(<View style={{justifyContent:'center',flexDirection:'row'}}>
                <Text  onPress={()=>this.setState({PiuyueshitiTableNum:3})
                  }  style={{color:'#87CEFA'}} >收起{' >>'}</Text>
              </View>):
                (<View></View>)}
  </View>
    )
  }
}