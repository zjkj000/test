import { Text, View ,Image,StyleSheet, Dimensions} from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import MyTable from './MyTable'
import Echarts from 'native-echarts';

import http from '../../utils/http/request'
import { useNavigation } from '@react-navigation/native';
import { screenWidth } from '../../utils/Screen/GetSize';
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
      const url = global.constants.baseUrl+"teacherApp_anayGetPGQueNum.do";
      const params = {
                unitId:global.constants.company,                   //单位id
                userId:global.constants.userId,
                startTime:startTime,
                endTime:endTime,    
                // unitId:'6105230000001',                   //单位id
                // userId:'dlzx2019',
                // startTime:'2021-12-27 00:00:00',
                // endTime:'2021-12-29 00:00:00',    
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
        <View style={{flexDirection:'row',marginLeft:10,marginTop:20}}>
          <View style={{flex:3,justifyContent:'space-between',flexDirection:'row'}}  >
            <Image style={{width:screenWidth*0.24,height:screenWidth*0.24}} source={require('../../assets/StatisticalForm/Ima_piyue.png')}></Image>
            <View style={{alignItems:'flex-start'}}>
                        <View style={{height:30}}>
                            <Text style={{fontSize:16}}>批阅总数:</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'baseline'}}>
                        <Text style={{fontSize:50,color:'#7B70BE'}}>{this.state.sumNum}</Text>
                        </View>
              </View>
          </View>
          <View style={{flex:3,flexDirection:'row',justifyContent:'space-evenly'}}>
              <View style={{flexDirection:'column',padding:10,paddingTop:0}}>
                    <View style={{margin:10,flexDirection:'row',alignItems:'baseline',marginTop:0}}><Text style={{fontSize:18}}>填空题:</Text>
                    <Text style={{fontSize:25,marginLeft:5}}>{this.state.tkNum}</Text></View>
                    <View style={{margin:10,flexDirection:'row',alignItems:'baseline'}}><Text style={{fontSize:18}}>其它题:</Text>
                    <Text style={{fontSize:25,marginLeft:5}}>{this.state.qtNum}</Text></View>
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
                      }  style={{color:'#87CEFA',fontSize:18}} >查看全部{' >>'}</Text>
                  </View>
                ):this.state.tableData.length>3?(<View style={{justifyContent:'center',flexDirection:'row'}}>
                <Text  onPress={()=>this.setState({PiuyueshitiTableNum:3})
                  }  style={{color:'#87CEFA',fontSize:18}} >收起{' >>'}</Text>
              </View>):
                (<View></View>)}
  </View>
    )
  }
}