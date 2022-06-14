import { Text, View,Image,StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native'
import React, { Component } from 'react'
let {width, height} = Dimensions.get('window');
import Echarts from 'native-echarts';
import MyTable from './MyTable'
import http from '../../utils/http/request'
import { useNavigation } from '@react-navigation/native';
export default function Ketangshouke(props) {
  const navigation = useNavigation()
  return (
    <KetangshoukeContent navigation={navigation}/>
  )
} 

class KetangshoukeContent extends Component {
    constructor(props){
        super(props)
        this.state={
            KetangTableNum:3,
            status: 'yes' ,               //先看该字段，no，表示没有数据；yes表示有数据
            hdNum:  9,                //互动数量
            xList: ["提问","抢答","随机","连答"],
            contentNum: 4, //内容数量
            effectiveKeci: 2.5, //有效课次
            yList: [ 0, 0, 10, 0],
            tableData:[],
            sumKeci : 3, //总课次
            tableHead: ["序号", "班级", "时间", "内容", "批注", "板书", "互动","有效课次"],
            pzNum: 13, //批注数量
            bsNum: 9 ,  //板书课次
            startTime:'',
            endTime:'',
        }
      }

      UNSAFE_componentWillMount(){
        this.getanayGetKTNum()
      }

    //第二模块数据
    getanayGetKTNum(){
      const url =
                "http://" +
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/teacherApp_anayGetKTNum.do";
      const params = {
                unitId:'6105230000001',                   //单位id
                userId:'dlzx2019',
                startTime:'2021-12-27%2000:00:00',
                endTime:'2021-12-29%2000:00:00',       
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
        <View style={{flexDirection:'row',marginLeft:20,marginRight:10,marginBottom:10}}>
                <View style={{flex:1,justifyContent:'center'}}  >
                      <Image source={require('../../assets/StatisticalForm/Ima_ketang.png')}></Image>
                </View>
                <View style={{flex:5,flexDirection:'row',justifyContent:'space-evenly'}}>
                    <View>
                        <View style={{height:50}}>
                            <Text style={{fontSize:18}}>有效课次</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                            <Text style={{fontSize:30,color:'#3BBF36'}}>{this.state.effectiveKeci}</Text>
                            <Text style={{fontSize:20}}>/{this.state.sumKeci}</Text>
                    </View>
                
                    </View>
                    <View style={{flexDirection:'column',padding:10,paddingRight:0}}>
                        <View style={{flexDirection:'row',alignContent:'space-around'}}>
                            <View style={{margin:10}}><Text style={{fontSize:20}}>内容:{this.state.contentNum}</Text></View>
                            <View style={{margin:10}}><Text style={{fontSize:20}}>互动:{this.state.hdNum}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',alignContent:'space-around'}}>
                            <View style={{margin:10}}><Text style={{fontSize:20}}>批注:{this.state.pzNum}</Text></View>
                            <View style={{margin:10}}><Text style={{fontSize:20}}>板书:{this.state.bsNum}</Text></View>
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
                    <MyTable data={this.state.tableData.length>this.state.KetangTableNum?this.state.tableData.slice(0,this.state.KetangTableNum):this.state.tableData} 
                             tablehead={this.state.tableHead}/>
                </View>
                {this.state.tableData.length>this.state.KetangTableNum?(
                  <View style={{justifyContent:'center',flexDirection:'row'}}>
                    <Text  onPress={()=>this.setState({KetangTableNum:this.state.tableData.length})
                      }  style={{color:'#87CEFA'}} >查看全部{' >>'}</Text>
                  </View>
                ):this.state.tableData.length<=3?(<View></View>):
                (<View style={{justifyContent:'center',flexDirection:'row'}}>
                <Text  onPress={()=>this.setState({KetangTableNum:3})
                  }  style={{color:'#87CEFA'}} >收起{' >>'}</Text>
              </View>)}
            
                
        </View>
    )
  }
}