import { Button, ScrollView, Text, View,StyleSheet,Alert,TouchableOpacity,Dimensions } from 'react-native'
import React, { Component, useState } from 'react'
import http from '../../../utils/http/request'
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import Loading from '../../../utils/loading/Loading'
// 提交导学案页面
export default function Learningguide_SubmitContainer(props) {
  const start_date = props.route.params.startdate;
  const navigation = useNavigation();
  navigation.setOptions({title:props.route.params.papername})
  const paperId = props.route.params.paperId;
  const submit_status = props.route.params.submit_status;
  const papername = props.route.params.papername
  const isallObj = props.route.params.isallObj
  return <Learningguide_Submit navigation={navigation} 
                  startdate={start_date}  paperId={paperId}
                  submit_status={submit_status} 
                  papername = {papername}  isallObj={isallObj}/>;
}


class Learningguide_Submit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isallObjective:true , //用于记录是否全是客观题
            paperId:'',
            success:false,
            data:[],
            submit_status:'',
            startdate:'', 
         }
    }

    //页面加载在render之前 
    UNSAFE_componentWillMount(){
      // let bool = (this.props.isallObj.indexOf('104')>-1)||(this.props.isallObj.indexOf('106')>-1)?false:true
     let bool =false
      this.setState({
        start_date: this.props.startdate?this.props.startdate:this.getDate(),
            paperId:this.props.paperId,
            submit_status:this.props.submit_status,
            isallObjective:bool
      })
      
        //先将接收到的 paperId  submit_tatus参数接收赋值进去
        //根据导学案ID  和用户姓名  请求  答题的内容
        const url = 
                  "http://"+
                  "www.cn901.net" +
                  ":8111" +
                  "/AppServer/ajax/studentApp_getstuAnswerLearnPlanList.do"
        const params ={
                    learnPlanId : this.props.paperId,
                    userName : global.constants.userName,
                  }
        //用于获取
        if(!this.state.success){
          http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            this.setState({ success:resJson.success,
            data:resJson.data,})      
          })}

    }

    //获取时间
    getDate() {
      var date = new Date();
      var hour =  date.getHours().toString();
      var minute = date.getMinutes().toString();
      var seconds = date.getSeconds();
      return( hour+':'+minute+':'+seconds);
  }


    submit_answer(){
            const url = 
                  "http://"+
                  "www.cn901.net" +
                  ":8111" +
                  "/AppServer/ajax/studentApp_saveStudentHomeWork.do"

            //判断一下未做作业的题目ID
            let change_status= 0;
            //判断一下作业提交状态  ‘1’.第一次提交  ‘3’修改提交
            if(this.state.submit_status=0){
              change_status=1;
            }else if(this.state.isallObjective){
              //全是客观题   就直接批阅
              change_status=2;
            }else{
              change_status=3;
            }
            console.log('提交作业之后的状态',change_status)
            
            
            var noSubmitID ='';
            this.state.data.map(function(index,item){
              if(item.stuAnswer==''){
                noSubmitID+=noSubmitID+item.questionId+',';
              }
            })
            if(noSubmitID==''){noSubmitID='-1'}
            
            var answerdate = 0;
            var nowdate = this.getDate();
            var startdatearr = this.props.startdate.split(':')
            var nowdatearr = nowdate.split(':')
            if(nowdatearr[0]<startdatearr[0])nowdatearr[0]+=24
            var answerdate_minute =  ((nowdatearr[0]-startdatearr[0]))*60 + (nowdatearr[1]-startdatearr[1]) ; 
            if(nowdatearr[2]<startdatearr[2])answerdate_minute -=1
            if(nowdatearr[2]<startdatearr[2]) nowdatearr[2]+=60
            var answerdate_seconds = nowdatearr[2]-startdatearr[2] ;
            answerdate  = answerdate_minute+':'+ answerdate_seconds
           
            // console.log('我是提交作业页面的答题时间',answerdate)
            const params ={
              answerTime:answerdate,
              paperId : this.state.paperId,
              userName : 'ming6051',
              status:change_status,
              noAnswerQueId:noSubmitID
            }
            if(noSubmitID!='-1'){
                //弹框提醒  是否要继续提交
                alert('还有未作答题目,是否提交？')
                //确定就提交，取消就不提交
            }else{
                alert('提交导学案了！')
            }
            // this.props.navigation.navigate(
            //   {
            //     name:"Home", 
            //     params: {
            //       learnId: this.state.paperId,
            //       status:change_status
            //             },
            //     megre:true
            // }
            // ) 
            //提交作业代码
            // http.get(url,params).then((resStr)=>{
            //         let resJson = JSON.parse(resStr); 
            
            //根据返回结果的success确定 是否提交成功，  结果数据：{"message":"导学案提交成功！","data":null,"success":"true"}
            //提交过程设置loading效果
                  
    }

  render() {
    const data = this.state.data
    const  width = Dimensions.get('window').width;
    //动态拼接已经作答的题目答案
      var result= [];
      for(let result_Item=0;result_Item < data.length ;result_Item++){
        result.push(
            <TouchableOpacity key={result_Item} 
                //设置一个函数  传递一个index参数控制跳转做题第几题。
                 //onPress={this.props.navigation.getState().routes[2].getSelectIndex()}
                 onPress={()=>
                  { 
                    
                    this.props.navigation.navigate(
                      {
                        name:"DoLearningGuide", 
                        params: {
                                  learnId: this.props.paperId, 
                                  status: this.props.submit_status, //导学案状态
                                  selectedindex: result_Item,
                                  papername:this.props.papername,
                                },
                        megre:true
                      });
                  }}
                >
            <View key={result_Item}  style={styles.result}>
                    {/* 序号 */}
                    <Text style={{marginRight:10}}>({this.state.data[result_Item].order})</Text>
                    {/* 具体答案  or   红色的未答 */}
                    {this.state.data[result_Item].stuAnswer!=''
                    ? <RenderHtml contentWidth={width} source={{html:this.state.data[result_Item].stuAnswer}}/>
                    : <Text style={{color:'red'}}>未学</Text>
                    } 
            </View>
            </TouchableOpacity> )
      }
      if(this.state.success){
          return (
            <View style={{color:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5}}>
              {/* 答案预览区域 */}
              <ScrollView style={styles.preview_area}>
                      {/* 题目展示内容：序号 + 答案 */}
                      {result}
              </ScrollView>
              {/* 提交导学案按钮区域 */}
              <View style={styles.submit_area}>
                  <Button onPress={()=>{
                    this.submit_answer()
                  }
              } style={styles.bt_submit} title='交导学案'></Button>
              </View>
            </View>
          )
      }else{
        return (<View><Loading show={true}/></View>)
      }
  }
}

const styles = StyleSheet.create({
    preview_area:{height:"90%",paddingBottom:50,paddingTop:10},
    result:{paddingLeft:20,paddingRight:20,paddingTop:10,paddingBottom:10,flexDirection:'row',borderColor:"#000000",borderBottomWidth:0.5},
    bt_submit: { marginRight:20,},
    submit_area:{paddingLeft:30,paddingTop:20,paddingBottom:20,paddingRight:30},
  });