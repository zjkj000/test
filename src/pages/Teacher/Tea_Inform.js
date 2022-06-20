
import React, { Component } from 'react'
import {StyleSheet,
    View,
    Text,
    Image,
    ScrollView,TouchableOpacity
} from "react-native";

import { Button } from '@ui-kitten/components';
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import '../../utils/global/constants';
import { useNavigation } from '@react-navigation/native';

export default function Tea_Inform(props) {
    const navigation =useNavigation();
    const taskId = props.route.params.taskId
    const type = props.route.params.type
    const data = props.route.params.data
    return (
        <Tea_Informcontent navigation={navigation} type={type} taskId={taskId} data={data}/>
    )
}

class Tea_Informcontent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classTimeId:'',
      type:'',
      content:'',
      title:'',
      noticeId:'',
      num:'',
      readNum:'',
      readList:[],
      noReadNum:'',
      noreadList:[],
      selectReadStuListType:'',    //  0 都没选   1 查看已读    2 查看未读
      isAuthor: false,   //true，则显示修改与撤回按钮，false不显示
		  isUpdate: false   //true,则修改按钮可以点击，false不可点击
     };
  }

  //http://192.168.1.57:8080/AppServer/ajax/studentApp_readNotice.do?userName=UN97221&type=3&classTimeId=13033&callback=ha

  //修改通知或公告的状态,暂时没有
  updateStatus =  (status , todoType , learnId) => {
        const token = global.constants.token;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl
        const url = ip + "studentApp_readNotice.do";
        const params ={
            userName: userId,
            type: todoType,    //type=3表示通知，4表示公告
            classTimeId: learnId, 
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            // console.log('resStr' , resStr);
            // console.log('此通知或公告状态已修改为已读');
            return ;
        })
  };
 

  updateInform(){
    const url =
        "http://" +
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/teacherApp_getNoticeInfo.do";
    const params = {
            noticeId:'',
            type:'',           //类型：3  通知  4  公告
            token:global.constants.token 
        };
    http.get(url, params).then((resStr) => {
        let resJson = JSON.parse(resStr);
        if(resJson.success){

              //通知返回数据格式，用于回显
              // {
              //   "message": "获取成功！",
              //   "data": {
              //     "content": "中秋节到了，放假通知",//内容
              //     "setDate":XXXXXX,//定时任务时间
              //     "title": "中秋节快乐",//标题
              //     "classId": "164",//班级id
              //     "className": "一年级二班"//班级名称
              //   },
              //   "success": true
              // }
              // //公告返回数据格式，用于回显
              // {
              //   "message": "获取成功！",
              //   "data": {
              //     "content": "国庆节就要到了，按规定所有学生放假，高三学生1号到3号休息，4号返校进行上课，相关老师安排好时间，个部门安排好值班人员",
              //     "setDate":XXXXXX,
              //     "title": "国庆节放假公告",
              //     "type": 0//0全部；1全部老师；2全部学生,3置空，都不选择
              //   },
              //   "success": true
              // }

        }
      })
  }
  deleteInform(){
    const url =
        "http://" +
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/teacherApp_ deleteNotice.do";
    const params = {
              noticeId:'',
              token:global.constants.token  
        };
    http.get(url, params).then((resStr) => {
        let resJson = JSON.parse(resStr);
        if(resJson.success){

        }
      })
  }
  
  fetchData(fid,type){
    const url =
        "http://" +
        "www.cn901.net" +
        ":8111" +
        "/AppServer/ajax/teacherApp_lookNotice.do";
    const params = {
              classTimeId:fid,
              type:type,
              userName:global.constants.userName  
        };
    http.get(url, params).then((resStr) => {
        let resJson = JSON.parse(resStr);
        if(resJson.success){
            this.setState({
              content:resJson.data.content,
              title:resJson.data.title,
              num:resJson.data.num,
              readList:resJson.data.readList,
              readNum:resJson.data.readNum,
              noReadNum:resJson.data.noReadNum,
              noreadList:resJson.data.noreadList,
              isAuthor:resJson.data.isAuthor,
              isUpdate:resJson.data.isUpdate
            })
        }
      })
  }

  UNSAFE_componentWillMount(){
    this.setState({taskId:this.props.taskId,type:this.props.type})
    this.fetchData(this.props.taskId,this.props.type)
  }
  
  render() {
    return (
      <View style={{backgroundColor:'#fff'}}>
            <ScrollView style={{width:screenWidth,height:screenHeight*0.92}}>
                {/* *未读的通知或公告将调用Api修改状态 */}
                {/* {(status == 5)? (this.updateStatus(status , type , learnId)) : null} */}
                <View style={{paddingBottom:20,borderBottomWidth:0.5}}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Flex style={styles.flexContent}>
                        <Flex.Item style={styles.createrNameImg}>
                            <Image source={require('../../assets/LatestTaskImages/teName.png')} />
                        </Flex.Item>
                        <Flex.Item style={styles.createrNameText}>
                            <Text>名字</Text>
                        </Flex.Item>
                        <Flex.Item style={styles.timeImg}>
                            <Image source={require('../../assets/LatestTaskImages/timeClock.png')} />
                        </Flex.Item>
                        <Flex.Item style={styles.timeText}>
                            <Text>{this.props.data.fTime}</Text>
                        </Flex.Item>
                    </Flex>
                    <Text style={styles.content}>{this.state.content}</Text>
                </View> 

                <View style={{paddingTop:20}}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{width:'50%',justifyContent:'center',flexDirection:'row',padding:10,backgroundColor:this.state.selectReadStuListType=='1'?'#C0C0C0':'#fff'}}>
                      <Text>已读学生:(</Text>
                      <Text style={{color:'#59B9E0'}}>{this.state.readNum}</Text>
                      <Text style={{marginRight:10}}>/{this.state.num})</Text>
                      <TouchableOpacity onPress={()=>{
                        if(this.state.selectReadStuListType=='1'){
                          this.setState({selectReadStuListType:'0'})
                        }else{
                          this.setState({selectReadStuListType:'1'})
                        }
                      
                      }}>
                        {this.state.selectReadStuListType=='1'?(
                          <Image style={{width:20,height:20}} source={require('../../assets/photoImage/top.png')}></Image>):(
                          <Image style={{width:20,height:20}} source={require('../../assets/photoImage/bot.png')}></Image>
                          )}
                      </TouchableOpacity>
                    </View>
                    <View style={{width:'50%',justifyContent:'center',flexDirection:'row',padding:10,backgroundColor:this.state.selectReadStuListType=='2'?'#C0C0C0':'#fff'}}>
                      <Text>未读学生:(</Text>
                      <Text style={{color:'#59B9E0'}}>{this.state.noReadNum}</Text>
                      <Text style={{marginRight:10}}>/{this.state.num})</Text>
                      <TouchableOpacity onPress={()=>{
                        if(this.state.selectReadStuListType=='2'){
                          this.setState({selectReadStuListType:'0'})
                        }else{
                          this.setState({selectReadStuListType:'2'})
                        }
                      }}>
                        {this.state.selectReadStuListType=='2'?(
                          <Image style={{width:20,height:20}} source={require('../../assets/photoImage/top.png')}></Image>):(
                          <Image style={{width:20,height:20}} source={require('../../assets/photoImage/bot.png')}></Image>
                          )}
                      </TouchableOpacity>
                    </View>
                  </View>
                {this.state.selectReadStuListType=='1'?(
                  <View style={{padding:15,backgroundColor:'#C0C0C0'}}>
                      <Text style={{fontSize:15}}>{this.state.readList.join()}</Text>
                  </View>
                ):this.state.selectReadStuListType=='2'?(
                  <View style={{padding:15,backgroundColor:'#C0C0C0'}}>
                      <Text style={{fontSize:15}}>{this.state.noreadList.join()}</Text>
                  </View>
                ):(<></>)}
                </View>

            </ScrollView>
            {/* 是否显示两个按钮 */}
            {this.state.isAuthor?(
              <View style={{width:'100%',position:'absolute',bottom:10,flexDirection:'row',justifyContent:'space-around',backgroundColor:'#fff'}}>
                <Button accessible={this.state.isUpdate} onPress={()=>{
                  if(this.state.isUpdate){
                    //可以修改
                    this.updateInform()
                  }
                }} style={{backgroundColor:this.state.isUpdate?'#62C3E4':'#A9A9A9',width:'40%'}}>修改</Button>
                <Button style={{width:'40%'}} onPress={()=>{
                  //可以撤回
                  this.deleteInform()
                }}>撤回</Button>
              </View>
            ):(<View style={{backgroundColor:'#fff'}}></View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    flexContent: {
      paddingLeft: screenWidth*0.25,
      paddingRight: screenWidth*0.25,
      marginBottom: 20,
    },
    createrNameImg: {
      flex:1,
    },
    createrNameText: {
      flex:2,
    },
    timeImg: {
      flex:1,
    },
    timeText: {
      flex:2,
    },
    content: {
      fontSize: 16,
      marginRight:20,
      marginLeft:20
    },
});