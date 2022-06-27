import { Text, View,Image,StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import Echarts from 'native-echarts';
import MyTable from './MyTable'
import http from '../../utils/http/request'
import { useNavigation } from '@react-navigation/native';
export default function Ketangshouke(props) {
  const navigation = useNavigation()
  const yearTermStartTime = props.yearTermStartTime
  const yearTermEndTime = props.yearTermEndTime
  return (
    <KetangshoukeContent navigation={navigation} yearTermStartTime={yearTermStartTime} yearTermEndTime={yearTermEndTime}/>
  )
} 

class KetangshoukeContent extends Component {
    constructor(props){
        super(props)
        this.state={
            KetangTableNum:3,
            status: '' ,               //先看该字段，no，表示没有数据；yes表示有数据
            hdNum:  0,                //互动数量
            xList: [],
            contentNum: 0, //内容数量
            effectiveKeci: 0, //有效课次
            yList: [],
            tableData:[],
            sumKeci : 0, //总课次
            tableHead: [],
            pzNum: 0, //批注数量
            bsNum: 0 ,  //板书课次
            startTime:'',
            endTime:'',
        }
      }

      UNSAFE_componentWillMount(){
        this.getanayGetKTNum(this.props.yearTermStartTime,this.props.yearTermEndTime)
      }
      UNSAFE_componentWillReceiveProps(nextprops){
        if(nextprops.yearTermStartTime!=this.state.yearTermStartTime){
          this.getanayGetKTNum(nextprops.yearTermStartTime,nextprops.yearTermEndTime)
        }
      }

    //第二模块数据
    getanayGetKTNum(startTime,endTime){
      const url = global.constants.baseUrl+"teacherApp_anayGetKTNum.do";
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
                  status: resJson.data.status ,         
                  hdNum: resJson.data.hdNum,
                  xList:resJson.data.xList,
                  contentNum:resJson.data.contentNum, 
                  effectiveKeci: resJson.data.effectiveKeci,   //有效课次
                  yList: resJson.data.yList,
                  tableData:resJson.data.tableData,
                  umKeci : resJson.data.sumKeci,                //总课次
                  tableHead: resJson.data.tableHead,
                  pzNum:resJson.data.pzNum,                   //批注数量
                  bsNum:resJson.data.bsNum                    //板书课次
                })  
              }else{
                this.setState({status: resJson.data.status})  
              }
              
            }
        })
    }
    showAllDetailes(){
      this.props.navigation.navigate({name:'CreatePicturePaperWork'})
    }
      
   
  render() {
    let option = {
        xAxis: {
          data: this.state.xList
        },
        yAxis: {
          type: 'value'
        },
        title: [
          {
            text: '课堂情况'
          }
        ],
        series: [
          {
            data: this.state.yList,
            type: 'bar',
            color: ['#7FFFD4'],
          }
        ]
      };
    return (
        <View style={{backgroundColor:'#FFFFFF',flexDirection:'column',paddingTop:20,paddingBottom:20}}>
        <View style={{flexDirection:'row',marginLeft:10,marginRight:10,marginBottom:10}}>
                <View style={{flex:1,justifyContent:'center'}}  >
                      <Image style={{width:70,height:70}} source={require('../../assets/StatisticalForm/Ima_ketang.png')}></Image>
                </View>
                <View style={{flex:3,flexDirection:'row',justifyContent:'space-evenly'}}>
                    <View>
                        <View style={{height:30}}>
                            <Text style={{fontSize:16}}>有效课次:</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                            <Text style={{fontSize:50,color:'#3BBF36'}}>{this.state.effectiveKeci}</Text>
                            <Text style={{fontSize:25}}>/{this.state.sumKeci}</Text>
                    </View>
                
                    </View>
                    <View style={{flexDirection:'column',padding:10,paddingRight:0}}>
                        <View style={{flexDirection:'row',alignContent:'space-around'}}>
                            <View style={{margin:10,flexDirection:'row',alignItems:'flex-end'}}>
                              <Text style={{fontSize:16}}>内容:</Text>
                              <Text style={{fontSize:25,marginLeft:5}}>{this.state.contentNum}</Text>
                            </View>
                            <View style={{margin:10,flexDirection:'row',alignItems:'flex-end'}}>
                              <Text style={{fontSize:16}}>互动:</Text>
                              <Text style={{fontSize:25,marginLeft:5}}>{this.state.hdNum}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',alignContent:'space-around'}}>
                            <View style={{margin:10,flexDirection:'row',alignItems:'flex-end'}}>
                              <Text style={{fontSize:16}}>批注:</Text>
                              <Text style={{fontSize:25,marginLeft:5}}>{this.state.pzNum}</Text>
                            </View>
                            <View style={{margin:10,flexDirection:'row',alignItems:'flex-end'}}>
                              <Text style={{fontSize:16}}>板书:</Text>
                              <Text style={{fontSize:25,marginLeft:5}}>{this.state.bsNum}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                </View>
                <View style={{marginLeft:10,marginRight:10}}>
                    <View>
                        <Echarts option={option} height={250} width={width-20} />
                    </View>
                </View>
                <View>
                  {this.state.tableData.length>0?(
                    <MyTable data={this.state.tableData.length>this.state.KetangTableNum?this.state.tableData.slice(0,this.state.KetangTableNum):this.state.tableData} 
                             tablehead={this.state.tableHead}/>
                             ):(<></>)}
                    
                </View>
                {this.state.tableData.length>this.state.KetangTableNum?(
                  <View style={{justifyContent:'center',flexDirection:'row'}}>
                    <Text  onPress={()=>this.setState({KetangTableNum:this.state.tableData.length})
                      }  style={{color:'#87CEFA',fontSize:18}} >查看全部{' >>'}</Text>
                  </View>
                ):this.state.tableData.length<=3?(<View></View>):
                (<View style={{justifyContent:'center',flexDirection:'row'}}>
                <Text  onPress={()=>this.setState({KetangTableNum:3})
                  }  style={{color:'#87CEFA',fontSize:18}} >收起{' >>'}</Text>
              </View>)}
            
                
        </View>
    )
  }
}