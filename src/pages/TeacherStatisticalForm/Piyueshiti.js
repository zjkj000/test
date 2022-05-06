import { Text, View ,Image,StyleSheet, Dimensions} from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import MyTable from './MyTable'
import Echarts from 'native-echarts';

import http from '../../utils/http/request'
export default class Piyueshiti extends Component {
  constructor(props){
    super(props)
    this.state={
      startTime:'',
      piyuzongshu:699,
      status: 'yes',//先看该字段，no，表示没有数据；yes表示有数据
      sumNum: 848,
      tkNum: 0,
      qtNum: 848,
      tableData: [
                    ["1","高二(1)班物理","2021-12-21 16:44","2021-12-22 23:59","0","8","8"],
                    ["2","高二(1)班物理","2021-12-20 14:32","2021-12-21 23:59","0","209","209"],
                    ["3","高二(1)班物理","2021-12-16 16:42","2021-12-17 23:59","0","204","204"],
                    ["4","高二(1)班物理","2021-12-16 16:30","2021-12-18 23:59","0","425","425"],
                    ["5","高一(1)班物理","2020-11-02 22:36","2020-11-03 23:59","0","2","2"]
                  ],
      Xlist: ["高二(1)班物理","高二(1)班物理","高二(1)班物理","高二(1)班物理","高一(1)班物理"],
      tableHead: ["序号","班级","开始时间","结束时间","填空题","其它题","批阅总数"],
      Ylist: [{ "data": [0,0,0,0,0],
                "name": "填空题"},
              { "data": [8,209,204,425,2],
                "name": "其他题"}
              ]

    }
  }
  UNSAFE_componentWillMount(){
    // this.setState({startTime:this.props.date})
    this.getanayGetPGQueNum()
  }

    //第四模块数据
    getanayGetPGQueNum(){
      const url =
                "http://" +
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/teacherApp_anayGetPGQueNum.do";
      const params = {
                unitId:'6105230000008',                   //单位id
                userId:'cjzx2028',
                startTime:'2021-12-17 00:00:00',
                endTime:'2021-12-22 00:00:00',       
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
      legend: {},
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
          <View style={{flex:1,justifyContent:'center'}}  ><Image source={require('../../assets/StatisticalForm/Ima_piyue.png')}></Image></View>
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
          <MyTable tablehead={this.state.tableHead} data={this.state.tableData}/>
        </View>
        <View style={{justifyContent:'center',flexDirection:'row'}}>
            <Text style={{color:'#87CEFA'}} >查看全部{' >>'}</Text>
        </View>
  </View>
    )
  }
}