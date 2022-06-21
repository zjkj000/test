import { Text, View,Image,StyleSheet, Dimensions } from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import Echarts from 'native-echarts';
import MyTable from './MyTable'
import http from '../../utils/http/request'
import { useNavigation } from '@react-navigation/native';
export default function Buzhizuoye() {
  const navigation = useNavigation()
  return (
    <BuzhizuoyeContent navigation={navigation}/>
  )
}
class BuzhizuoyeContent extends Component {
  constructor(props){
    super(props)
    this.state={
      BuzhizuoyeTableNum:3,
      startTime:'',
      effectiveKeciNum: '2.10',   //有效次数
      queSumNum: 30,             //试题总数
      queAvgNum: 7,             //平均试题数
      sumKeciNum: 4,             //总次数
      status:'yes',             //先看该字段，no，表示没有数据；yes表示有数据
      X1List: [
        {"data": [88.1,100,4.76,100],
          "name": "提交率"},
        {"data": [100,100,100,100],
          "name": "批改率"}
      ],
      X2List: [
        {"data": [30,30,104,104],
          "name": "总分"
        },
        {"data": [22.4,27.5,32.5,88.5],
          "name": "平均分"
        },
        {"data": [74.67,91.67,31.25,85.1],
          "name": "得分率"
        }
      ],
      tableHead:[],
      tableData:[],
      classNameList: ["高二(1)班","高二(2)班","高二(3)班","高二(4)班"],
    }
  }
  
  UNSAFE_componentWillMount(){
    this.getanayGetBZZYNum()
  }
  //第三模块数据
  getanayGetBZZYNum(){
    const url =
              "http://" +
              "www.cn901.net" +
              ":8111" +
              "/AppServer/ajax/teacherApp_anayGetBZZYNum.do";
    const params = {
              unitId:'6105230000008',                   //单位id
              userId:'cjzx2028',
              startTime:'2021-12-17%2000:00:00',
              endTime:'2021-12-22%2000:00:00',       
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
        <View style={{backgroundColor:'#FFFFFF',flexDirection:'column',paddingTop:20,paddingBottom:20}}>
        <View style={{flexDirection:'row',marginLeft:20,marginRight:20}}>
          <View style={{flex:1,justifyContent:'center'}}  >
            <Image source={require('../../assets/StatisticalForm/Ima_book.png')}></Image>
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
          <MyTable data={this.state.tableData.length>this.state.BuzhizuoyeTableNum?this.state.tableData.slice(0,this.state.BuzhizuoyeTableNum):this.state.tableData} tablehead={this.state.tableHead}/>
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