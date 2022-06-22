import { Text, View,Image,StyleSheet, Dimensions } from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import Echarts from 'native-echarts';
import MyTable from './MyTable'
import http from '../../utils/http/request'
import { useNavigation } from '@react-navigation/native';
export default function Buzhizuoye(props) {
  const navigation = useNavigation()
  const yearTermStartTime = props.yearTermStartTime
  const yearTermEndTime = props.yearTermEndTime
  return (
    <BuzhizuoyeContent navigation={navigation} yearTermStartTime={yearTermStartTime} yearTermEndTime={yearTermEndTime}/>
  )
}
class BuzhizuoyeContent extends Component {
  constructor(props){
    super(props)
    this.state={
      BuzhizuoyeTableNum:3,
      startTime:'',
      effectiveKeciNum: '0',   //有效次数
      queSumNum: 0,             //试题总数
      queAvgNum: 0,             //平均试题数
      sumKeciNum: 0,             //总次数
      status:'',             //先看该字段，no，表示没有数据；yes表示有数据
      X1List: [
        {"data": [],
          "name": "提交率"},
        {"data": [],
          "name": "批改率"}
      ],
      X2List: [
        {"data": [],
          "name": "总分"
        },
        {"data": [],
          "name": "平均分"
        },
        {"data": [],
          "name": "得分率"
        }
      ],
      tableHead:[],
      tableData:[],
      classNameList: [],
    }
  }
  
  UNSAFE_componentWillMount(){
    this.getanayGetBZZYNum(this.props.yearTermStartTime,this.props.yearTermEndTime)
  }

  UNSAFE_componentWillReceiveProps(nextprops){
    if(nextprops.yearTermStartTime!=this.state.yearTermStartTime){
      this.getanayGetBZZYNum(nextprops.yearTermStartTime,nextprops.yearTermEndTime)
    }
  }
  //第三模块数据
  getanayGetBZZYNum(startTime,endTime){
    const url =
              "http://" +
              "www.cn901.net" +
              ":8111" +
              "/AppServer/ajax/teacherApp_anayGetBZZYNum.do";
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
                effectiveKeciNum: resJson.data.effectiveKeciNum,  
                queSumNum: resJson.data.queSumNum,
                queAvgNum: resJson.data.queAvgNum,
                sumKeciNum:resJson.data.sumKeciNum,
                status:resJson.data.status,
                X1List:resJson.data.X1List,
                X2List:resJson.data.X2List,
                tableHead:resJson.data.tableHead,
                tableData:resJson.data.tableData,
                classNameList:resJson.data.classNameList,
              })
            }else{
              this.setState({status:resJson.data.status})
            }
            
          }
      })
  }

  render() {
    let option = {
      title: {
        text: '提交率/批改率'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ["提交率", "批改率"],
        right:'3%'},
        
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: this.state.classNameList
      },
      series: [
        {
          name: this.state.X1List[0].name,
          type: 'bar',
          color:['#00CED1'],
          data: this.state.X1List[0].data
        },
        {
          name: this.state.X1List[1].name,
          type: 'bar',
          color:['#DDA0DD'],
          data: this.state.X1List[1].data
        }
      ]
    };
    
    let option1 = {
      title: {
          text: '得分率'
        },
        
      legend: {
        data: ["总分", "平均分"],
        right:'3%'},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
  
      xAxis: [
        { data: this.state.classNameList,
          axisLabel : {
            interval:0,
            rotate:"30"
          },
          axisPointer: {
            type: 'shadow',
            color:'red',
            
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '分数',
          min: 0,
          max: 110,
          interval: 20,
        },
        {
          type: 'value',
          name: '得分率',
          min: 0,
          max: 110,
          interval: 20,
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: this.state.X2List[0].name,
          type: 'bar',
          color:['#F0E68C'],
          data: this.state.X2List[0].data
        },
        {
          name: this.state.X2List[1].name,
          type: 'bar',
          color:['#48D1CC'],
          data: this.state.X2List[1].data
        },
        {
          name: this.state.X2List[2].name,
          type:'line',
          yAxisIndex: 1,
          color:['#6A5ACD'],
          tooltip: {
            valueFormatter: function (value) {
              return value+'%';
            }
          },
          data: this.state.X2List[2].data
        }
      ]
    };
    
    return (
        <View style={{backgroundColor:'#FFFFFF',flexDirection:'column',paddingTop:20,paddingBottom:10}}>
        <View style={{flexDirection:'row',marginLeft:20,marginRight:20}}>
          <View style={{flex:1,justifyContent:'center'}}  >
            <Image style={{width:70,height:70}} source={require('../../assets/StatisticalForm/Ima_book.png')}></Image>
          </View>
          <View style={{flex:5,flexDirection:'row',justifyContent:'space-evenly'}}>
              <View>
                <View style={{height:50}}>
                  <Text style={{fontSize:18}}>有效次数</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                    <Text style={{fontSize:30,color:'#9A07D1'}}>{this.state.effectiveKeciNum}</Text>
                    <Text style={{fontSize:20}}>/{this.state.sumKeciNum}</Text>
                </View>
          </View>
          <View style={{flexDirection:'column',padding:10}}>
                  <View style={{margin:10}}><Text style={{fontSize:20}}>试题总数:{this.state.queSumNum}</Text></View>
                  <View style={{margin:10}}><Text style={{fontSize:20}}>平均题数:{this.state.queAvgNum}</Text></View>
          </View>
        </View>
    </View>
        <View style={{marginBottom:10}}>
            <Echarts option={option} height={250} width={width-40} />
        </View>
        <View>
            <Echarts option={option1} height={250} width={width-40}/>
        </View>
        <View>
          {this.state.tableData.length>0?(
            <MyTable data={this.state.tableData.length>this.state.BuzhizuoyeTableNum?this.state.tableData.slice(0,this.state.BuzhizuoyeTableNum):this.state.tableData} tablehead={this.state.tableHead}/>
          ):(<></>)}
        </View>
        {this.state.tableData.length>this.state.BuzhizuoyeTableNum?(
                  <View style={{justifyContent:'center',flexDirection:'row'}}>
                    <Text  onPress={()=>this.setState({BuzhizuoyeTableNum:this.state.tableData.length})
                      }  style={{color:'#87CEFA'}} >查看全部{' >>'}</Text>
                  </View>
                ):this.state.tableData.length<=3?(<View></View>):
                (<View style={{justifyContent:'center',flexDirection:'row'}}>
                <Text  onPress={()=>this.setState({BuzhizuoyeTableNum:3})
                  }  style={{color:'#87CEFA'}} >收起{' >>'}</Text>
              </View>)}
        
  </View>
    )
  }
}